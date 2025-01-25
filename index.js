import express from "express"
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import jwt from "jsonwebtoken";


const app = express()

app.use(bodyParser.json());
app.use((req,res,next)=>{
    
    let token = req.header
    ("Authorization")

    if(token!=null){
        token = token.replace("Bearer ","")
        console.log(token);
        jwt.verify(token,"kv-secret-89!",
            (err,decoded)=>{
                
                if(!err){
                    req.user = decoded;
                }
            });
    }
    next()
})

let mongoUrl = "mongodb+srv://admin:123@cluster0.ju1gn.mongodb.net/Prods?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongoUrl)

const connection = mongoose.connection

connection.once("open",()=>{
    console.log("MongoDB connection established successfully")
})


app.use("/api/users",userRouter)
app.use("/api/products",productRouter)

app.listen(3000,()=>{
    console.log("Server is Running on port 3000")
})