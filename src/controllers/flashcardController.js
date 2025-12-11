import { db } from "../db/database.js";
import { flashcardsTable, collectionsTable } from "../db/schema.js";
import { eq } from "drizzle-orm";

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