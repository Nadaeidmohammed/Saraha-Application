import { EventEmitter } from "events";
import { signupEmail, template } from "./generateHtml.js";
import  { subject,sendEmail } from "./sendEmail.js";
import { generateToken } from "../token/token.js";
import { customAlphabet } from "nanoid";
import {hash} from "../../utils/hashing/hash.js"
import userModel from "../../DB/models/user.models.js"
export const emailEmitter=new EventEmitter();
 emailEmitter.on("sendEmail",async(email,userName)=>{
    const token=generateToken({payload:{email},signature:process.env.TOKEN_SECRET_EMAIL})
        const link=`http://localhost:3000/auth/acvtivate-account/${token}`
        const isSent=await sendEmail({
            to:email,
            subject:subject.register,
            html:signupEmail(link,userName)
        })
        if (!isSent) throw new Error("Email Not Sent");
})
emailEmitter.on("forgetPassword",async(email,userName)=>{
    const otp = customAlphabet("0123456789",5)();
    const hashOTP=hash({plainText:otp})
    const expireTime = Date.now() + 5 * 60 * 1000;//5 min
    await userModel.updateOne({email},{forgetPasswordOTP:hashOTP,otpExpireTime:expireTime})
  
  await sendEmail({
    to:email,
    subject:subject.resetPassword,
    html:template(otp,userName,subject.resetPassword)
  })
  })