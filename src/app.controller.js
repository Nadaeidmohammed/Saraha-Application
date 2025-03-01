import connectDB from "./DB/connection.js";
import authRouter from "./Modules/Auth/auth.controller.js"
import messageRourter from "./Modules/Messages/message.controller.js";
import userRouter from "./Modules/User/user.controller.js";
import globalErrorHandler from "./utils/error Handling/globalErrorHandler.js";
import notFoundHandler from "./utils/error Handling/notFoundHandler.js";
import cors from "cors"
const bootstrap=async(app,express)=>{
    //connect to DB
    await connectDB();
    app.use(cors())
    app.use(express.json());
    app.use("/auth",authRouter)
    app.use("/message",messageRourter)
    app.use("/user",userRouter)
    app.all("*",notFoundHandler)
    app.use(globalErrorHandler);
}
export default bootstrap;