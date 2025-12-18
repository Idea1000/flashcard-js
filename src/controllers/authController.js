import { db } from "../db/database.js"
import { eq } from 'drizzle-orm'
import { request, response } from 'express'
import { usersTable } from "../db/schema.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import 'dotenv/config'

/**
 * Function to register as user or admin on the app.
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
 * Function to login as user or admin on the app.
 * 
 * @param {request} req 
 * @param {response} res
 * 
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

/**
 * Function to get authenticated user information.
 * 
 * @param {request} req 
 * @param {response} res
 */
export const getAuthInfo = async (req, res) => {
    try {
        const userId = req.userId.userId

        const [result] = await db
            .select({
                id: usersTable.id,
                email: usersTable.email,
                name: usersTable.name,
                firstname: usersTable.firstname,
                createdAt: usersTable.createdAt,
                role: usersTable.role
            })
            .from(usersTable)
            .where(eq(usersTable.id, userId))

        if (!result) {
            return res.status(404).send({
                error: "User not found"
            })
        }

        res.status(200).json({
            user: result
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({
            error: "Failed to retrieve user information",
        })
    }
}