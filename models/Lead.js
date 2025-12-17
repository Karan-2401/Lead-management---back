const mongoose = require("mongoose");

const Lead = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  assigned_to: {
    type: Number,
    default : null
  },
  status:{
    type: String,
    required: true,
  },
  value:{
    type: Number,
    required: true,
  }
},{timestamps:true});

module.exports = mongoose.model('Lead',Lead)