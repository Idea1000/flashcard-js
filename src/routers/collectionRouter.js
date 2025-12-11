import { Router } from 'express'
import { checkToken } from '../middleware/checkToken.js'
import { validateBody } from "../middleware/validation.js";
import { updateCollection, createCollection } from "../models/collection.js";
import { getCollectionById, getPublicCollections, getPersonalCollections, UpdateCollection, CreateCollection, DeleteCollection } from '../controllers/collectionController.js'

const router = Router()

router.use(checkToken)

router.get('/public/:name', getPublicCollections)
// Return all public collections if no name given
router.get('/public/', getPublicCollections)
router.get('/:id', getCollectionById)
router.get('/', getPersonalCollections)

router.post('/', validateBody(updateCollection), UpdateCollection)

router.put('/', validateBody(createCollection), CreateCollection)

router.delete('/:id', DeleteCollection)

export default router