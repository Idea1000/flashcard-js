import express from "express"
import authRoutes from './routers/authRouter.js'
import userRoutes from './routers/userRouter.js'
import flashcardRoutes from './routers/flashcardRouter.js'
import collectionRoutes from './routers/collectionRouter.js'
import levelRoutes from './routers/levelRouter.js'
import revisionRoutes from './routers/revisionRouter.js'

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/flashcard', flashcardRoutes)
app.use('/collection', collectionRoutes)
app.use('/level', levelRoutes)
app.use('/revision', revisionRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}...`)
})