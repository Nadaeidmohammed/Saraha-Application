import joi from "joi";
//data
const user={
    userName:"nada",
    email:"nadaeid@gmail.com",
    password:"123456",
    confirmPassword:"123456",
    gender:"female",
    role:"user",
    phone:"01145306296",
}
//shema
const shema=joi.object({
    userName:joi.string().min(3).max(20).required(),
    email:joi.string().email().required(),
    password:joi.string().required(),
    confirmPassword:joi.string().valid(joi.ref(password)).required(),
    gender:joi.boolean().required(),
    phone:joi.string().required(),
}).required();
//validate
const res =shema.validate(user)
console.log(res);
