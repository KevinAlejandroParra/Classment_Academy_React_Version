const { Course, User, Enrollment, Payment } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { MercadoPagoConfig, Preference, Payment: MPPayment } = require('mercadopago');
const asyncHandler = require('../middleware/asyncHandler');

// Configuración de credenciales 
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

const preferenceClient = new Preference(client);
const paymentClient = new MPPayment(client);

class PaymentController {
    static createPayment = asyncHandler(async (req, res) => {
        try {
          const { courseId, amount, description } = req.body;
          const userId = req.user.user_id;
      
          // Validaciones básicas
          if (!courseId || !amount) {
            return res.status(400).json({
              success: false,
              message: 'Se requiere el ID del curso y el monto a pagar'
            });
          }
      
          const cleanFrontendUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
          const cleanApiUrl = process.env.API_URL.replace(/\/$/, '');
      
          if (!cleanFrontendUrl || !cleanApiUrl) {
            throw new Error('Configuración de URLs no definida');
          }
      
          const course = await Course.findByPk(courseId);
          const user = await User.findByPk(userId);
      
          const paymentId = uuidv4();
      
          const preference = {
            items: [
              {
                id: courseId,
                title: description || `Inscripción al curso ${course.course_name}`,
                quantity: 1,
                currency_id: 'COP',
                unit_price: parseFloat(amount)
              }
            ],
            payer: {
              email: user.user_email,
              name: user.user_name,
              surname: user.user_lastname
            },
            external_reference: paymentId,
            back_urls: {
              success: `${cleanFrontendUrl}/payment/success`,
              failure: `${cleanFrontendUrl}/payment/failure`,
              pending: `${cleanFrontendUrl}/payment/pending`
            },
            notification_url: `${cleanApiUrl}/api/payments/webhook`
          };
      
          console.log('Preferencia a enviar:', JSON.stringify(preference, null, 2));
      
          await Payment.create({
            payment_id: paymentId,
            user_id: userId,
            course_id: courseId,
            amount: parseFloat(amount),
            status: 'pending',
            payment_method: 'mercadopago',
            description: description || `Inscripción al curso ${course.course_name}`
          });
      
          const response = await preferenceClient.create({ body: preference });
      
          if (!response || !response.sandbox_init_point) {
            console.error('Respuesta inesperada:', response);
            throw new Error('No se recibió URL de pago de MercadoPago');
          }
      
          console.log('Respuesta de MercadoPago:', response);
      
          return res.status(200).json({
            success: true,
            paymentId: paymentId,
            paymentUrl: response.sandbox_init_point,
            message: 'URL de pago generada correctamente'
          });
      
        } catch (error) {
          console.error('Error completo:', {
            message: error.message,
            response: error.response?.data,
            stack: error.stack
          });
      
          return res.status(500).json({
            success: false,
            message: `Error al crear el pago: ${error.message}`,
            error: error.response?.data || error.message
          });
        }
      });
  static handleWebhook = asyncHandler(async (req, res) => {
    try {
      const { type, data } = req.body;

      if (type === 'payment') {
        const paymentId = data.id;
        
        const mpPayment = await paymentClient.get({ id: paymentId });
        
        if (!mpPayment) {
          return res.status(404).json({
            success: false,
            message: 'Pago no encontrado en Mercado Pago'
          });
        }

        const externalReference = mpPayment.external_reference;
        const payment = await Payment.findOne({
          where: { payment_id: externalReference }
        });

        let paymentStatus;
        switch (mpPayment.status) {
          case 'approved':
            paymentStatus = 'completed';
            break;
          case 'pending':
          case 'in_process':
            paymentStatus = 'pending';
            break;
          case 'rejected':
            paymentStatus = 'failed';
            break;
          default:
            paymentStatus = 'pending';
        }

        await payment.update({
          status: paymentStatus,
          payment_details: JSON.stringify(mpPayment)
        });

        if (paymentStatus === 'completed') {
          await Enrollment.create({
            enrollment_id: uuidv4(),
            user_id: payment.user_id,
            course_id: payment.course_id,
            course_price: payment.amount,
            status: 'active',
            progress: 0
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Notificación procesada correctamente'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Notificación recibida'
      });

    } catch (error) {
      console.error('Error al procesar webhook:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al procesar webhook',
        error: error.message
      });
    }
  });
 
  static checkPaymentStatus = asyncHandler(async (req, res) => {
    try {
      const { paymentId } = req.params;

      // Buscar el pago en nuestra base de datos
      const payment = await Payment.findOne({
        where: { payment_id: paymentId }
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Pago no encontrado'
        });
      }

      // Verificar si ya existe una inscripción activa
      let enrollment = null;
      if (payment.status === 'completed') {
        enrollment = await Enrollment.findOne({
          where: {
            user_id: payment.user_id,
            course_id: payment.course_id,
            status: 'active'
          },
          include: [{
            model: Course,
            as: 'course',
            attributes: ['course_id', 'course_name']
          }]
        });
      }

      // Responder con el estado del pago
      return res.status(200).json({
        success: true,
        data: {
          payment_id: payment.payment_id,
          status: payment.status,
          amount: payment.amount,
          description: payment.description,
          enrollment: enrollment ? {
            enrollment_id: enrollment.enrollment_id,
            course_name: enrollment.course.course_name
          } : null
        },
        message: 'Estado del pago obtenido correctamente'
      });

    } catch (error) {
      console.error('Error al verificar estado del pago:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al verificar estado del pago',
        error: error.message
      });
    }
  });
}

module.exports = PaymentController;