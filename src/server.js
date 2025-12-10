import express from "express"

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

// Request -> express.json() -> Logger -> Controller -> Response
// app.use('{route}', {router})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}...`)
})