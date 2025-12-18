import { Router } from "express";
import { register, login, getAuthInfo } from "../controllers/authController.js";
import { validateBody } from "../middleware/validation.js";
import { checkToken } from "../middleware/checkToken.js";
import { registerSchema, loginSchema } from "../models/auth.js";

const router = Router()

router.post('/register', validateBody(registerSchema), register)
router.post('/login', validateBody(loginSchema), login)
router.get('/info', checkToken,  getAuthInfo)

export default router;