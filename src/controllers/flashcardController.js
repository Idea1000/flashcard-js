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