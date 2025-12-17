const mongoose = require("mongoose");

const Profile = new mongoose.Schema({
  user_id: {
    type: Number,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  status:{
    type:Boolean,
    required:false,
    default:true
  }
},{timestamps:true});

module.exports = mongoose.model('Profile',Profile)
