import { errorHandler } from "#middleware/errorHandler.js"
import { getBoards } from "#routes/boardRoutes.js"
import { clone } from "#routes/taskRoutes.js"
import cors from "cors"
import "dotenv/config"
import express from "express"

const port = process.env.PORT ?? "3001"

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", getBoards)
app.post("/tasks/:id/clone", clone)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
