import { db  } from "../db/database.js"
import { collectionsTable } from "../db/schema.js"
import { request, response } from 'express'
import { eq, and } from "drizzle-orm"

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const getPublicCollections = async (req, res) => {
    try {
        const result = await db
            .select()
            .from(collectionsTable)
            .where(eq(collectionsTable.visibility, "PUBLIC"))

        res.status(200).json(result)
    } catch (error) {
        res.status(500).send({
            error: "Failed to fetch collections",
        })
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const getCollectionById = async (req, res) => {
    const { id } = req.params

    try {
        const [result] = await db
            .select()
            .from(collectionsTable)
            .where(and(eq(collectionsTable.visibility, "PUBLIC"), eq(collectionsTable.id, id)))

        res.status(200).json(result)
    } catch (error) {
        res.status(500).send({
            error: "Failed to fetch collections",
        })
    }
}