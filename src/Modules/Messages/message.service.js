import userModel from "../../DB/models/user.models.js"
import MessageModel from "../../DB/models/message.model.js"
import { flags } from "./message.validation.js";
export const sendMessage=async(req,res,next)=>{
    const{content,receiver}=req.body;
    const user =await userModel.findById(receiver);
    if(!user)
        return next(new Error("User Not Found"),{cause:404});
    //send message
    const message=await MessageModel.create({content,receiver,sender:req.user._id})
    return res.status(200).json({
        success:true,
        message:"Message Sent Successfully"
    });
}
export const getSingleMessage=async(req,res,next)=>{
    const {messageId}=req.params;
    const message=await MessageModel.findById(messageId).populate([
        {path:"sender",select:"userName email -_id"},
        {path:"receiver",select:"userName email -_id"}
    ]);
    if(!message)
        return next(new Error("Message not found",{cause:404}));
    if(message.receiver?.email==req.user.email||
       message.sender?.email==req.user.email
    )
    return res.status(200).json({
        success:true,
        results:message
    })
  return next(new Error("Unauthorized",{cause:403}))
}
export const getAllMessage=async(req,res,next)=>{
    const {flag }=req.query;
    return res.status(200).json({
        success:true,
        results: flag ==flags.inbox?await MessageModel.find({receiver:req.user._id}):
        await MessageModel.find({sender:req.user._id})
    })
}
export const updateMessage=async(req,res,next)=>{
    const { messageId } = req.params;
    const { content } = req.body;
    const message=await MessageModel.findById(messageId);
    if(!message)
        return next(new Error("Message not found",{cause:404}));
    if (message.sender.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized: You can only update your own messages", { cause: 403 }));
    }
    message.content = content;
    await message.save();
    return res.status(200).json({
        success: true,
        message: "Message updated successfully",
        updatedMessage: message
    });
}
export const deleteMessage=async(req,res,next)=>{
    const{messageId}=req.params;
    const message=await MessageModel.findById(messageId)
    if(!message)
        return next(new Error("Message not found",{cause:404}));
    if(message.receiver.toString()==req.user._id.toString()||
       message.sender.toString()==req.user._id.toString()
    )
   { await message.deleteOne({_id:messageId})
    return res.status(200).json({
        success:true,
        message:"deleted successfully"
    })}
    return next(new Error("Unauthorized",{cause:403}))
}
// export const getSingleMessage=async(req,res,next)=>{
//     const {messageId}=req.params;
//     const message=await MessageModel.findById(messageId)populate([
    //     {path:"sender",select:"userName email "},
    //     {path:"receiver",select:"userName email "}
    // ]);;
//     if(!message)
//         return next(new Error("Message not found",{cause:404}));
//     if(message.receiver._id.toString()==req.user._id.toString()||
//        message.sender._id.toString()==req.user._id.toString()
//     )
//     return res.status(200).json({
//         success:true,
//         results:message
//     })
//   return next(new Error("Unauthorized",{cause:403}))
// }


