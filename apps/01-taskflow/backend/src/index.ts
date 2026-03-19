import { getBoard } from "#routes/boardRoutes.js"
import { clone } from "#routes/taskRoutes.js"
import cors from "cors"
import "dotenv/config"
import express from "express"

const port = process.env.PORT ?? "3001"

const app = express()
app.use(cors())

app.get("/", getBoard)
app.post("/tasks/:id/clone", clone)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
