const express = require('express');
const router = express.Router();
const {
  searchProducts,
  getPopularProducts,
} = require('../controllers/chatbotController');

/**
 * @swagger
 * tags:
 *   name: Chatbot
 *   description: AI Chatbot for product search
 */

/**
 * @swagger
 * /chatbot/search:
 *   post:
 *     summary: Search products using natural language
 *     tags: [Chatbot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: User's natural language query
 *                 example: "Tôi muốn tìm thức ăn cho chó giống Alaska"
 *     responses:
 *       200:
 *         description: Products found successfully
 *       400:
 *         description: Invalid request
 */
router.post('/search', searchProducts);

/**
 * @swagger
 * /chatbot/popular:
 *   get:
 *     summary: Get popular products for chatbot suggestions
 *     tags: [Chatbot]
 *     responses:
 *       200:
 *         description: Popular products retrieved successfully
 */
router.get('/popular', getPopularProducts);

module.exports = router;
