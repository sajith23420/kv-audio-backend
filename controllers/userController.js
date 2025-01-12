import User from "../models/user.js";

export function registerUser(req,res){

    const newUser = new User(req.body)

    newUser.save().then(()=>{
        res.jason({message : "User registerd successfully"})
    }).catch((error)=>{
        res.status(500).jason({error : "User registration faild"})
    })

}