// Валидация Email (базовое регулярное выражение)
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Валидация пароля (минимум 6 символов)
export const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false
  return password.length >= 6
}

// Валидатор данных пользователя
export const validateUserBody = (body) => {
  const { name, email, password } = body
  if (!name || typeof name !== 'string' || name.trim() === '') return 'Имя обязательно и должно быть строкой'
  if (!isValidEmail(email)) return 'Некорректный формат Email'
  if (!isValidPassword(password)) return 'Пароль должен быть не менее 6 символов'
  return null
}

// Валидатор данных товара
export const validateProductBody = (body) => {
  const { name, price } = body
  if (!name || typeof name !== 'string' || name.trim() === '') return 'Название товара обязательно'
  if (price === undefined || typeof price !== 'number' || price < 0) return 'Цена должна быть положительным числом'
  return null
}

// Валидатор данных заказа
export const validateOrderBody = (body) => {
  const { userId, items } = body
  if (!userId || typeof userId !== 'string') return 'Идентификатор пользователя (userId) обязателен'
  if (!Array.isArray(items) || items.length === 0) return 'Список товаров (items) должен быть непустым массивом'
  
  for (const item of items) {
    if (!item.productId || typeof item.productId !== 'string') return 'Каждый товар должен содержать productId'
    if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) return 'Количество товара (quantity) должно быть больше 0'
  }
  return null
}
