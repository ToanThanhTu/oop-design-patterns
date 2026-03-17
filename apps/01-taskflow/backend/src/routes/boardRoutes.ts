import { type Request, type Response } from "express"

export const getBoard = (_req: Request, res: Response) => {
  res.send("<p>Hello Worlds!</p>")
  console.log("Response sent")
}
