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
            .select({
                id,
                title,
                description
            })
            .from(collectionsTable)
            .where(and(eq(collectionsTable.visibility, "PUBLIC"), eq(collectionsTable.id, id)))

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
export const getPersonalCollections = async (req, res) => {
    try {
        const result = await db
            .select()
            .from(collectionsTable)
            .where(eq(collectionsTable.creatorId, req.userId.userId))

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
export const CreateCollection = async (req, res) => {
    try {
        const{title, description, visibility} = req.body

        const result = await db
            .insert(collectionsTable)
            .values({
                title,
                description,
                visibility,
                creatorId: req.userId.userId
            })

        res.status(200).json({
            "message": "Collection created successfuly",
            result
        })
    } catch (error) {
        res.status(500).send({
            error: "Failed to create collection",
        })
    }
}


/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const UpdateCollection = async (req, res) => {
    try {
        const { id, title, description, visibility } = req.body

        const [result] = await db
            .select()
            .from(collectionsTable)
            .where(eq(collectionsTable.id, id))
        
        if (result.creatorId !== req.userId.userId) {
            res.status(403).send({
                error: `You can't update other people collection`
            })
        }

        let update = {}
        if (title) {
            update["title"] = title
        }
        if (description) {
            update["description"] = description
        }
        if (visibility) {
            update["visibility"] = visibility
        }

        const [resultUpdate] = await db
            .update(collectionsTable)
            .set(update)
            .where(eq(collectionsTable.id, id))
            .returning()
        if(!resultUpdate){
            res.status(404).send({
                error: `Collection ${id} not found`
            })
        }
        res.status(200).send({
            message: `Collection ${id} updated successfuly`
        })
    } catch (error) {
        res.status(500).send({
            error: "Failed to update collection",
        })
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const DeleteCollection = async (req, res) => {
    const { id } = req.params
    
    try {
        const [result] = await db
            .select()
            .from(collectionsTable)
            .where(eq(collectionsTable.id, id))
        
        
        if (result.creatorId !== req.userId.userId) {
            res.status(403).send({
                error: `You can't delete other people question`
            })
        }

        const [resultDelete] = await db
            .delete(collectionsTable)
            .where(eq(collectionsTable.id, id))
            .returning()
        if(!resultDelete){
            res.status(404).send({
                error: `Collection ${id} not found`
            })
        }
        res.status(200).send({
            message: `Collection ${id} deleted successfuly`
        })
    } catch (error) {
        res.status(500).send({
            error: "Failed to delete collection",
        })
    }
}