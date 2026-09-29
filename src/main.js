import express from 'express'
import cors from 'cors'
import { sequelize } from './db.js' // Импортируем инстанс подключения

import usersRouter from './controllers/usersController.js'
import productsRouter from './controllers/productsController.js'
import ordersRouter from './controllers/ordersController.js'
import { rateLimiter } from './middleware/rateLimiter.js'
import { adminGuard } from './middleware/adminGuard.js'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})
app.use(rateLimiter)

app.use('/users', usersRouter)
app.use('/products', productsRouter)
app.use('/orders', ordersRouter)

// ... Эхо, Поиск и Админка остаются прежними ...

// Сначала синхронизируем базу данных, затем запускаем сервер
async function startServer() {
  try {
    // alter: true аккуратно обновит таблицы в sqlite, если вы измените схемы
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
