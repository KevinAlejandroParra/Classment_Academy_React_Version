const { Course, User, Enrollment, Payment } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { MercadoPagoConfig, Preference, Payment: MPPayment } = require("mercadopago");
const asyncHandler = require("../middleware/asyncHandler");
const crypto = require("crypto");
const mercadopago = require("mercadopago");

// Configuración de credenciales
const client = new MercadoPagoConfig({
    accessToken: "APP_USR-2745143215161147-042900-26e96cb52a1945424150974e22420851-2410996615",
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
                    message: "Se requiere el ID del curso y el monto a pagar",
                });
            }

            const cleanFrontendUrl = process.env.FRONTEND_URL.replace(/\/$/, "");
            const cleanApiUrl = process.env.API_URL.replace(/\/$/, "");

            if (!cleanFrontendUrl || !cleanApiUrl) {
                throw new Error("Configuración de URLs no definida");
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
                        currency_id: "COP",
                        unit_price: parseFloat(amount),
                    },
                ],
                back_urls: {
                    success: `${cleanFrontendUrl}/payment/success`,
                    failure: `${cleanFrontendUrl}/payment/failure`,
                    pending: `${cleanFrontendUrl}/payment/success`,
                },
                external_reference: paymentId,
                auto_return: "approved",
            };

            await Payment.create({
                payment_id: paymentId,
                user_id: userId,
                course_id: courseId,
                amount: parseFloat(amount),
                status: "pending",
                payment_method: "mercadopago",
                description: description || `Inscripción al curso ${course.course_name}`,
            });

            const response = await preferenceClient.create({ body: preference });

            if (!response || !response.sandbox_init_point) {
                console.error("Respuesta inesperada:", response);
                throw new Error("No se recibió URL de pago de MercadoPago");
            }

            return res.status(200).json({
                success: true,
                paymentId: paymentId,
                paymentUrl: response.sandbox_init_point,
                message: "URL de pago generada correctamente",
            });
        } catch (error) {
            console.error("Error completo:", {
                message: error.message,
                response: error.response?.data,
                stack: error.stack,
            });

            return res.status(500).json({
                success: false,
                message: `Error al crear el pago: ${error.message}`,
                error: error.response?.data || error.message,
            });
        }
    });

    static handleWebhook = asyncHandler(async (req, res) => {
        try {
            // Recibir la informacion del webhook y validarlo
            const { body } = req;

            if (
                (body.action !== "payment.updated" && body.action !== "payment.created") ||
                body.type !== "payment"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Acción no reconocida",
                });
            }

            const paymentId = body.data.id;
            const payment = await fetch("https://api.mercadopago.com/v1/payments/" + paymentId, {
                headers: {
                    Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }).then((response) => response.json());

            // verifcar que el pago exista y que ya se haya recibido
            // if (!isValidPayment) return error

            // actualizar el estado del pedido

            // create a enrollment user_id, course_id, payment_id

            // enviar email notificando que la inscripcion fue exitosa

            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: "Pago no encontrado",
                });
            }

            console.log(payment);

            // Si el pago es exitoso actualizar el apgo como pagado
            // añadir el enrollment y notificar via correo al usuario de su inscripcion
            return res.json({ success: true, message: "Usuario inscrito correctamente" });
        } catch (error) {
            console.error("Error en webhook:", error);
            return res.status(500).json({
                success: false,
                message: "Error procesando webhook",
            });
        }
    });

    static verifyMercadoPagoSignature(req, body) {
        const xSignature = req.headers["x-signature"];
        const xRequestId = req.headers["x-request-id"];
        const dataId = body.data.id;

        const parts = xSignature.split(",");
        const timestamp = parts[0].split("=")[1];
        const signature = parts[1].split("=")[1];

        const payload = `${timestamp}.${xRequestId}.${dataId}`;
        const hash = crypto
            .createHmac("sha256", process.env.MP_WEBHOOK_SECRET)
            .update(payload)
            .digest("hex");

        return hash === signature;
    }

    static checkPaymentStatus = asyncHandler(async (req, res) => {
        try {
            const { paymentId } = req.params;

            // Buscar el pago en nuestra base de datos
            const payment = await Payment.findOne({
                where: { payment_id: paymentId },
            });

            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: "Pago no encontrado",
                });
            }

            // Verificar si ya existe una inscripción activa
            let enrollment = null;
            if (payment.status === "completed") {
                enrollment = await Enrollment.findOne({
                    where: {
                        user_id: payment.user_id,
                        course_id: payment.course_id,
                        status: "active",
                    },
                    include: [
                        {
                            model: Course,
                            as: "course",
                            attributes: ["course_id", "course_name"],
                        },
                    ],
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
                    enrollment: enrollment
                        ? {
                              enrollment_id: enrollment.enrollment_id,
                              course_name: enrollment.course.course_name,
                          }
                        : null,
                },
                message: "Estado del pago obtenido correctamente",
            });
        } catch (error) {
            console.error("Error al verificar estado del pago:", error);
            return res.status(500).json({
                success: false,
                message: "Error al verificar estado del pago",
                error: error.message,
            });
        }
    });

    static handleSuccess = asyncHandler(async (req, res) => {
        try {
            const { payment_id, collection_id, external_reference } = req.query;

            // Validar parámetros mínimos
            if (!external_reference) {
                console.error("Falta external_reference en la URL de éxito");
                return res.redirect(
                    `${process.env.FRONTEND_URL}/payment/failure?error=missing_reference`
                );
            }

            // Verificar estado con MercadoPago si es necesario
            const paymentIdToCheck = payment_id || collection_id;
            if (paymentIdToCheck) {
                const mpPayment = await paymentClient.get({ id: Number(paymentIdToCheck) });
                if (!mpPayment || mpPayment.status !== "approved") {
                    return res.redirect(
                        `${process.env.FRONTEND_URL}/payment/failure?error=payment_not_approved`
                    );
                }
            }

            // Buscar y actualizar el pago en la base de datos
            const payment = await Payment.findOne({ where: { payment_id: external_reference } });
            if (!payment) {
                return res.redirect(
                    `${process.env.FRONTEND_URL}/payment/failure?error=payment_not_found`
                );
            }

            // Redirigir al frontend con el ID de pago
            return res.redirect(
                `${process.env.FRONTEND_URL}/payment/success?external_reference=${external_reference}`
            );
        } catch (error) {
            console.error("Error en handleSuccess:", error);
            return res.redirect(`${process.env.FRONTEND_URL}/payment/failure?error=server_error`);
        }
    });

    static handleFailure = asyncHandler(async (req, res) => {
        // 1. Redirigir a la página de fallo con un mensaje
        return res.status(400).json({
            success: false,
            message: "El pago no fue aprobado. Por favor, inténtelo de nuevo.",
        });
    });
}

module.exports = PaymentController;
