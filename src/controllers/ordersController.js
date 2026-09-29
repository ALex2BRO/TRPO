import express from 'express'
import { ordersService } from '../services/ordersService.js'
import { validateOrderBody } from '../utils/validators.js'

const ordersRouter = express.Router()

ordersRouter.post('/', (req, res) => {
  const validationError = validateOrderBody(req.body)
  if (validationError) return res.status(400).json({ error: validationError })

  const { error, data, status } = ordersService.create(req.body)
  if (error) return res.status(status).json({ error })
  res.status(status).json(data)
})

ordersRouter.get('/', (req, res) => {
  res.json(ordersService.getAll(req.query.userId))
})

ordersRouter.get('/:id', (req, res) => {
  const { error, data, status } = ordersService.getById(req.params.id)
  if (error) return res.status(status).json({ error })
  res.json(data)
})

ordersRouter.put('/:id', (req, res) => {
  const { error, data, status } = ordersService.update(req.params.id, req.body)
  if (error) return res.status(status).json({ error })
  res.json(data)
})

ordersRouter.delete('/:id', (req, res) => {
  const { error, data, status } = ordersService.delete(req.params.id)
  if (error) return res.status(status).json({ error })
  res.json(data)
})

export default ordersRouter
