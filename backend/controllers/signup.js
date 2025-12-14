const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { uploadImageToCloudinary } = require('../utils/imageUploader');


require("dotenv").config();

const tempStorage = {};


exports.signupToken = async (req, res) => {
    try{
         
    const { username, email, password, confirmPassword } = req.body;
     if( confirmPassword !== password){
            return res.status(401).json({
                success: false,
                message: "Password and Confirm Password do not match",
            });
        }
        
    const existingUser = await User.findOne( {email: email})
        if(existingUser){
            return res.status(401).json({
                success: false,
                message: "User already exists",
            }) }
       
    tempStorage[email] = {
        username,
        password, 
        otp:null,
        expiresAt: Date.now() + 5 * 60 * 1000
    };       

    setTimeout(() => {
    delete tempStorage[email];
    }, 5 * 60 * 1000);
            
        const token = jwt.sign(
            {email, },
            process.env.JWT_SECRET, {
                expiresIn: "5m"
            }
        );
        
        return res.status(200).json({
            success:true,
            message:"Temporary signup token created",
            token,
        })

    }
    catch(error){
       
         return res.status(401).json({
                success: false,
                message: error.message,
            });
    } }



  async function signup(copyEmail) {
     if (!tempStorage[copyEmail]) return false;
       try {
        const email = copyEmail;
        const password = tempStorage[email].password;
        const username = tempStorage[email].username;
        const existingUser = await User.findOne( {email: email})
        if(existingUser){
            console.error("User already exists");
            return false;
        } 

        const hashedPassword = await bcrypt.hash(password, 10);
        const img = await uploadImageToCloudinary();
        const newUser = await User.create ( { username:username ,email: email, password: hashedPassword, profile: img});  
        

        return true;
    }
    catch (error) {
        console.error("Signup Failed:", error);
        return false;
    }
}
 

const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');


exports.sendOtp = async (req, res) => {
    try{

         const authHeader = req.headers.authorization;
if (!authHeader) 
    return res.status(400).json({ message: "Missing token" });

const token = authHeader.split(" ")[1];  
const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const email = decoded.email;

 if (!tempStorage[email] || Date.now() > tempStorage[email].expiresAt) {
    delete tempStorage[email];
    return res.status(400).json({ message: "Signup session expired" });
}


    const otp = otpGenerator.generate(4, {
        digits:true,
        lowerCaseAlphabets:false,
        upperCaseAlphabets:false,
        specialChars:false,
        alphabets:false,
    })

    let transporter = nodemailer.createTransport(
        {
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        }
    )

    tempStorage[email].otp = otp;

        await transporter.sendMail({
        from: 'With love',
        to: `${email}`,
        subject: "Your OTP for verification",
        html: `<h1>Your OTP for verification is ${otp}</h1>`,
    })
        
    return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            email,
            token
        })
    }

    catch(error){
        return res.status(500).json({
      success: false,
      message: error.message
    });
    }
  
}

exports.verifyOtp = async (req, res) => {
    try{
    const { otp } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader) 
    return res.status(400).json({ message: "Missing token" });

    const token = authHeader.split(" ")[1];  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const copyEmail = decoded.email;
    if (!tempStorage[copyEmail]) {
  return res.status(400).json({ message: "Signup session expired" });
}
    const oldotp = tempStorage[copyEmail].otp;
    
    if (!oldotp) return res.status(400).json({ message: "OTP not generated" });

    if (!copyEmail) {
            return res.status(400).json({ success: false, message: "Email missing" });
        }
    
    if( oldotp === String(otp) ){
        if( !(await signup(copyEmail))){return res.status(400).json({ success: false, message: "user already exists" });}
        const signupToken = jwt.sign(
            { email: copyEmail},
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.cookie("signupAuthToken", signupToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax", 
            path:"/", 
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        
        delete tempStorage[copyEmail];
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
        })
    }
    else {
        return res.status(400).json({
            success: false,
            message: "Invalid OTP",
        })

    }  }
    catch(error){
    return res.status(500).json({
      success: false,
      message: error.message
    });
    }

 
}


