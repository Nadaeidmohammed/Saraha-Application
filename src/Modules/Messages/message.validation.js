import joi from "joi";
import {isValidObjectId} from "../../middlewares/validation.middleware.js"

export const sendMessageSchema=joi.object({
    content:joi.string().required(),
    receiver:joi.custom(isValidObjectId).required(),

}).required();

export const getSingleMessageSchema=joi.object({
   messageId:joi.custom(isValidObjectId).required()
}).required();

export const flags = {
  inbox: "inbox",
  outbox: "outbox"
};

export const getAllMessageSchema=joi.object({
   flag:joi.string().valid(...Object.values(flags)).required()
 }).required();

 export const updateMessageSchema=joi.object({
  messageId:joi.custom(isValidObjectId).required(),
  content:joi.string().required()
}).required();
 export const deleteMessageSchema=joi.object({
    messageId:joi.custom(isValidObjectId).required()
  }).required();