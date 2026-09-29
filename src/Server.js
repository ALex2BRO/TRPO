import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { sequelize, User, Product, Order } from './db.js' 

const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.findAll()
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const newUser = await User.create({ name, email, password })
    
    res.status(201).json(newUser.toResponse()) 
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

async function start() {
  try {
    await sequelize.sync({ force: false }) 

    const count = await Product.count()
    if (count === 0) {
      await Product.create({ name: 'Ноутбук', description: 'Мощный игровой ноутбук', price: 75000, stock: 10 })
    }

    app.listen(PORT, () => console.log(`Сервер запущен на http://localhost:${PORT}`))
  } catch (e) {
    console.error('Ошибка подключения к БД:', e)
  }
}

start()
