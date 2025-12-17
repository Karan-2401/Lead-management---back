const mongoose = require("mongoose");
const lead_api = new mongoose.Schema({
  name: {
    type: String,
    required: True,
    trim: true,
  },
  api: {
    type: String,
    required: false,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
},{ timestamps: true });

module.exports = mongoose.model('lead_api',lead_api)