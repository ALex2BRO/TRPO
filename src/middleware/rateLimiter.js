const ipRequestHistory = new Map()

export const rateLimiter = (req, res, next) => {
  const clientIp = req.ip
  const now = Date.now()
  const WINDOW_MS = 10000 
  const MAX_REQUESTS = 5

  if (!ipRequestHistory.has(clientIp)) ipRequestHistory.set(clientIp, [])
  let timestamps = ipRequestHistory.get(clientIp).filter(t => now - t < WINDOW_MS)

  if (timestamps.length >= MAX_REQUESTS) {
    return res.status(429).json({ error: 'Слишком много запросов. Пожалуйста, подождите 10 секунд.' })
  }

  timestamps.push(now)
  ipRequestHistory.set(clientIp, timestamps)
  next()
}
