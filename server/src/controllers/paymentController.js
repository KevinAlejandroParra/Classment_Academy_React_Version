const { Course, User, Enrollment, Payment } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { MercadoPagoConfig, Preference, Payment: MPPayment } = require("mercadopago");
const asyncHandler = require("../middleware/asyncHandler");
const crypto = require("crypto");

// Configuración de credenciales
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "APP_USR-2745143215161147-042900-26e96cb52a1945424150974e22420851-2410996615",
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

            const cleanFrontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "");
            const cleanApiUrl = process.env.API_URL?.replace(/\/$/, "");

            if (!cleanFrontendUrl || !cleanApiUrl) {
                throw new Error("Configuración de URLs no definida");
            }

            const course = await Course.findByPk(courseId);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Curso no encontrado",
                });
            }

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Usuario no encontrado",
                });
            }

            // Verificar si ya existe una inscripción activa
            const existingEnrollment = await Enrollment.findOne({
                where: {
                    user_id: userId,
                    course_id: courseId,
                    status: "active",
                }
            });

            if (existingEnrollment) {
                return res.status(400).json({
                    success: false,
                    message: "Ya estás inscrito en este curso",
                });
            }

            const paymentId = uuidv4();
            const courseTitle = course.course_name || "Curso";
            const paymentDescription = description || `Inscripción al curso ${courseTitle}`;

            // Crear preferencia con Mercado Pago
            const preference = {
                items: [
                    {
                        id: courseId.toString(),
                        title: paymentDescription,
                        quantity: 1,
                        currency_id: "COP",
                        unit_price: parseFloat(amount),
                    },
                ],
                back_urls: {
                    success: `${cleanFrontendUrl}/payment/success`,
                    failure: `${cleanFrontendUrl}/payment/failure`,
                    pending: `${cleanFrontendUrl}/payment/pending`,
                },
                notification_url: `${cleanApiUrl}/api/payments/webhook`,
                external_reference: paymentId,
                auto_return: "approved",
                metadata: {
                    user_id: userId,
                    course_id: courseId,
                    payment_description: paymentDescription
                }
            };

            // Guardar registro de pago pendiente
            await Payment.create({
                payment_id: paymentId,
                user_id: userId,
                course_id: courseId,
                amount: parseFloat(amount),
                status: "pending",
                payment_method: "mercadopago",
                description: paymentDescription,
            });

            const response = await preferenceClient.create({ body: preference });

            if (!response || !response.init_point) {
                console.error("Respuesta inesperada:", response);
                throw new Error("No se recibió URL de pago de MercadoPago");
            }

            return res.status(200).json({
                success: true,
                paymentId: paymentId,
                paymentUrl: response.init_point, 
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
            const { body } = req;
            
            console.log("Webhook recibido:", JSON.stringify(body));
            
            // Validar la acción del webhook
            if (!body.data || !body.data.id) {
                return res.status(400).json({
                    success: false,
                    message: "Formato de webhook no válido",
                });
            }

            // Obtener detalles del pago desde Mercado Pago
            const paymentId = body.data.id;
            const payment = await paymentClient.get({ id: Number(paymentId) });
            
            if (!payment) {
                console.error("Pago no encontrado en MercadoPago:", paymentId);
                return res.status(404).json({ success: false, message: "Pago no encontrado" });
            }
            
            console.log("Detalles del pago:", JSON.stringify(payment));
            
            // Buscar el pago en nuestra base de datos mediante external_reference
            if (!payment.external_reference) {
                console.error("External reference no encontrado en la respuesta de MercadoPago");
                return res.status(400).json({ success: false, message: "Referencia externa no encontrada" });
            }
            
            const dbPayment = await Payment.findOne({
                where: { payment_id: payment.external_reference }
            });
            
            if (!dbPayment) {
                console.error("Pago no encontrado en base de datos:", payment.external_reference);
                return res.status(404).json({ success: false, message: "Pago no registrado en sistema" });
            }
            
            // Actualizar estado del pago en nuestra base de datos
            const paymentStatus = payment.status === "approved" ? "completed" : 
                                  payment.status === "rejected" ? "failed" : 
                                  payment.status === "in_process" ? "pending" : "pending";
            
            await dbPayment.update({
                status: paymentStatus,
                mp_payment_id: payment.id.toString(),
                mp_status: payment.status,
                mp_status_detail: payment.status_detail,
                updated_at: new Date()
            });
            
            // Si el pago es exitoso, crear la inscripción
            if (paymentStatus === "completed") {
                // Verificar si ya existe una inscripción
                const existingEnrollment = await Enrollment.findOne({
                    where: {
                        user_id: dbPayment.user_id,
                        course_id: dbPayment.course_id,
                    }
                });
                
                if (!existingEnrollment) {
                    // Crear nueva inscripción
                    await Enrollment.create({
                        enrollment_id: uuidv4(),
                        user_id: dbPayment.user_id,
                        course_id: dbPayment.course_id,
                        payment_id: dbPayment.payment_id,
                        status: "active",
                        enrolled_at: new Date(),
                    });
                    
                    console.log("Inscripción creada correctamente para el usuario:", dbPayment.user_id);
                    
                    // Aquí podrías implementar el envío de un correo de confirmación
                    // sendEnrollmentEmail(dbPayment.user_id, dbPayment.course_id);
                } else if (existingEnrollment.status !== "active") {
                    // Actualizar inscripción existente si no está activa
                    await existingEnrollment.update({
                        status: "active",
                        payment_id: dbPayment.payment_id,
                    });
                    
                    console.log("Inscripción actualizada para el usuario:", dbPayment.user_id);
                }
            }
            
            // Responder al webhook con éxito
            return res.status(200).json({ success: true, message: "Notificación procesada correctamente" });
            
        } catch (error) {
            console.error("Error en webhook:", error);
            return res.status(500).json({
                success: false,
                message: "Error procesando webhook",
                error: error.message
            });
        }
    });

    static verifyMercadoPagoSignature(req, body) {
        try {
            const xSignature = req.headers["x-signature"];
            
            if (!xSignature || !process.env.MP_WEBHOOK_SECRET) {
                return false;
            }
            
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
        } catch (error) {
            console.error("Error al verificar firma:", error);
            return false;
        }
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

            // Si el pago está pendiente y tiene ID de Mercado Pago, verificar estado actual
            if (payment.status === "pending" && payment.mp_payment_id) {
                try {
                    const mpPayment = await paymentClient.get({ id: Number(payment.mp_payment_id) });
                    
                    if (mpPayment && mpPayment.status) {
                        const newStatus = mpPayment.status === "approved" ? "completed" : 
                                          mpPayment.status === "rejected" ? "failed" : 
                                          mpPayment.status === "in_process" ? "pending" : payment.status;
                        
                        if (newStatus !== payment.status) {
                            await payment.update({
                                status: newStatus,
                                mp_status: mpPayment.status,
                                mp_status_detail: mpPayment.status_detail,
                                updated_at: new Date()
                            });
                            
                            // Si se confirma el pago, crear inscripción
                            if (newStatus === "completed") {
                                const existingEnrollment = await Enrollment.findOne({
                                    where: {
                                        user_id: payment.user_id,
                                        course_id: payment.course_id,
                                        status: "active"
                                    }
                                });
                                
                                if (!existingEnrollment) {
                                    await Enrollment.create({
                                        enrollment_id: uuidv4(),
                                        user_id: payment.user_id,
                                        course_id: payment.course_id,
                                        payment_id: payment.payment_id,
                                        status: "active",
                                        enrolled_at: new Date(),
                                    });
                                }
                            }
                        }
                    }
                } catch (mpError) {
                    console.error("Error al consultar estado en MercadoPago:", mpError);
                    // Continuar con el estado actual
                }
            }

            // Verificar si existe una inscripción activa
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
                    mp_status: payment.mp_status,
                    mp_status_detail: payment.mp_status_detail,
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

            // Buscar el pago en nuestra base de datos
            const payment = await Payment.findOne({ where: { payment_id: external_reference } });
            if (!payment) {
                return res.redirect(
                    `${process.env.FRONTEND_URL}/payment/failure?error=payment_not_found`
                );
            }

            // Verificar estado con MercadoPago si es necesario
            const mercadoPagoId = payment_id || collection_id;
            if (mercadoPagoId && payment.status !== "completed") {
                try {
                    const mpPayment = await paymentClient.get({ id: Number(mercadoPagoId) });
                    
                    if (mpPayment && mpPayment.status === "approved") {
                        // Actualizar estado del pago
                        await payment.update({
                            status: "completed",
                            mp_payment_id: mercadoPagoId,
                            mp_status: mpPayment.status,
                            mp_status_detail: mpPayment.status_detail,
                            updated_at: new Date()
                        });
                        
                        // Crear inscripción si no existe
                        const existingEnrollment = await Enrollment.findOne({
                            where: {
                                user_id: payment.user_id,
                                course_id: payment.course_id,
                                status: "active"
                            }
                        });
                        
                        if (!existingEnrollment) {
                            await Enrollment.create({
                                enrollment_id: uuidv4(),
                                user_id: payment.user_id,
                                course_id: payment.course_id,
                                payment_id: payment.payment_id,
                                status: "active",
                                enrolled_at: new Date(),
                            });
                        }
                    } else if (mpPayment && mpPayment.status === "rejected") {
                        // Actualizar como fallido
                        await payment.update({
                            status: "failed",
                            mp_payment_id: mercadoPagoId,
                            mp_status: mpPayment.status,
                            mp_status_detail: mpPayment.status_detail,
                            updated_at: new Date()
                        });
                        
                        return res.redirect(
                            `${process.env.FRONTEND_URL}/payment/failure?error=payment_rejected`
                        );
                    }
                } catch (mpError) {
                    console.error("Error al verificar pago con MercadoPago:", mpError);
                    // Continuar con la redirección normal
                }
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
        try {
            const { external_reference } = req.query;
            
            if (external_reference) {
                // Buscar y actualizar el pago como fallido
                const payment = await Payment.findOne({ where: { payment_id: external_reference } });
                if (payment && payment.status === "pending") {
                    await payment.update({
                        status: "failed",
                        updated_at: new Date()
                    });
                }
                
                return res.redirect(`${process.env.FRONTEND_URL}/payment/failure?external_reference=${external_reference}`);
            } else {
                return res.redirect(`${process.env.FRONTEND_URL}/payment/failure`);
            }
        } catch (error) {
            console.error("Error en handleFailure:", error);
            return res.redirect(`${process.env.FRONTEND_URL}/payment/failure?error=server_error`);
        }
    });
}

module.exports = PaymentController;