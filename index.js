import express from "express"
import bodyParser from "body-parser";
import mongoose from "mongoose";


const app = express()

app.use(bodyParser.json());

let mongoUrl = "mongodb+srv://admin:123@cluster0.ju1gn.mongodb.net/Prods?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongoUrl)

const connection = mongoose.connection

connection.once("open",()=>{
    console.log("MongoDB connection established successfully")
})




app.listen(3000,()=>{
    console.log("Server is Running on port 3000")
})