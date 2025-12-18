const express = require("express");
const route = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const Lead = require("../models/Lead");

route.post("/add", verifyToken, async (req, res) => {
  try {
    const {
      fullName,
      company,
      email,
      phone,
      source,
      status,
      assignTo,
      leadValue,
    } = req.body;
    const phone2 = Number(phone);
    const value = Number(leadValue);
    const lead = await Lead.insertOne({
      name: fullName,
      email: email,
      phone: phone2,
      company: company,
      source: source,
      assigned_to: assignTo,
      status: status,
      value: value,
    });
    if (!lead) {
      res.status(500).json({ msg: "server error" });
    }
    res.status(201).json({ msg: "Lead is created" });
  } catch (error) {
    console.log(error);
  }
});

route.get("/getAllLeads", verifyToken, async (req, res) => {
  try {
    const Leads = await Lead.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "assigned_to",
          foreignField: "phone",
          as: "employee",
        },
      },
      {
        $unwind: {
          path: "$employee",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    res.status(200).json({ msg: "Data", data: Leads });
  } catch (error) {
    console.log(error);
  }
});

route.put("/updateLead", async (req, res) => {
  try {
    const {
      fullName,
      company,
      email,
      phone,
      source,
      status,
      assignTo,
      leadValue,
    } = req.body;
    const num = Number(phone);
    const update = await Lead.updateOne(
      { phone: phone },
      {
        $set: {
          name: fullName,
          email: email,
          phone: num,
          company: company,
          source: source,
          assigned_to: assignTo,
          status: status,
          value: leadValue,
        },
      }
    );
    if (!update) {
      res.status(500).json({ msg: "server error" });
    }
    res.status(201).json({ msg: "lead is updated" });
  } catch (error) {
    console.log(error)
  }
});

route.put("/updateLeadEmp", async (req, res) => {
  try {
    const {
      name,
      company,
      email,
      phone,
      source,
      status,
      leadValue,
    } = req.body;
    const num = Number(phone);
    const update = await Lead.updateOne(
      { phone: phone },
      {
        $set: {
          name: name,
          email: email,
          phone: num,
          company: company,
          source: source,
          status: status,
          value: leadValue,
        },
      }
    );
    if (!update) {
      res.status(500).json({ msg: "server error" });
    }
    res.status(201).json({ msg: "lead is updated" });
  } catch (error) {
    console.log(error)
  }
});

route.delete('/deleteLead/:id',async(req,res)=>{
 try {
  const {id} = req.params;
  const ph = Number(id)
  const deleteLead = await Lead.findOneAndDelete({phone:ph})
  if(!deleteLead){
    res.status(500).json({'msg':'server error'})
  }
  res.status(201).json({'msg':'lead is removed'})
 } catch (error) {
  console.log(error)
 }
})

route.get('/getAllLeadEmp/:id',async(req,res)=>{
 try {
   const {id} = req.params;
  const ph = Number(id)
  const data = await Lead.find({assigned_to:ph})
  if(!data){
    res.status(500).json({'msg':'server error'})
  }
  res.status(200).json({'msg':'all employees lead','data':data})
 } catch (error) {
  console.log(error)
 }
})

module.exports = route;
