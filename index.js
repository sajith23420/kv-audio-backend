import express from "express"
import bodyParser from "body-parser";
import mongoose from "mongoose";
import Student from "./models/student.js";
import studentRouter from "./routes/studentRoute.js";

let app = express()

app.use(bodyParser.json());

let mongoUrl = "mongodb+srv://admin:123@cluster0.ju1gn.mongodb.net/Prods?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongoUrl)

let connection = mongoose.connection
connection.once("open",()=>{
    console.log("MongoDB connection established successfully")
})


app.get("/" ,
    (req,res) => {
       

        Student.find().then(
            (result)=>{
                res.json(result) 
            }
        ).catch(
            ()=>{
                res.json({
                    message: "error occured"
                })
            }
        )
    }
);

app.post("/" ,
    (req,res) => {
        
       
        let newStudent = req.body

        let student = new Student(newStudent )

        student.save().then(
            ()=>{
                res.json(
                    {
                        massage : "Studnt saved successfully"
                    }
                )
            }
        ).catch(
            ()=>{
                 res.json(
                    {
                        message : "Student could not be saved"
                    }
                )
            }
        )

    }
);

app.delete("/" ,
    (req,res) => {
        console.log("This is a delete reqest")  
    }
);


app.listen(3000,()=>{
    console.log("Server is Running on port 3000")
})