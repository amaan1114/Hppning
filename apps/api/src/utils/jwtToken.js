import jwt from "jsonwebtoken";
import { config } from "./config.js";
import HttpError from "./httpError.js";



export const generateAccessToken = (payload) => {
    const token = jwt.sign(payload, config.JWT_SECRET, {
        expiresIn:'15m'
    })
    return token
}

export const generateRefreshToken = (payload) => {
    const token = jwt.sign(payload, config.JWT_SECRET, {
        expiresIn:'7d'
    })
    return token
}   


export const verifyToken = (token)=>{
    try{
        const decoded = jwt.verify(token, config.JWT_SECRET)
        return decoded
    }
    catch(error){
        throw new HttpError(401, "Invalid token");
    }
}
