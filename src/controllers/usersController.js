import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../db.js'; // Проверь путь до файла db.js

const router = express.Router();
const ACCESS_SECRET = process.env.ACCESS_SECRET || "accesskey";
const SALT_ROUNDS = 10;

const generateToken = (userId, email) => {
  return jwt.sign({ id: userId, email }, ACCESS_SECRET, { expiresIn: "15m" });
};

// РЕГИСТРАЦИЯ
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return res.status(400).json({ message: "Пользователь с таким email уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ 
      success: true, 
      user: newUser.toResponse() 
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при регистрации", error: error.message });
  }
});

// ЛОГИН
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    const token = generateToken(user.id, user.email);

    // Задаем токен в куки
    res.cookie("accessToken", token, {
      httpOnly: true, // Защита от кражи через JS (XSS)
      secure: process.env.NODE_ENV === "production", // true только на HTTPS
      sameSite: "strict", // Защита от CSRF
      maxAge: 15 * 60 * 1000, // 15 минут
    });

    res.status(200).json({
      success: true,
      user: user.toResponse(),
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера при входе", error: error.message });
  }
});

// ВЫХОД
router.post('/logout', (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ success: true, message: "Вы успешно вышли из системы" });
});

export default router;
