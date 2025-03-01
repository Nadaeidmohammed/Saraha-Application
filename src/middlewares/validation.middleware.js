import { Types } from "mongoose";
import { rolesTypes } from "../DB/models/user.models.js";
import joi from "joi"
export const validation=(schema)=>{
   return (req,res,next)=>{
    const data={...req.body,...req.query,...req.params}
    const results =schema.validate(data,{abortEarly:false})
    if(results.error)
    {
        const errorMessages = results.error.details.map((obj) => obj.message);
        return next(new Error(errorMessages,{cause:400}))
    }
    return next();
   }
}
export const isValidObjectId=(value,helper)=>{
    if(Types.ObjectId.isValid(value))
        return true
    return helper.message("Message must be valid ObjectId")
}

export const generalFields={
     userName:joi.string().min(3).max(20),
        email:joi.string().email(),
        password:joi.string(),
        confirmPassword:joi.string().valid(joi.ref("password")),
        gender:joi.boolean(),
        phone:joi.string(),
        role:joi.string().valid(...Object.values(rolesTypes)),
        code:joi.string().pattern(new RegExp(/^[0-9]{5}$/))
}