import userModel from "../../DB/models/user.models.js"
import { decrypt, encrypt } from "../../utils/encryption/encryption.js";
import { compare,hash } from "../../utils/hashing/hash.js";
export const getUser=async(req,res,next)=>{
       const{user}=req;
     user.phone=decrypt({encrypted:user.phone,signature:process.env.ENCRYPTION_SECRET});
        return res.status(500).json({message:"all users Found",results:user})
}
export const updateProfile=async(req,res,next)=>{
    if(req.user.phone)
        req.user.phone=encrypt({plainText:req.user.phone,signature:process.env.ENCRYPTION_SECRET})
    const updatedUser=await userModel.findByIdAndUpdate(req.user._id,
        {...req.body},
        {new:true,runValidators:true}
    )
    return res.status(200).json({
        success:true,
        message:"update Profile",
        results:{user:updatedUser}
    })
}
export const changePassword=async(req,res,next)=>{
    const{oldPassword,password}=req.body;
    //check if oldPassword is correct
  const compareHash= compare({plainText:oldPassword,hash:req.user.password});
  if(!compareHash)
    return next(new Error("Old password is incorrect",{cause:400}))

    const hashPassword= hash({plainText:password})
  
    const updatedUser=await userModel.findByIdAndUpdate(req.user._id,
       { password:hashPassword,changedAt:Date.now()},
        {new:true,runValidators:true}
    )
    if (!updatedUser) {
        return next(new Error("User not found", { cause: 404 }));
    }
    return res.status(200).json({
        success:true,
        message:"password updated successfully",
        results:{user:updatedUser}
    })
}
export const deactivateAccount=async(req,res,next)=>{

    const user =await userModel.findByIdAndUpdate(req.user._id,
        {isDeleted:true,changedAt:Date.now()},
        {new:true,runValidators:true},
    )
    return res.status(200).json({
        success:true,
        message:"Account Deactivated ",
        results:{user}
    })
}
