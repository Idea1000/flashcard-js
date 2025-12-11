import { Router } from 'express'
import { getCollectionById, getPublicCollections, UpdateCollection, CreateCollection, DeleteCollection } from '../controllers/collectionController.js'

const router = Router()

router.get('/public', getPublicCollections)
router.get('/:id', getCollectionById)
router.post('/', UpdateCollection)
router.put('/:id', CreateCollection)
router.delete('/:id', DeleteCollection)

export default router