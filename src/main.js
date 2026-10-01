import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser' // ДОБАВИЛИ
import { sequelize } from './db.js'

import usersRouter from './controllers/usersController.js'
import productsRouter from './controllers/productsController.js'
import ordersRouter from './controllers/ordersController.js'
import { rateLimiter } from './middleware/rateLimiter.js'

const app = express()
const PORT = 3000

// Настройка CORS: разрешаем куки
app.use(cors({
  origin: true, // Разрешает любые домены, либо укажи конкретный адрес фронтенда (например 'http://localhost:5173')
  credentials: true // Важно для передачи Cookie
}))

app.use(express.json())
app.use(cookieParser()) // ДОБАВИЛИ (строго перед роутерами)

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

app.use(rateLimiter)

// Подключаем роутеры
app.use('/users', usersRouter)
app.use('/products', productsRouter)
app.use('/orders', ordersRouter)

async function startServer() {
  try {
    await sequelize.sync({ alter: true })
    console.log('База данных успешно синхронизирована.')
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Ошибка запуска сервера или подключения к БД:', error)
  }
}

startServer()
