import { Router } from 'express'
import { deleteUsersById, getUsers, getUsersById, promoteUserToAdmin } from '../controllers/userController.js'
import { checkToken } from '../middleware/checkToken.js'
import { checkAdmin } from '../middleware/checkAdmin.js'

const router = Router()

router.use(checkToken)
router.use(checkAdmin)

router.get('/', getUsers)
router.get('/:id', getUsersById)
router.delete('/:id', deleteUsersById)
router.put('/promote/:id', promoteUserToAdmin)
export default router