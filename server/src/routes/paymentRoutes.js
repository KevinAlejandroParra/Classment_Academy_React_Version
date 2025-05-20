const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/auth');
const cors = require('cors');

// Ruta para crear un nuevo pago
router.post('/create', verifyToken, PaymentController.createPayment);

// Ruta para manejar el éxito del pago
router.get('/success', PaymentController.handleSuccess);

// Ruta para manejar el fallo del pago
router.get('/failure', PaymentController.handleFailure);

// Ruta para recibir webhooks de Mercado Pago (sin autenticación)
router.post('/webhook', PaymentController.handleWebhook);

// Ruta para verificar el estado de un pago
router.get('/status/:paymentId', verifyToken, PaymentController.checkPaymentStatus);

module.exports = router;