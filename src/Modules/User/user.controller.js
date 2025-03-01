import { Router } from "express";
import * as userService from "./user.service.js";
import * as userValidation from "./user.validation.js"
import {asyncHandler} from "../../utils/error Handling/asyncHandler.js"
import { allowTo, authentication } from "../../middlewares/auth.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
const router =Router();

router.get("/profile",
    authentication,
    allowTo(["User"]),
    asyncHandler(userService.getUser))
//update user
router.patch("/",
    authentication,
    allowTo(["User","Admin"]),
    validation(userValidation.updateProfileSchema),
    asyncHandler(userService.updateProfile));

//change pass
router.patch("/change-password",
    authentication,
    allowTo(["User","Admin"]),
    validation(userValidation.changePasswordSchema),
    asyncHandler(userService.changePassword));

router.delete("/",
        authentication,
        allowTo(["User","Admin"]),
        asyncHandler(userService.deactivateAccount));

router.patch("/",
    authentication,
    allowTo(["User","Admin"]),
    asyncHandler(userService.activateAccount));
export default router;