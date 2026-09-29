import { sequelize, User, Product, Order } from '../db.js'

export const ordersService = {
  create: async ({ userId, items }) => {
    const user = await User.findByPk(userId)
    if (!user) return { error: 'Пользователь не найден', status: 404 }

    // Используем транзакцию Sequelize, чтобы списание со склада и создание заказа происходили атомарно
    const transaction = await sequelize.transaction()

    try {
      let totalPrice = 0

      // Проверяем остатки на складе и считаем общую сумму
      for (const item of items) {
        const product = await Product.findByPk(item.productId, { transaction })
        if (!product) {
          await transaction.rollback()
          return { error: `Товар с ID ${item.productId} не найден`, status: 404 }
        }
        if (product.stock < item.quantity) {
          await transaction.rollback()
          return { error: `Недостаточно товара "${product.name}" на складе`, status: 400 }
        }

        totalPrice += product.price * item.quantity
        // Списание
        product.stock -= item.quantity
        await product.save({ transaction })
      }

      const order = await Order.create({ userId, items, totalPrice }, { transaction })
      
      await transaction.commit()
      return { data: order, status: 201 }

    } catch (err) {
      await transaction.rollback()
      return { error: 'Внутренняя ошибка транзакции заказа', status: 500 }
    }
  },

  getAll: async (userId) => {
    return userId ? await Order.findAll({ where: { userId } }) : await Order.findAll()
  },

  getById: async (id) => {
    const order = await Order.findByPk(id)
    if (!order) return { error: 'Заказ не найден', status: 404 }
    return { data: order }
  },

  update: async (id, { status, items }) => {
    const order = await Order.findByPk(id)
    if (!order) return { error: 'Заказ не найден', status: 404 }

    if (status !== undefined) order.status = status
    if (items !== undefined) {
      order.items = items
      // Перерасчет стоимости
      let totalPrice = 0
      for (const item of items) {
        const product = await Product.findByPk(item.productId)
        if (product) totalPrice += product.price * item.quantity
      }
      order.totalPrice = totalPrice
    }

    await order.save()
    return { data: order }
  },

  delete: async (id) => {
    const deletedCount = await Order.destroy({ where: { id } })
    if (deletedCount === 0) return { error: 'Заказ не найден', status: 404 }
    return { data: { message: 'Удалён', id } }
  }
}
