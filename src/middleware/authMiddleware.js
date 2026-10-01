import jwt from "jsonwebtoken";

const ACCESS_SECRET = "accesskey";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = req.cookies?.accessToken;
  
  if (!token && authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Доступ запрещен. Вы не авторизованы." });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Невалидный или истекший токен." });
  }
};
