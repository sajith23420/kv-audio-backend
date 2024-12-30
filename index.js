import express from "express"
import bodyParser from "body-parser";
import mongoose from "mongoose";

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
        console.log("That is a get reqest")
        res.json(
            {
                message: "Good Night" +req.body.name,
                massage: "My age is" +req.body.age 
            }
        );
    }
);

app.post("/" ,
    (req,res) => {
        
        let studentSchema =mongoose.Schema({
            name : String,
            age : Number,
            height : Number
        })

        let Student = mongoose.model("students",studentSchema)

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