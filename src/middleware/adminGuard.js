export const adminGuard = (req, res, next) => {
  const authHeader = req.headers['authorization']
  if (!authHeader) {
    return res.status(401).json({ error: 'Доступ запрещен. Отсутствует заголовок Authorization' })
  }
  next()
}
