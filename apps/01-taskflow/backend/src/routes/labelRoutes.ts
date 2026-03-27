import { labelService } from "#bootstrap.js"
import { CreateLabelSchema } from "#schemas/labelSchemas.js"
import { type Request, type Response } from "express"

export const createLabel = async (req: Request, res: Response) => {
  const newLabel = CreateLabelSchema.parse(req.body)
  
  const result = await labelService.create(newLabel)

  if (!result) {
    throw new Error(`Failed to create Label.`)
  }

  res.status(201).send(result)
}

export const getLabels = async (_req: Request, res: Response) => {
  const result = await labelService.getAll()

  res.send(result)
}