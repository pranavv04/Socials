const mongoose = require('mongoose')
require('dotenv').config();

const mongoUrl = process.env.MONGO_URI;

mongoose.connect(mongoUrl, {
    useNewUrlParser : true,
    useUnifiedTopology:true
})

const db = mongoose.connection;

db.on('connected' , ()=>console.log("Database connnected successfully"))
db.on('disconnected' , ()=>console.log("Database disconnected successfully"))
db.on('error', (error)=>console.log('Database connection error' + error)) 

module.exports = db;