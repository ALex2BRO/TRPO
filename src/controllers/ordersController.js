import express from 'express';
import { Order } from '../db.js';
import { authMiddleware } from '../middleware/authMiddleware.js'; // ИМПОРТИРУЕМ

const router = express.Router();

// Роут создания заказа теперь защищен!
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;
    
    // Сюда попадут только авторизованные. ID пользователя берем из токена:
    const userId = req.user.id; 

    const newOrder = await Order.create({
      items,
      userId,
      status: 'created'
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Ошибка создания заказа" });
  }
});

export default router;
