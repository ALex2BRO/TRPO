import { Product } from '../db.js'

export const productsService = {
  create: async (data) => {
    const product = await Product.create(data)
    return { data: product, status: 201 }
  },

  getAll: async () => await Product.findAll(),

  getById: async (id) => {
    const product = await Product.findByPk(id)
    if (!product) return { error: 'Товар не найден', status: 404 }
    return { data: product }
  },

  update: async (id, updates) => {
    const product = await Product.findByPk(id)
    if (!product) return { error: 'Товар не найден', status: 404 }

    const { name, description, price, stock } = updates
    if (name !== undefined) product.name = name
    if (description !== undefined) product.description = description
    if (price !== undefined) product.price = price
    if (stock !== undefined) product.stock = stock

    await product.save()
    return { data: product }
  },

  delete: async (id) => {
    const deletedCount = await Product.destroy({ where: { id } })
    if (deletedCount === 0) return { error: 'Товар не найден', status: 404 }
    return { data: { message: 'Удалён', id } }
  }
}
