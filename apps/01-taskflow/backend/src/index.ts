import express from "express"
import "dotenv/config"

const app = express()
const port = process.env.PORT ?? "3001"

app.get("/", (res, req) => {
  console.log("Response sent")
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
