require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.authcheck = async (req, res) => {
    try{
        const token = req.cookies.loginAuthToken || req.cookies.signupAuthToken;
        if(!token){
            return res.status(200).json({
                loggedIn: false})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        return res.status(200).json({
            loggedIn: true,
            email: decoded.email,
        });
        
    }
    catch(error){
        return res.status(401).json({ loggedIn: false });
    }
}


exports.logout = async (req, res) => {
    try{
        res.clearCookie("loginAuthToken", 
            {
            httpOnly: true,
            secure: false,   
            sameSite: "lax",
            path: "/"
            }
        )
        res.clearCookie("signupAuthToken", 
            {
            httpOnly: true,
            secure: false,   
            sameSite: "lax",
            path: "/"
            }
        )
        return res.status(200).json({
           success: true,
            message: "Logged out successfully",
            loggedIn: false
        });
        
    }
    catch(error){
        return res.status(401).json({ loggedIn: false });
    }
}
