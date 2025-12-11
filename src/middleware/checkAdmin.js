import { request, response } from 'express'
import 'dotenv/config'
import { usersTable } from "../db/schema.js"
import { db } from "../db/database.js"
import { eq } from "drizzle-orm"

/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {function} next 
 */
export const checkAdmin = async (req, res, next) => {
    try{
        const [result] = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.id, req.userId.userId))
        if (result.role !== "ADMIN")    {
            return res.status(401).send({
                error: "You are not an admin"
            })
        }
        next()
    } catch(error){
        console.log(error)
        return res.status(401).send({
            error: "You are a "
        })
    }
}