const express = require("express");
const router = express.Router();
const imageUploader = require("../middleware/imageUploader");
const verifyToken = require("../middleware/auth.middleware");
const Company = require("../models/Company");
const randomNumberGenerator = require('../functions/randomNumberGenerator');

router.post(
  "/createCompany",
  imageUploader.single("image"),
  async (req, res) => {
    try {
      const randomCode = randomNumberGenerator(9,0,9);
      console.log(randomCode)
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
      const {filename} = req.file

      const company = new Company({
        _id:companyName+phone+randomCode,  
        name: companyName,
        email: email,
        phone: phone,
        website: website ? website : null,
        address: address,
        city: city,
        state: state,
        zipcode: zipCode,
        image:filename ? filename : null,
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

module.exports = router;
