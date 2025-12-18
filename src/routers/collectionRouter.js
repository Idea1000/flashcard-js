import { Router } from 'express'
import { checkToken } from '../middleware/checkToken.js'
import { validateBody } from "../middleware/validation.js"
import { checkAdmin } from '../middleware/checkAdmin.js';
import { UpdateCollection, CreateCollection, CopyCollection } from "../models/collection.js"
import { 
    getCollectionById, 
    getPublicCollections, 
    getDrawCollections, 
    getDrawCollectionsById, 
    getAllPublicCollections, 
    getPersonalCollections, 
    updateCollection, 
    createCollection, 
    deleteCollection, 
    copyCollection,
    getAllCollections,
    deleteCollectionAdmin
} from '../controllers/collectionController.js'

const router = Router()

router.use(checkToken)

router.get('/admin/', checkAdmin, getAllCollections)
router.delete('/admin/:id', checkAdmin, deleteCollectionAdmin)

router.get('/public/:name', getPublicCollections)
// Return all public collections if no name given
router.get('/public/', getAllPublicCollections)
router.get('/draw/:id', getDrawCollectionsById)
router.get('/draw', getDrawCollections)
router.get('/:id', getCollectionById)
router.get('/', getPersonalCollections)

router.post('/', validateBody(CreateCollection), createCollection)
router.post('/:id/copy', validateBody(CopyCollection), copyCollection)

router.put('/:id', validateBody(UpdateCollection), updateCollection)

router.delete('/:id', deleteCollection)

export default router