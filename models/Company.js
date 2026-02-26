const mongoose = require("mongoose");

const Company = new mongoose.Schema({
    _id: String,
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    website:{
        type:String,
        unique:true,
        default:null
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
         type:String,
        required:true 
    },
    zipcode:{
        type:String,
        required:true 
    },
    image:{
        type:String,
        default:null,
    }
})


module.exports = mongoose.model('Company',Company)