import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
import OTP from "../models/otp.js";

dotenv.config();

const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "ecomjob321@gmail.com",
        pass: "xdqaigthqsgufhhh"
    }
})

export function registerUser(req, res) {
    const data = req.body;

    data.password = bcrypt.hashSync(data.password, 10);

    const newUser = new User(data);

    newUser.save().then(() => {
        res.json({ message: "User registered successfully" });
    }).catch((error) => {
        res.status(500).json({ error: "User registration failed" });
    });
}

export function loginUser(req, res) {
    const data = req.body;

    User.findOne({
        email: data.email,
    }).then((user) => {
        if (user == null) {
            res.status(404).json({ error: "User not found" });
        } else {
            if (user.isBlocked) {
                return res.status(403).json({ error: "User is blocked. please contact the admin" });
            }
            const isPasswordCorrect = bcrypt.compareSync(data.password, user.password);

            if (isPasswordCorrect) {
                const token = jwt.sign({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    profilePicture: user.profilePicture,
                    phone: user.phone,
                    emailVerified: user.emailVerified
                }, process.env.JWT_SECRET);

                res.json({ message: "Login successful", token: token, user: user });
            } else {
                res.status(401).json({ error: "Login failed" });
            }
        }
    });
}

export function isItAdmin(req) {
    let isAdmin = false;
    if (req.user != null) {
        if (req.user.role === "admin") {
            isAdmin = true;
        }
    }

    return isAdmin;
}

export function isItCustomer(req) {
    let isCustomer = false;
    if (req.user != null) {
        if (req.user.role === "customer") {
            isCustomer = true;
        }
    }

    return isCustomer;
}

export async function getAllUsers(req, res) {
    if (isItAdmin(req)) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (e) {
            res.status(500).json({ error: "Failed to fetch users" });
        }
    } else {
        res.status(403).json({ error: "Access denied" });
    }
}

export async function blockOrUnblockUser(req, res) {
    const email = req.params.email;

    if (isItAdmin(req)) {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const isBlocked = !user.isBlocked;

            await User.updateOne({ email }, { isBlocked });

            const updatedUser = await User.findOne({ email });

            res.json({ message: "User status updated", user: updatedUser });

        } catch (e) {
            res.status(500).json({ error: "Failed to update user status" });
        }
    } else {
        res.status(403).json({ error: "Unauthorized access" });
    }
}
export function getUser(req, res) {
    if (req.user != null) {
        res.json(req.user);

    } else {
        res.status(403).json({ error: "Unauthorized access" });

    }
}

export async function loginWithGoogle(req, res) {
    //https://www.googleapis.com/oauth2/v3/userinfo
    const accessToken = req.body.accessToken;
    console.log(accessToken);
    try {

        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        console.log(response.data);
        const user = await User.findOne({
            email: response.data.email
        })
        if (user != null) {
            const token = jwt.sign({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                phone: user.phone,
                emailVerified: true

            }, process.env.JWT_SECRET);

            res.json({ message: "Login successful", token: token, user: user });
        } else {
            const newUser = new User({
                email: response.data.email,
                password: "123",
                firstName: response.data.given_name,
                lastName: response.data.family_name,
                address: "Not Given",
                phone: "Not given",
                profilePicture: response.data.picture,
                emailVerified: true,
            });
            const savedUser = await newUser.save();
            const token = jwt.sign({
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                role: savedUser.email,
                role: savedUser.role,
                profilePicture: savedUser.profilePicture,
                phone: savedUser.phone,

            },
                process.env.JWT_SECRET
            );
            res.json({ message: "Login successful", token: token, user: savedUser });
        }

    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Failed to login with google" });
    }
}
export async function sendOtp(req, res) {
    if (req.user == null) {
        res.status(403).json({ error: "Unauthorized" })
        return;
    }
    //generate number between 1000 and 9999
    const otp = Math.floor(Math.random() * 9000) + 1000;
    //save otp in database
    const newOTP = new OTP({
        email: req.user.email,
        otp: otp
    })
    await newOTP.save();


    const message = {
        from: "ecomjob321@gmail.com",
        to: req.user.email,
        subject: "Validating OTP",
        text: "Your OTP code is " + otp
    }
    transport.sendMail(message, (err, info) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Failed to send successfully" })
        } else {
            console.log(info)
            res.json({ message: "OTP send successfully" })
        }
    });


}

export async function verifyOTP(req, res) {
    if (req.user == null) {
        res.status(403).json({ error: "Unauthorized" })
        return;
    }
    const code = req.body.code;

    const otp = await OTP.findOne({
        email: req.user.email,
        otp: code
    })

    if (otp == null) {
        res.status(404).json({ error: "Invalid OTP" })
        return;

    } else {
        await OTP.deleteOne({
            email: req.user.email,
            otp: code
        })

        await User.updateOne(
            { email: req.user.email },
            { $set: { emailVerified: true } }
        );

        res.status(200).json({ message: "Email verified successfully" })
    }

}
