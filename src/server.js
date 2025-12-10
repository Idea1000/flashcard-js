import express from "express"
import authRoutes from './router/authRouter.js'

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

app.use('/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}...`)
})