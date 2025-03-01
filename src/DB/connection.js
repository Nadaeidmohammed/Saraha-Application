import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.DB_URI, {
            serverSelectionTimeoutMS:3000
        })
        console.log("connected to server successfully ");
    } catch (error) {
        console.log("fail to connect to server");
    }
}
export default connectDB;

// hkdSzatLJZ542m6J
// nadaeidmohammed
