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
console.log(process.env.frontURL)
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '10000mb' }));
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

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong"
  });
});

module.exports = app;