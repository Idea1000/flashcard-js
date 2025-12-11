import { Router } from 'express'
import { deleteUsersById, getUsers, getUsersById } from '../controllers/userController.js'
import { checkToken } from '../middleware/checkToken.js'
import { checkAdmin } from '../middleware/checkAdmin.js'

const router = Router()

router.use(checkToken)
router.use(checkAdmin)

router.get('/', getUsers)
router.get('/:id', getUsersById)
router.delete('/:id', deleteUsersById)
export default router