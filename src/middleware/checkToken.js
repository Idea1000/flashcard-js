import { request, response } from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {function} next 
 */
export const checkToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        return res.status(403).send({
            error: "Access token required"
        })
    }

    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decodedToken.userId
        req.userId = { userId }
        next()
    } catch(error){
        return res.status(401).send({
            error: "Invalid or expired access token"
        })
    }
}