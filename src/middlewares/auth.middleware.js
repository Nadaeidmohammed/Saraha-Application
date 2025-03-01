import userModel from "../DB/models/user.models.js";
import { verify } from "../utils/token/token.js";
export const rolesTypes={
    User:"User",
    Admin:"Admin"
}
export const authentication =async(req,res,next)=>{
   try {
    const{authorization}=req.headers;
    if(!authorization)
       {  
           return next(new Error("Authorization Header Is Required",{cause:401}))
       }   
       const[Bearer,token]=authorization.split(" ");
       let TOKEN_SIGNUTURE=undefined;
       switch(Bearer){
        case"User":
        TOKEN_SIGNUTURE=process.env.TOKEN_SECRET_USER;
        break;
        case"Admin":
        TOKEN_SIGNUTURE=process.env.TOKEN_SECRET_ADMIN;
        break;
        default:
            break;
       }

    const decoded=verify({token,signature:TOKEN_SIGNUTURE,options:{ expiresIn: "1h" }});
    if(!decoded ?.id)
        return res.status(404).json({message:"invalid payload"});

    const user=await userModel.findById(decoded.id);
      if(!user)
                return next(new Error("User Not Found Register First",{cause:404}))
    
    //   console.log({passwordTime:user.changedAt.getTime(),
    //     tokenTime:decoded.iat*1000
    // });
    if(user.changedAt?.getTime()>=decoded.iat*1000)
        return next(new Error("Please Log In Again"),{cause:401})

    if(user.isDeleted==true)
        return next(new Error("Please Log In Again Or Activate Your Account"),{cause:401})
   req.user=user;
   return next();

   } catch (error) {
    return next(error)
   }
}
export const allowTo=(roles=[])=>{
    return async(req,res,next)=>{
        try {
            if(!roles.includes(req.user.role))
                return next(new Error("Forbidden Account",{cause:403}))

            return next();
        } catch (error) {
              return next(error)  
        }
    }
}