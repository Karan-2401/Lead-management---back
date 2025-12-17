const express = require('express')
const dotenv = require("dotenv");
const app = express();
const User = require('./routes/User')
const Lead = require('./routes/Lead')
const connectDB = require('./config/db-connection')
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
require('dotenv').config()

app.use(express.json())
// cors setup
app.use(
    cors({
        origin:process.env.frontURL,
        credentials:true
    })
)
app.use(morgan('combined'))
app.use(cookieParser()); 
// database connection
connectDB()

// routes
app.use('/',User)
app.use('/lead',Lead)

module.exports = app;