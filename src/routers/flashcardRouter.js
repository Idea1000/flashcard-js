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

const router = Router()

router.post('/', createFlashcard);
router.get('/:id', getFlashcardById);
router.get('/collection/:collectionId', getFlashcardInCollecionById)
router.get('/collection/:collectionId/revisions/due', getDueFlashcards);
router.put('/:id', updateFlashcard);
router.delete('/:id', deleteFlashcard);
router.post('/:flashcardId/revise', reviseFlashcard);


export default router;