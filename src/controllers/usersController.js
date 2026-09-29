import express from 'express'
import { usersService } from '../services/usersService.js'
import { validateUserBody } from '../utils/validators.js'

const usersRouter = express.Router()

usersRouter.post('/', async (req, res) => {
  const validationError = validateUserBody(req.body)
  if (validationError) return res.status(400).json({ error: validationError })

  const { error, data, status } = await usersService.create(req.body)
  if (error) return res.status(status).json({ error })
  res.status(status).json(data)
})

usersRouter.get('/', async (_req, res) => {
  res.json(await usersService.getAll())
})

usersRouter.get('/:id', async (req, res) => {
  const { error, data, status } = await usersService.getById(req.params.id)
  if (error) return res.status(status).json({ error })
  res.json(data)
})

usersRouter.put('/:id', async (req, res) => {
  const { error, data, status } = await usersService.update(req.params.id, req.body)
  if (error) return res.status(status).json({ error })
  res.json(data)
})

usersRouter.delete('/:id', async (req, res) => {
  const { error, data, status } = await usersService.delete(req.params.id)
  if (error) return res.status(status).json({ error })
  res.json(data)
})

export default usersRouter
