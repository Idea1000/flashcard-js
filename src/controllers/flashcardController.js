import { db } from "../db/database.js";
import { flashcardsTable, collectionsTable, revisionsTable, levelsTable } from "../db/schema.js";
import { eq } from "drizzle-orm";

/**
 * Route for create a new flashcard
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const createFlashcard = async (req, res) => {
    try {
        const { collection_id, frontText, backText, frontUrl, backUrl, userId } = req.body;

        if (!collection_id || !frontText || !backText || !userId) {
            return res.status(400).json({
                error: "Missing required fields: collection_id, frontText, backText, userId"
            });
        }

        const [collection] = await db
            .select()
            .from(collectionsTable)
            .where(eq(collectionsTable.id, collection_id))
            .limit(1);

        if (!collection) {
            return res.status(404).json({
                error: "Collection not found"
            });
        }

        if (collection.creatorId !== userId) {
            return res.status(403).json({
                error: "You can only create flashcards in your own collections"
            });
        }

        const [newFlashcard] = await db
            .insert(flashcardsTable)
            .values({
                collection_id,
                frontText,
                backText,
                frontUrl: frontUrl || null,
                backUrl: backUrl || null
            })
            .returning();

        res.status(201).json({
            message: "Flashcard created successfully!",
            flashcard: newFlashcard
        });

    } catch (error) {
        console.error('Create flashcard error:', error);
        res.status(500).json({
            error: 'Failed to create flashcard'
        });
    }
}

/**
 * Route to get a flashcard by this ID 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getFlashcardById = async (req, res) => {
    try{
        const { id } = req.params;
        const { userId } = req.body;
        if (!id){
            return res.status(400).json({
                error : "Flashcard ID is required"
            })
        }

        const [flashcard] = await db
            .select({
                id : flashcardsTable.id,
                collection_id: flashcardsTable.collection_id,
                frontText: flashcardsTable.frontText,
                backText: flashcardsTable.backText,
                frontUrl: flashcardsTable.frontUrl,
                backUrl: flashcardsTable.backUrl,
                collectionTitle: collectionsTable.title,
                collectionCreatorId: collectionsTable.creatorId,
                collectionVisibility: collectionsTable.visibility
            })
            .from(flashcardsTable)
            .innerJoin(collectionsTable, eq(flashcardsTable.collection_id, collectionsTable.id))
            .where(eq(flashcardsTable.id, id))
            .limit(1);
        
            if(!flashcard){
                return res.status(404).json({
                    error : "Flashcard not found"
                })
            }

            const isOwner = flashcard.collectionCreatorId == userId;
            const isPublic = flashcard.collectionVisibility == "PUBLIC";

            if (!isOwner && !isPublic){
                return res.status(403).json({
                    error : "You don't have permission to access this flashcard"
                })
            }

            res.status(200).json({
            message: "Flashcard retrieved successfully",
            flashcard: {
                id: flashcard.id,
                collection_id: flashcard.collection_id,
                collectionTitle: flashcard.collectionTitle,
                frontText: flashcard.frontText,
                backText: flashcard.backText,
                frontUrl: flashcard.frontUrl,
                backUrl: flashcard.backUrl
            }
        });

    }catch(error) {
        console.error('Get flashcard error:', error);
        res.status(500).json({
            error: 'Failed to retrieve flashcard'
        });
    }
} 

export const getFlashcardInCollecionById = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const { userId } = req.body;

        if (!collectionId) {
            return res.status(400).json({
                error: "Collection ID is required"
            });
        }

        const [collection] = await db
            .select()
            .from(collectionsTable)
            .where(eq(collectionsTable.id, collectionId))
            .limit(1);

        if (!collection) {
            return res.status(404).json({
                error: "Collection not found"
            });
        }

        const isOwner = collection.creatorId === userId;
        const isPublic = collection.visibility === "PUBLIC";
        
        if (!isOwner && !isPublic) {
            return res.status(403).json({
                error: "You don't have permission to access this collection"
            });
        }

        const flashcards = await db
            .select()
            .from(flashcardsTable)
            .where(eq(flashcardsTable.collection_id, collectionId));

        res.status(200).json({
            message: "Flashcards retrieved successfully in the collection",
            flashcards: flashcards,
            collection: {
                title: collection.title,
                description: collection.description,
                visibility: collection.visibility
            }
        });
    }catch(error) {
        console.error('Get flashcard error:', error);
        res.status(500).json({
            error: 'Failed to retrieve flashcard'
        });
    }
}

export const getDueFlashcards = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const { userId } = req.body;

        if (!collectionId) {
            return res.status(400).json({
                error: "Collection ID is required"
            });
        }

        const [collection] = await db
            .select()
            .from(collectionsTable)
            .where(eq(collectionsTable.id, collectionId))
            .limit(1);

        if (!collection) {
            return res.status(404).json({ error: "Collection not found" });
        }

        if (collection.creatorId !== userId) {
            return res.status(403).json({
                error: "You can only access revisions of your own collection"
            });
        }

        const now = Date.now();

        const dueFlashcards = await db
            .select({
                id: flashcardsTable.id,
                frontText: flashcardsTable.frontText,
                backText: flashcardsTable.backText,
                frontUrl: flashcardsTable.frontUrl,
                backUrl: flashcardsTable.backUrl,
                level: revisionsTable.level,
                lastRevision: revisionsTable.lastRevision,
                delay: levelsTable.delay
            })
            .from(flashcardsTable)
            .innerJoin(revisionsTable, eq(revisionsTable.flashcardId, flashcardsTable.id))
            .innerJoin(levelsTable, eq(levelsTable.level, revisionsTable.level))
            .where(eq(flashcardsTable.collection_id, collectionId))
            .where(eq(revisionsTable.userId, userId));

        const revisable = dueFlashcards.filter(f => {
            const nextRevision = new Date(f.lastRevision).getTime() + f.delay * 24
            return nextRevision <= now;
        });

        res.status(200).json({
            message: "Due flashcards retrieved successfully",
            flashcards: revisable
        });

    } catch (error) {
        console.error("Get due flashcards error:", error);
        res.status(500).json({ error: "Failed to retrieve due flashcards" });
    }
};

export const updateFlashcard = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, frontText, backText, frontUrl, backUrl } = req.body;

        if (!id || !userId) {
            return res.status(400).json({
                error: "Flashcard ID and userId are required"
            });
        }

        const [flashcard] = await db
            .select({
                id: flashcardsTable.id,
                collection_id: flashcardsTable.collection_id,
                creatorId: collectionsTable.creatorId
            })
            .from(flashcardsTable)
            .innerJoin(collectionsTable, eq(flashcardsTable.collection_id, collectionsTable.id))
            .where(eq(flashcardsTable.id, id))
            .limit(1);

        if (!flashcard) {
            return res.status(404).json({ error: "Flashcard not found" });
        }

        if (flashcard.creatorId !== userId) {
            return res.status(403).json({ error: "You can only update your own flashcards" });
        }

        const updated = await db
            .update(flashcardsTable)
            .set({
                frontText: frontText ?? undefined,
                backText: backText ?? undefined,
                frontUrl: frontUrl ?? undefined,
                backUrl: backUrl ?? undefined
            })
            .where(eq(flashcardsTable.id, id))
            .returning();

        res.status(200).json({
            message: "Flashcard updated successfully",
            flashcard: updated[0]
        });

    } catch (error) {
        console.error("Update flashcard error:", error);
        res.status(500).json({ error: "Failed to update flashcard" });
    }
};

export const deleteFlashcard = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (!id || !userId) {
            return res.status(400).json({
                error: "Flashcard ID and userId are required"
            });
        }

        const [flashcard] = await db
            .select({
                id: flashcardsTable.id,
                collection_id: flashcardsTable.collection_id,
                creatorId: collectionsTable.creatorId
            })
            .from(flashcardsTable)
            .innerJoin(collectionsTable, eq(flashcardsTable.collection_id, collectionsTable.id))
            .where(eq(flashcardsTable.id, id))
            .limit(1);

        if (!flashcard) {
            return res.status(404).json({ error: "Flashcard not found" });
        }

        if (flashcard.creatorId !== userId) {
            return res.status(403).json({
                error: "You can only delete your own flashcards"
            });
        }

        await db.delete(flashcardsTable).where(eq(flashcardsTable.id, id));

        res.status(200).json({ message: "Flashcard deleted successfully" });

    } catch (error) {
        console.error("Delete flashcard error:", error);
        res.status(500).json({ error: "Failed to delete flashcard" });
    }
};

export const reviseFlashcard = async (req, res) => {
    try {
        const { flashcardId } = req.params;
        const { userId, newLevel } = req.body;

        if (!flashcardId || !userId || newLevel === undefined) {
            return res.status(400).json({
                error: "flashcardId, userId and new level are required"
            });
        }

        const [flashcard] = await db
            .select({
                id: flashcardsTable.id,
                collection_id: flashcardsTable.collection_id,
                creatorId: collectionsTable.creatorId
            })
            .from(flashcardsTable)
            .innerJoin(collectionsTable, eq(flashcardsTable.collection_id, collectionsTable.id))
            .where(eq(flashcardsTable.id, flashcardId))
            .limit(1);

        if (!flashcard) {
            return res.status(404).json({ error: "Flashcard not found" });
        }

        if (flashcard.creatorId !== userId) {
            return res.status(403).json({
                error: "You can only revise flashcards from your own collections"
            });
        }

        const now = new Date();

        const [revision] = await db
            .select()
            .from(revisionsTable)
            .where(eq(revisionsTable.flashcardId, flashcardId))
            .where(eq(revisionsTable.userId, userId))
            .limit(1);

        if (!revision) {
            const [created] = await db
                .insert(revisionsTable)
                .values({
                    userId,
                    flashcardId,
                    level: newLevel,
                    lastRevision: now
                })
                .returning();

            return res.status(201).json({
                message: "Revision created",
                revision: created
            });
        }

        const [updated] = await db
            .update(revisionsTable)
            .set({
                level: newLevel,
                lastRevision: now
            })
            .where(eq(revisionsTable.id, revision.id))
            .returning();

        res.status(200).json({
            message: "Revision updated",
            revision: updated
        });

    } catch (error) {
        console.error("Revise flashcard error:", error);
        res.status(500).json({ error: "Failed to revise flashcard" });
    }
};
