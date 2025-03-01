import mongoose,{Schema} from "mongoose";

export const rolesTypes = {
    User: "User",
    Admin: "Admin"
};
const userSchema=new Schema({
    userName:{
        type:String,
        required:[true,"userName is required"],
        minLength:[3,"userName must be at least 3 characters long"],
        maxLength:[20,"userName must be at most 20 characters long"],
        trim:true
    },
   email:{
    type:String,
    required:[true,"email is requeierd"],
    trim:true,
    lowercase:true,
    unique:[true,"must be unique"],
    match:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password:{
       type:String,
       required:[true,"password  is requeierd"],
    },
    gender:{
        type:String,
        enum:{
            values:["male","female"],
            message:"gender must be male or female",
        },
    },
    confirmEmail:{
        type:Boolean,
        default:false,
    },
    role:{
        type:String,
        enum:Object.values(rolesTypes),    
        default:rolesTypes.User,
    },
    isDeleted:{
        type:Boolean,
        default:false,
    },
   
    DOB:String,
    adderess:String,
    phone:String,
    image:String,
    changedAt:Date,
    forgetPasswordOTP:String,
    code:String,
    otpExpireTime:Date,
},{timestamps:true})


const userModel=mongoose.model("User",userSchema);
export default userModel;