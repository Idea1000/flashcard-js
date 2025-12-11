import express from "express"
import collectionRoutes from "./routers/collectionRouter.js"

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

// Request -> express.json() -> Logger -> Controller -> Response
// app.use('{route}', {router})
app.use('/collection', collectionRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}...`)
})