import { Router } from "express";
import { 
    createFlashcard, 
    getFlashcardById, 
    getFlashcardInCollecionById, 
    getDueFlashcards, 
    updateFlashcard, 
    deleteFlashcard, 
    reviseFlashcard 
} from "../controllers/flashcardController.js";
import { checkToken } from "../middleware/checkToken.js";
import { validateBody, validateParams } from "../middleware/validation.js";
import { 
    createFlashcardSchema, 
    updateFlashcardSchema, 
    flashcardIdSchema, 
    collectionIdSchema 
} from "../models/flashcard.js";

const router = Router()

router.use(checkToken)

router.post('/', validateBody(createFlashcardSchema), createFlashcard);
router.get('/:id', validateParams(flashcardIdSchema), getFlashcardById);
router.get('/collection/:collectionId', validateParams(collectionIdSchema), getFlashcardInCollecionById)
router.get('/collection/:collectionId/revisions/due', validateParams(collectionIdSchema), getDueFlashcards);
router.put('/:id', validateParams(flashcardIdSchema), validateBody(updateFlashcardSchema), updateFlashcard);
router.delete('/:id', validateParams(flashcardIdSchema), deleteFlashcard);
router.post('/:id/revise', validateParams(flashcardIdSchema), reviseFlashcard);

export default router;