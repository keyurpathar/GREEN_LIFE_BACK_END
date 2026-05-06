require('dotenv').config()
const express = require("express")
const cors = require("cors");
const connectDB = require('./config/mongodb');

const app = express();
const port = process.env.PORT || 8000
connectDB()


app.use(express.json())
app.use(cors())

app.get('/' , (req,res)=> {
    res.send("huiiiiii")
})

app.listen(port , () => {
    console.log("http://localhost:8000 , SERVER STARTED")
})