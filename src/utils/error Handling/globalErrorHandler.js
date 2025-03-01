const globalErrorHandler=(error,req,res,next)=>{
    const status=Number(error.cause)||500;
    res.status(status).json({success:false,message:error.message,stack:error.stack});
}
export default globalErrorHandler;