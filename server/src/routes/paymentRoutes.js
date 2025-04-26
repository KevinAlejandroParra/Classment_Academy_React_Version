const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/auth');

// Ruta para crear un nuevo pago
router.post('/create-payment', verifyToken, PaymentController.createPayment);

// Ruta para recibir webhooks de Mercado Pago (sin autenticación)
router.post('/webhook', PaymentController.handleWebhook);

// Ruta para verificar el estado de un pago
router.get('/status/:paymentId', verifyToken, PaymentController.checkPaymentStatus);

module.exports = router;