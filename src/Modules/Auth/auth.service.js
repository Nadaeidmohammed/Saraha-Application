import userModel from "../../DB/models/user.models.js"; 
import { rolesTypes } from "../../middlewares/auth.middleware.js";
import { emailEmitter } from "../../utils/email/emailEvent.js";
import { compare, hash } from "../../utils/hashing/hash.js";
import { encrypt } from "../../utils/encryption/encryption.js";
import { generateToken, verify } from "../../utils/token/token.js";
export const register=async(req,res,next)=>{
        const{email,password,phone}=req.body;
        const checkUser=await userModel.findOne({email});
        if(checkUser){
            return next(new Error("Email Already Exist",{cause:400}))
        }
        const hashPassword=hash({plainText:password}) 
        const cryptPhone=encrypt({plainText:phone,signature:process.env.ENCRYPTION_SECRET})

        const user =await userModel.create(
            {...req.body,password:hashPassword,phone:cryptPhone}
        );
        emailEmitter.emit("sendEmail",user.email,user.userName)
    return res.status(201).json({success:true,message:"user created successfully",user})
}
export const acctivateAccount=async(req,res,next)=>{
        const{token}=req.params;
        const {email} =verify({token,signature:process.env.TOKEN_SECRET_EMAIL});
        const user =await userModel.findOne({email});
        if(!user)
            return next(new Error("User Not Found",{cause:404})) 
              
        user.confirmEmail=true;
        await user.save();
        return res.status(200).json({success:true,message:"email confirmed successfully"})
}
export const logIn=async(req,res,next)=>{
        const{password,email}=req.body;
        const user=await userModel.findOne({email});
        if(!user)
            return next(new Error("User Not Found",{cause:404}))
        if(user.confirmEmail===false)
            return next(new Error("Please Confirm Your Email",{cause:400}))
        const match =compare({plainText:password,hash:user.password})
        if(!match)
            return next(new Error("Password Does Not Match",{cause:400}))      
        const token =generateToken({
        payload:{id:user._id,isLoggedIn:true},
        signature: user.role===rolesTypes.User?
        process.env.TOKEN_SECRET_USER:process.env.TOKEN_SECRET_ADMIN,
        options: { expiresIn:60*60 }
    });
    if(user.isDeleted==true)
    {
        user.isDeleted = false;
        user.changedAt = Date.now();
        await user.save();
    }
        return res.status(200).json({success:true,message:"user found successfully",token})
}
export const forgetPassword=async(req,res,next)=>{
    const{email}=req.body;
    const user = await userModel.findOne({email,isDeleted:false});
    if(!user)
        return next (new Error("User Not Found",{cause:404}))
  
    emailEmitter.emit("forgetPassword",email,user.userName)

    return res.status(200).json({success:true,message:"OTP Send Successfully"})
}
export const verifyOTP=async(req,res,next)=>{
   const { email, code } = req.body;
   const user = await userModel.findOne({ email, isDeleted: false });

   if (!user) 
       return next(new Error("User Not Found", { cause: 404 }));

   if (!user.otpExpireTime || Date.now() > user.otpExpireTime) 
       return next(new Error("OTP Expired", { cause: 400 }));

   if (!compare({ plainText: code, hash: user.forgetPasswordOTP })) 
       return next(new Error("Invalid OTP", { cause: 400 }));

   return res.status(200).json({ success: true, message: "OTP Verified Successfully" });

}
export const resetPassword=async(req,res,next)=>{
    const{email,password}=req.body;
    const user = await userModel.findOne({email,isDeleted:false});
    if(user)
        return next (new Error("User already exist ",{cause:404}))
  
   const hashPassword=hash({plainText:password})
   await userModel.updateOne({email},{password:hashPassword,forgetPasswordOTP:"",otpExpireTime:""})

    return res.status(200).json({success:true,
        message:"Password Reseted Successfully"
    })
}