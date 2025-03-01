import { Router } from "express";
const router=Router();
import * as messageService from "./message.service.js";
import * as messageValidation from "./message.validation.js"
import {asyncHandler} from "../../utils/error Handling/asyncHandler.js"
import { allowTo, authentication } from "../../middlewares/auth.middleware.js";
import {validation} from "../../middlewares/validation.middleware.js"
//create || send message
router.post("/",
    authentication,
    allowTo(["User"]),
    validation(messageValidation.sendMessageSchema),
    asyncHandler(messageService.sendMessage))
    
//get single message
router.get("/:messageId",
    authentication,
    allowTo(["User"]),
    validation(messageValidation.getSingleMessageSchema),
    asyncHandler(messageService.getSingleMessage))

//get all message
router.get("/",
    authentication,
    allowTo(["User"]),
    validation(messageValidation.getAllMessageSchema),
    asyncHandler(messageService.getAllMessage))

//update message
router.patch("/:messageId",
    authentication,
    allowTo(["User"]),
    validation(messageValidation.updateMessageSchema),
    asyncHandler(messageService.updateMessage))

//delete message
router.delete("/:messageId",
    authentication,
    allowTo(["User"]),
    validation(messageValidation.deleteMessageSchema),
    asyncHandler(messageService.deleteMessage))
export default router;