import type { Task } from "#models/task/task.js"

import { type Request, type Response } from "express"

export const clone = (req: Request<Task>, res: Response<Task>) => {
  const data: Task = req.body
  return res.send(data.clone())
}
