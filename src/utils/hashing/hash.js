import bcrypt from "bcrypt";

export const hash=({plainText,saltRound=process.env.SALT})=>{
    return bcrypt.hashSync(plainText,Number(saltRound));//block code
}

export const compare=({plainText,hash})=>{
    return bcrypt.compareSync(plainText,hash);//block code
}