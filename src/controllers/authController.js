import { db } from "../db/database.js"
import { eq } from 'drizzle-orm'
import { request, response } from 'express'
import { usersTable } from "../db/schema.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import 'dotenv/config'

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const register = async (req, res) => {
    try {
        const{email, name, firstname, password} = req.body

        const hashedPassword = await bcrypt.hash(password, 12)

        const [result] = await db
            .insert(usersTable)
            .values({
                email,
                name,
                firstname,
                password: hashedPassword
            })
            .returning({
                id: usersTable.id,
                email: usersTable.email,
                name: usersTable.name,
                firstname: usersTable.firstname
            })
        
        const token = jwt
            .sign({
                userId: result.id
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: "24h" }
        )

        res.status(201).json({
            message: "User created",
            user: result,
            token
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({
            error: "Failed to register",
        })
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
export const login = async(req, res) => {
    try{
        const{email, password} = req.body

        const [result] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email))

            if(!result){
                return res.status(401).send({
                    error: "email or password is invalid"
                })
            }

        if ( await bcrypt.compare(password, result.password) ){
            
            const token = jwt
            .sign({
                userId: result.id
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: "24h" }
            )

            res.status(200).send({
                message: "you are logged in as " + result.name + " " + result.firstname,
                token
            })
            return;
        } 
        res.status(401).send({
            error: "email or password is invalid"
        })
    }catch (error) {
        console.error(error)
        res.status(500).send({
            error: "Failed to login",
        })
    }
}