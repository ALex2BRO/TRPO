import express from 'express'
import { productsService } from '../services/productsService.js'
import { validateProductBody } from '../utils/validators.js'

const productsRouter = express.Router()

productsRouter.post('/', (req, res) => {
  const validationError = validateProductBody(req.body)
  if (validationError) return res.status(400).json({ error: validationError })

  const { data, status } = productsService.create(req.body)
  res.status(status).json(data)
})

productsRouter.get('/', (_req, res) => {
  res.json(productsService.getAll())
})

productsRouter.get('/:id', (req, res) => {
  const { error, data, status } = productsService.getById(req.params.id)
  if (error) return res.status(status).json({ error })
  res.json(data)
})

productsRouter.put('/:id', (req, res) => {
  const { error, data, status } = productsService.update(req.params.id, req.body)
  if (error) return res.status(status).json({ error })
  res.json(data)
})

productsRouter.delete('/:id', (req, res) => {
  const { error, data, status } = productsService.delete(req.params.id)
  if (error) return res.status(status).json({ error })
  res.json(data)
})

export default productsRouter
