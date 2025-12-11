import { Router } from 'express'
import { checkToken } from '../middleware/checkToken.js'
import { getCollectionById, getPublicCollections, getPersonalCollections, UpdateCollection, CreateCollection, DeleteCollection } from '../controllers/collectionController.js'

const router = Router()

router.use(checkToken)

router.get('/public', getPublicCollections)
router.get('/:id', getCollectionById)
router.get('/', getPersonalCollections)

router.post('/', UpdateCollection)

router.put('/', CreateCollection)

router.delete('/:id', DeleteCollection)

export default router