import bcrypt from 'bcrypt'
import { User } from '../db.js'

export const usersService = {
  create: async ({ name, email, password }) => {
    const exists = await User.findOne({ where: { email } })
    if (exists) return { error: 'Email уже занят', status: 409 }

    // Хешируем пароль (10 раундов соли — оптимальный баланс безопасности и скорости)
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = await User.create({ name, email, password: hashedPassword })
    return { data: user.toResponse(), status: 201 }
  },

  getAll: async () => {
    const users = await User.findAll()
    return users.map(u => u.toResponse())
  },

  getById: async (id) => {
    const user = await User.findByPk(id)
    if (!user) return { error: 'Пользователь не найден', status: 404 }
    return { data: user.toResponse() }
  },

  update: async (id, updates) => {
    const user = await User.findByPk(id)
    if (!user) return { error: 'Пользователь не найден', status: 404 }

    const { name, email, password } = updates
    if (name !== undefined) user.name = name
    if (email !== undefined) {
      const exists = await User.findOne({ where: { email } })
      if (exists && exists.id !== user.id) return { error: 'Email уже занят', status: 409 }
      user.email = email
    }
    if (password !== undefined) {
      user.password = await bcrypt.hash(password, 10)
    }

    await user.save()
    return { data: user.toResponse() }
  },

  delete: async (id) => {
    const deletedCount = await User.destroy({ where: { id } })
    if (deletedCount === 0) return { error: 'Пользователь не найден', status: 404 }
    return { data: { message: 'Удалён', id } }
  }
}
