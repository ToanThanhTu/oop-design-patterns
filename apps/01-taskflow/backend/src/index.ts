import { getBoard } from "#routes/boardRoutes.js"
import cors from "cors"
import "dotenv/config"
import express from "express"

const port = process.env.PORT ?? "3001"

const app = express()
app.use(cors())

app.get("/", getBoard)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
