const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs")
const crypto = require("crypto") 
// import cloudinary from "../utils/cloudinary.js";
const { generateVerificationCode } = require("../utils/generateVerificationCode.js")
const { generateToken } = require("../utils/generateToken.js")
const { sendPasswordResetEmail, sendResetSuccessfulEmail, sendVerificationEmail, sendWelcomeEmail } = require("../mailtrap/email.js")


module.exports.signup = async(req, res) => {
    try {
        const {fullname, email, password, contact, admin} = req.body;

        let user = await User.findOne({email})
        if(user){
            return res.status(400).json({
                success : false,
                message : "User already exist with this email"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationCode= generateVerificationCode(6)

        user = await User.create({
            fullname,
            email,
            password : hashedPassword,
            contact : Number(contact),
            admin : admin === "true" ? true : false,
            verificationCode,
            verificationCodeExpiresAt : Date.now()+24*60*60*1000 //1day
        })
        generateToken(res, user)
        await sendVerificationEmail(email, verificationCode)
        const userWithoutPassword = await User.findOne({email}).select("-password")
        return res.status(201).json({
            success : true,
            message : "Account created successfully",
            user : userWithoutPassword
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal Server Error"});
    }
}

module.exports.login = async(req, res) => {
    try {
        const {email, password, admin} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success : false,
                message : "Incorrect email or password"
            });

        }
        if(!user.isVerified){
            return res.status(400).json({
                success : false,
                message : "Email not verified"
            });

        }
        
        const isCorrectPassword = await bcrypt.compare(password, user.password)
        if(!isCorrectPassword){
            return res.status(400).json({
                success : false,
                message : "Incorrect email or password"
            });

        }
        if(user.admin !== (admin === "true" ? true : false)){
            return res.status(400).json({
                success : false,
                message : "Incorrect email or password"
            });

        }
        generateToken(res, user)
        user.lastLogin = new Date();
        await user.save()

        const userWithoutPassword = await User.findOne({email}).select("-password")
        return res.status(200).json({
            success : true,
            message : `Welocme back ${user.fullname}`,
            user : userWithoutPassword
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal Server Error"});
    }
}

module.exports.sendVerificationCode = async(req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success : false,
                message : "Incorrect email"
            });
        }
        if(user.isVerified){
            return res.status(400).json({
                success : false,
                message : "Email already verified"
            });
        }

        const verificationCode= generateVerificationCode(6)
        await sendVerificationEmail(email, verificationCode)
        user.verificationCode = verificationCode;
        user.verificationCodeExpiresAt = Date.now()+24*60*60*1000 //1day
        await user.save()
        return res.status(200).json({
            success : true,
            message : "Verification code sent to your email",
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal Server Error"});
    }
}

module.exports.verifyEmail = async(req, res) => {
    //verify code sent to email
    try {
        const {verificationCode} = req.body;
        const user = await User.findOne({verificationCode : verificationCode, verificationCodeExpiresAt : {$gt : Date.now()}}).select("-password")

        if(!user){
            return res.status(400).json({
                success : false,
                message : "Invalid or Expired verification code"
            })

        }
        
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpiresAt = undefined;
        await user.save()

        //send welcome email
        await sendWelcomeEmail(user.email, user.fullname)

        return res.status(200).json({
            success : true,
            message : "Email verified successfully",
            user
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal Server Error"});
    }
}

module.exports.logout = async(req, res) => {
    try {
        return res.clearCookie("token").status(200).json({
            success : true,
            message : "Looged out successfully"
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal Server Error"});
    }
}

module.exports.forgotPassword = async(req, res) => {
    //sent reset password link to email
    try {
        const {email} = req.body;
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success : false,
                message : "User doesn't exist "
            });

        }
        const resetToken = crypto.randomBytes(40).toString("hex");
        const resetTokenExpiresAt = new Date(Date.now() + 1*60*60*1000); //1hr
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save()

        //send email
        await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/reset-password/${resetToken}`)
        return res.status(200).json({
            success : true,
            message : "Password reset link sent to your email"
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal Server Error"});
    }
}

module.exports.resetpassword = async(req, res) => {
    try {
        const {resetToken} = req.params;
        const {newPassword} = req.body;
        const user = await User.findOne({resetPasswordToken : resetToken, resetPasswordTokenExpiresAt : {$gt : new Date(Date.now())}})
        if(!user){
            return res.status(400).json({
                success : false,
                message : "Invalid or Expired verification link"
            });

        }
        
        //update password
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();

        //send successfully password changed email
        await sendResetSuccessfulEmail(user.email)

        return res.status(200).json({
            success : true,
            message : "Password reset successfully"
        });
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal Server Error"});
    }
}

module.exports.checkAuth = async(req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({
                success : false,
                message : "User not found"
            });

        }
        return res.status(200).json({
            success : true,
            user
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal Server Error"});
    }
}

// module.exports.updateProfile = async(req, res) => {
//     try {
//         const userId = req.id;
//         const {fullname, email, address, city, country, profilePicture} = req.body;
//         //upload image on cloudinary
//         let cloudResponse:any;
//         cloudResponse = await cloudinary.uploader.upload(profilePicture);
//         const updatedData = {fullname, email, address, city, country, profilePicture}
        
//         const user = await User.findByIdAndUpdate(userId, updatedData, {new : true}).select("-password");

//         return res.status(200).json({
//             success : true,
//             message : "Profile updated successfully",
//             user
//         });

//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({message : "Internal Server Error"});
//     }
// }