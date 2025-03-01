import { validation } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/error Handling/asyncHandler.js";
import * as authService from "./auth.service.js"
import * as authValidation from "./auth.validation.js"
import { Router } from "express"
const router=Router();

router.post("/register",
    validation(authValidation.registerSchema)
    ,asyncHandler(authService.register))

router.post("/login",
    validation(authValidation.loginSchema),
    asyncHandler(authService.logIn))

router.get("/acvtivate-account/:token",
    asyncHandler(authService.acctivateAccount))

router.patch("/forget_password",
    validation(authValidation.forgetPasswordSchema),
    asyncHandler(authService.forgetPassword));

router.patch("/verify-otp",
        validation(authValidation.verifyOTPschema),
         asyncHandler(authService.verifyOTP));

router.patch("/reset_password",
    validation(authValidation.resetPasswordSchema),
     asyncHandler(authService.resetPassword));
export default router;
