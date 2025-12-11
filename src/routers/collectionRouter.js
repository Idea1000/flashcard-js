import { Router } from 'express'
import { getCollectionById, getPublicCollections } from '../controllers/collectionController.js'

const router = Router()

router.get('/public', getPublicCollections)
router.get('/:id', getCollectionById)

export default router