import { Sequelize, DataTypes } from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
})

// Модель Пользователя
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Хук или метод для скрытия пароля в ответах JSON
  instanceMethods: {
    toResponse() {
      const values = { ...this.get() }
      delete values.password
      return values
    }
  }
})

// Переопределяем метод токенизации JSON на уровне прототипа для удобства
User.prototype.toResponse = function() {
  const values = { ...this.get() }
  delete values.password
  return values
}

// Модель Товара
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
})

// Модель Заказа
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'created'
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  items: {
    type: DataTypes.JSON, // Храним состав заказа [{ productId, quantity }] в виде JSON-строки
    allowNull: false
  }
})

// Описываем связи (Заказ принадлежит Пользователю)
User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE' })
Order.belongsTo(User, { foreignKey: 'userId' })

export { sequelize, User, Product, Order }
