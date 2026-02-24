const express = require("express");
const router = express.Router();
const imageUploader = require("../middleware/imageUploader");
const verifyToken = require("../middleware/auth.middleware");
const Company = require("../models/Company");

router.post(
  "/createCompany",
  verifyToken,
  imageUploader.single("image"),
  async (req, res) => {
    try {
      const { filename } = req.file;
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

      const company = new Company({
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

module.exports = router;
