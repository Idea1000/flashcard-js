import { Router } from "express";
import { createFlashcard, getFlashcardById } from "../controllers/flashcardController.js";

const router = Router()

router.post('/', createFlashcard);
router.get('/:id', getFlashcardById);

export default router;