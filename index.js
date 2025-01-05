import express from "express"
import bodyParser from "body-parser";
import mongoose from "mongoose";
import studentRouter from "./routes/studentRoute.js";

let app = express()

app.use(bodyParser.json());

let mongoUrl = "mongodb+srv://admin:123@cluster0.ju1gn.mongodb.net/Prods?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongoUrl)

let connection = mongoose.connection
connection.once("open",()=>{
    console.log("MongoDB connection established successfully")
})


app.use("/students",studentRouter)


app.listen(3000,()=>{
    console.log("Server is Running on port 3000")
})