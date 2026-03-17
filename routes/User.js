const express = require("express");
const route = express.Router();
const User = require("../models/User");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth.middleware");

route.post("/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        msg: "All fields are required",
      });
    }

    // const user = await User.findOne({ email: email });
    const user = await User.aggregate([
      {
        $match: { email: email },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "phone",
          foreignField: "user_id",
          as: "profile",
        },
      },
      {
        $lookup: {
          from: "companies",
          localField: "company_id",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$profile" },
      { $unwind: "$company" },
    ]);
    if (user.length === 0) {
      return res.status(400).json({
        msg: "No User with this email",
        statusCode: 404,
        Heading: "No User",
      });
    }

    const Data = new User(user[0]);
    if (typeof Data.comparePassword !== "function") {
      return res.status(500).json({
        msg: "Password comparison method is not available",
      });
    }
    const auth = await Data.comparePassword(password);
    if (!auth) {
      res
        .status(401)
        .json({
          msg: "Unauthentication error may be your password is wrong",
          statusCode: 401,
          Heading: "Password incorrect",
        });
    } else {
      const token = jwt.sign({ userId: user.phone }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.cookie("lmstoken", token, {
        httpOnly: true, // Prevent access to the cookie from JavaScript
        secure: process.env.NODE_ENV === "production", // Set 'secure' to true in production for HTTPS
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      res.json({
        msg: "login successfull",
        data: user,
        statusCode: 200,
        Heading: "Login Successfull",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

route.post("/createuser", verifyToken, async (req, res) => {
  try {
    const { name, email, phone, role, password,company_id } = req.body;
    if (!name || !email || !phone || !role || !password || !company_id) {
      return res.status(400).json({
        msg: "all fields are required.",
        statusCode: 400,
        Heading: "Fields Required",
      });
    }
    const userData = await User.insertOne({
      name: name,
      phone: phone,
      email: email,
      password: password,
      company_id: company_id,
    });

    const userProfile = await Profile.insertOne({
      user_id: phone,
      role: role,
    });

    if ((userData, userProfile)) {
      return res.status(201).json({
        msg: "user is created",
        statusCode: 201,
        Heading: "User Created",
      });
    }
    res
      .status(500)
      .json({ msg: "server error", statusCode: 500, Heading: "Server Error" });
  } catch (error) {
    console.log(error);
  }
});

route.get("/getusers/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id
    const userData = await User.aggregate([
       {
        $match: {
          company_id: id,
        },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "phone",
          foreignField: "user_id",
          as: "profiles",
        },
      },

      { $unwind: "$profiles" },

      {
        $lookup: {
          from: "leads",
          localField: "phone",
          foreignField: "assigned_to",
          as: "leads",
        },
      },
    ]);
    if (!userData) {
      return res
        .status(500)
        .json({
          msg: "There is no user.",
          statusCode: 204,
          Heading: "No User",
        });
    }
    res.status(200).json({
      msg: "User List",
      userData,
      statusCode: 200,
      Heading: "User List",
    });
  } catch (error) {
    console.log(error);
  }
});

route.patch("/updateUser", verifyToken, async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;

    const user = await User.updateOne(
      { phone: phone },
      {
        $set: {
          name: name,
          email: email,
        },
      },
    );

    if (!user) {
      res.status(404).json({  statusCode: 404,
          Heading: "User Not Found",msg:"user is not found" });
    }

    const profile = await Profile.updateOne(
      { user_id: phone },
      {
        $set: {
          role: role,
        },
      },
    );

    if (!profile) {
      res.status(404).json({ msg: "Profile Not Found", statusCode: 404,
          Heading: "No User", });
    }

    res.status(201).json({ msg: "User is Update", statusCode: 200,
          Heading: "User Updated", });
  } catch (error) {
    console.log(error);
  }
});

route.patch('/updateProfile/:id',verifyToken,async(req,res)=>{
  try {
    const {id}= req.params;
    const {email,name} = req.body;
    const user = await User.updateOne(
      { phone: id },
      {
        $set: {
          name: name,
          email: email,
        },
      },
    );

    if (!user) {
      res.status(404).json({  statusCode: 404,
          Heading: "User Not Found",msg:"user is not found" });
    }
    res.status(200).json({ msg: "Profile is updated", statusCode: 200,
          Heading: "Profile Updated", });

  } catch (error) {
    console.log(error);
  }

});

route.patch('/updateProfilePassword/:id',verifyToken, async (req,res)=>{
  try {
    const {id} = req.params;
    const {current_password,new_password,confirm_password} = req.body;
    if(!current_password || !new_password || !confirm_password){
      return res.json({
        msg: "you not filling the all inputs of the form", statusCode: 400,
          Heading: "Bad Request",
      })
    }

    const user = await User.findOne({phone:id})
    if(!user){
      return res.json({
        msg: "there is no user with this phone number", statusCode: 400,
          Heading: "Bad Request",
      })
    }

    const Data = new User(user[0]);

    const auth = await Data.comparePassword(current_password);
    if (!auth) {
      res
        .status(401)
        .json({
          msg: "Unauthentication error may be your password is wrong",
          statusCode: 401,
          Heading: "Password incorrect",
        });
    }

  } catch (error) {
    console.log(error)
  }
})

route.delete("/deleteUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const number = Number(id);
    const user = await User.findOne({ phone: number });
    if (!user) {
      return res.status(404).json({ msg: "User not found", statusCode: 404,
          Heading: "No User",});
    }

    await user.deleteOne();

    res.json({ msg: "User deleted successfully",statusCode: 200,
          Heading: "User Deleted", });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = route;
