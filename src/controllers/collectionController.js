import { db  } from "../db/database.js"
import { collectionsTable, flashcardsTable, usersTable } from "../db/schema.js"
import { request, response } from 'express'
import { eq, and, or, like } from "drizzle-orm"

/**
 * Get only public collection like name given
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const getPublicCollections = async (req, res) => {
    const { name } = req.params

    try {

        // Get public collections with a specified name
        let result = await db
            .select({
                id: collectionsTable.id,
                title: collectionsTable.title,
                description: collectionsTable.description,
                creatorName: usersTable.name
            })
            .from(collectionsTable)
            .fullJoin(usersTable, eq(usersTable.id, collectionsTable.creatorId))
            .where(
                and(
                    eq(collectionsTable.visibility, "PUBLIC"),
                    like(collectionsTable.title, `%${name}%`)
                )
            )
        
        if (!result || result.length === 0) {
            return res.status(404).send({
                error: `No collections has been found !`
            })
        }

        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).send({
            error: "Failed to fetch collections",
        })
    }
}

/**
 * Get only all public collection
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const getAllPublicCollections = async (req, res) => {
    try {

        // Get public collections
        let result = await db
            .select({
                id: collectionsTable.id,
                title: collectionsTable.title,
                description: collectionsTable.description,
                creatorName: usersTable.name
            })
            .from(collectionsTable)
            .fullJoin(usersTable, eq(usersTable.id, collectionsTable.creatorId))
            .where(
                eq(collectionsTable.visibility, "PUBLIC"),    
            )
        
        if (!result || result.length === 0) {
            return res.status(404).send({
                error: `No collections has been found !`
            })
        }

        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).send({
            error: "Failed to fetch collections !",
        })
    }
}

/**
 * Get collection with the id info
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const getCollectionById = async (req, res) => {
    const { id } = req.params

    try {

        // Get collection with id that is either public, owned by user or admin
        const [result] = await db
            .select({
                id: collectionsTable.id,
                title: collectionsTable.title,
                description: collectionsTable.description,
                visibility: collectionsTable.visibility,
                creatorName: usersTable.name
            })
            .from(collectionsTable)
            .fullJoin(usersTable, eq(usersTable.id, collectionsTable.creatorId))
            .where(
                and(
                    or(
                        // Is either public or {see below}
                        eq(collectionsTable.visibility, "PUBLIC"),
                        or(
                            // Is either the creator or an admin
                            eq(collectionsTable.creatorId, req.userId.userId),
                            eq(usersTable.role, "ADMIN"),
                        )
                        
                    ), 
                    eq(collectionsTable.id, id)
                )
            )
        
        if (!result) {
            return res.status(404).send({
                error: `This collection does not exist !`
            })
        }

        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).send({
            error: "Failed to fetch collections !",
        })
    }
}

/**
 * Get all personal collections
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const getPersonalCollections = async (req, res) => {
    try {

        // Get all personal collections (owned by user)
        const result = await db
            .select({
                id: collectionsTable.id,
                title: collectionsTable.title,
                description: collectionsTable.description,
                visibility: collectionsTable.visibility
            })
            .from(collectionsTable)
            .where(eq(collectionsTable.creatorId, req.userId.userId))
        
        if (!result || result.length === 0) {
            return res.status(404).send({
                error: `No collections has been found !`
            })
        }

        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).send({
            error: "Failed to fetch collections !",
        })
    }
}

/**
 * Create a collection
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const CreateCollection = async (req, res) => {
    try {
        const{title, description, visibility} = req.body

        // Create the collection
        const result = await db
            .insert(collectionsTable)
            .values({
                title: title.trim(),
                description: description.trim() ?? "",
                visibility,
                creatorId: req.userId.userId
            })

        return res.status(200).json({
            message: "Collection created successfuly",
            result
        })
    } catch (error) {
        return res.status(500).send({
            error: "Failed to create collection !",
        })
    }
}


/**
 * Update collection with specified id
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const UpdateCollection = async (req, res) => {
    try {
        const { id } = req.params
        const { title, description, visibility } = req.body

        // Check if collection exist and is owned by user
        const [result] = await db
            .select()
            .from(collectionsTable)
            .where(eq(collectionsTable.id, id))

        if (!result) {
            return res.status(404).send({
                error: `This collection does not exist !`
            })
        }
        
        if (result.creatorId !== req.userId.userId) {
            return res.status(403).send({
                error: `You can't update other people collection !`
            })
        }

        // Update collection
        await db
            .update(collectionsTable)
            .set({
                title: title ? title.trim() : undefined,
                description: description ? description.trim() : undefined,
                visibility: visibility ? visibility.trim() : undefined
            })
            .where(eq(collectionsTable.id, id))

        return res.status(200).send({
            message: `Collection ${id} updated successfuly`
        })
    } catch (error) {
        return res.status(500).send({
            error: "Failed to update collection !",
        })
    }
}

/**
 * Delete collection with specified id
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const DeleteCollection = async (req, res) => {
    const { id } = req.params
    
    try {

        // Check if collection exist and is owned by user
        const [result] = await db
            .select()
            .from(collectionsTable)
            .where(eq(collectionsTable.id, id))

        if (!result) {
            return res.status(404).send({
                error: `This collection does not exist !`
            })
        }
        
        if (result.creatorId !== req.userId.userId) {
            return res.status(403).send({
                error: `You can't delete other people question !`
            })
        }

        // Delete collection
        await db
            .delete(collectionsTable)
            .where(eq(collectionsTable.id, id))
            .returning()
        return res.status(200).send({
            message: `Collection ${id} deleted successfuly`
        })
    } catch (error) {
        return res.status(500).send({
            error: "Failed to delete collection !",
        })
    }
}

/**
 * Copy collection with specified id
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const CopyCollection = async (req, res) => {
    try{
        const originalCollectionId = req.params.id
        const { title, description } = req.body

        const [original] = await db
            .select()
            .from(collectionsTable)
            .where(eq(collectionsTable.id, originalCollectionId));
        
        if(!original){
            return res.status(404).json({
                message: "Collection not found"
            });
        }

        if (original.visibility !== "PUBLIC"){
            return res.status(403).json({
                message:"Only public collection can be copy"
            });
        }

        const newTitle = title?.trim()|| `${original.title} - Copy`;
        const newDescription = description?.trim() ?? original.description;

        const [newCollection] = await db
            .insert(collectionsTable)
            .values({
                title: newTitle,
                description: newDescription,
                visibility: "PUBLIC",
                creatorId: req.userId.userId,
            })
            .returning();
        
        const originalFlashcards = await db
            .select()
            .from(flashcardsTable)
            .where(eq(flashcardsTable.collection_id, originalCollectionId));

        if (originalFlashcards.length > 0) {
            const copiedFlashcards = originalFlashcards.map((card) => ({
                collection_id: newCollection.id,
                frontText: card.frontText,
                backText: card.backText,
                frontUrl: card.frontUrl,
                backUrl: card.backUrl,
            }));

            await db.insert(flashcardsTable).values(copiedFlashcards);
        }

        return res.status(201).json({
            message: "Collection copy",
            collection: newCollection,
        });
    }catch (error){
        return res.status(500).send({
            error: "Failed to copy collection ! : "+error.message,
        })
    }
}