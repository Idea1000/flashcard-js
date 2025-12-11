import { Router } from "express";
import { createFlashcard } from "../controllers/flashcardController.js";

const router = Router()

router.post('/', createFlashcard);

export default router;