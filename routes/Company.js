const express = require("express");
const router = express.Router();
const imageUploader = require("../middleware/imageUploader");
const verifyToken = require("../middleware/auth.middleware");
const Company = require("../models/Company");
const randomNumberGenerator = require("../functions/randomNumberGenerator");

// create company
router.post(
  "/createCompany",
  imageUploader.single("image"),
  async (req, res) => {
    try {
      const randomCode = randomNumberGenerator(9, 0, 9);
      console.log(randomCode);
      const {
        companyName,
        email,
        phone,
        website,
        address,
        city,
        state,
        zipCode,
      } = req.body;
      const filename = req.file ? req.file.filename : null;

      const company = new Company({
        _id: companyName + phone + randomCode,
        name: companyName,
        email: email,
        phone: phone,
        website: website ? website : null,
        address: address,
        city: city,
        state: state,
        zipcode: zipCode,
        image: filename ? filename : null,
      });

      const info = await company.save();
      if (!info) {
        res.status(500).json({ msg: "server error" });
      }
      res.status(201).json({ msg: "Company is created" });
    } catch (error) {
      console.log(error);
    }
  },
);

// update Company
router.patch(
  "/updateCompany/:id",
  imageUploader.single("image"),
  async (req, res) => {
    try {
      const {
        companyName,
        email,
        phone,
        website,
        address,
        city,
        state,
        zipCode,
      } = req.body;

      const filename = req.file ? req.file.filename : null;

      const updateData = {
        name: companyName,
        email,
        phone,
        website: website || null,
        address,
        city,
        state,
        zipcode: zipCode,
      };

      if (filename) {
        updateData.image = filename;
      }

      const update = await Company.updateOne(
        { _id: req.params.id },
        { $set: updateData },
      );

      return res.status(200).json({
        statusCode: 200,
        Heading: "Company Updated",
        msg: "company's information is save",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        statusCode: 500,
        Heading: "Server Error",
        msg: "server is getting errors",
      });
    }
  },
);

// getallcompany
router.get('/getAllCompany',verifyToken,async(req,res)=>{
  try {
   const data = await Company.find();
   if(data){
    return res.status(200).json({
        statusCode: 200,
        Heading: "Company List",
        msg: "company list",
        data:data
      });
   }
  } catch (error) {
     res.status(500).json({ error: error.message });
  }
})

// get single company
router.get('/getCompany/:id',verifyToken,async(req,res)=>{
  try {
    const {id} = req.params;
    data = await Company.findOne({_id:id})
     return res.status(200).json({
        statusCode: 200,
        Heading: "Company",
        msg: "company",
        data:data
      });
  } catch (error) {
     res.status(500).json({ error: error.message });
  }
})

// delete company
router.delete('/delete/:id',verifyToken,async(req,res)=>{
  try {
    const {id} = req.params
    const data = await Company.deleteOne({_id:id})
    if(!data){
      return res
        .status(404)
        .json({ msg: "User not found", statusCode: 404, Heading: "No User" });
    }
    res.json({
      msg: "Company deleted successfully",
      statusCode: 200,
      Heading: "Company Deleted",
    });
  } catch (error) {
     res.status(500).json({ error: error.message });
  }
})
module.exports = router;
