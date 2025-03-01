import  mongoose ,{model, Schema, Types} from "mongoose"
const messageSchema=new Schema(
    {
        //body
        content:{
            type:String,
            required:true,
        },
        //sender
        sender:{
            type:Types.ObjectId,
            ref:"User",
        },
        receiver:{
            type:Types.ObjectId,
            ref:"User",
        },
    },
    {
        timestamps:true,
    }
)

const MessageModel=mongoose.models.Message || model("Message",messageSchema)
export default MessageModel;