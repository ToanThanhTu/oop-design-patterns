import cors from 'cors'
import "dotenv/config"
import { drizzle } from 'drizzle-orm/libsql'
import express from "express"

const port = process.env.PORT ?? "3001"

const db = drizzle(process.env.DB_FILE_NAME!)

const app = express()
app.use(cors())

app.get("/", (req, res) => {
  res.send("<p>Hello Worlds!</p>")
  console.log("Response sent")
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
