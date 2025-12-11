import { db } from '../db/database.js'
import { usersTable } from '../db/schema.js'
import { request, response } from 'express'
import { desc, eq } from "drizzle-orm"

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const getUsers = async (req, res) => {
    try {
        const result = await db.select({
            id: usersTable.id,
            name: usersTable.name,
            firstname: usersTable.firstname,
            email: usersTable.email,
            role: usersTable.role,
            created_at: usersTable.createdAt
        })
            .from(usersTable)
            .orderBy(desc(usersTable.createdAt))

        res.status(200).json(result)
    } catch(error){
        console.log(error)
        return res.status(401).send({
            error: "You are a not allowed to see this information"
        })
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const getUsersById = async (req, res) => {
    const { id } = req.params

    try {
        const [result] = await db.select({
            id: usersTable.id,
            name: usersTable.name,
            firstname: usersTable.firstname,
            email: usersTable.email,
            role: usersTable.role
        })
            .from(usersTable)
            .where(eq(usersTable.id, id))

        if (!result) {
            res.status(404).send({
                error: "This user doesn't exist"
            })
        }
        res.status(200).json(result)
    } catch(error){
        console.log(error)
        return res.status(401).send({
            error: "You are a not allowed to see this information"
        })
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const deleteUsersById = async (req, res) => {
    const { id } = req.params

    try {
        const [result] = await db
            .delete(usersTable)
            .where(eq(usersTable.id, id))
            .returning()
        if(!result){
            return res.status(404).send({
                error: `User ${id} not found`
            })
        }
        res.status(200).send({
            message: `user ${id} deleted successfuly`
        })
    } catch(error){
        console.log(error)
        return res.status(401).send({
            error: "You are a not allowed to see this information"
        })
    }
}