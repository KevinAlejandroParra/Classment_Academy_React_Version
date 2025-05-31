"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function PromotionBanner() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    {
      id: 1,
      title: "Crear Cuenta",
      description: "Regístrate como administrador con un correo válido y activo",
      icon: "👤",
      color: "from-yellow-400 to-yellow-600"
    },
    {
      id: 2,
      title: "Notificación", 
      description: "Te notificaremos sobre tu postulación automáticamente",
      icon: "🔔",
      color: "from-blue-400 to-blue-600"
    },
    {
      id: 3,
      title: "Contrato",
      description: "Recibirás términos y condiciones para firmar por correo",
      icon: "📄", 
      color: "from-green-400 to-green-600"
    },
    {
      id: 4,
      title: "Activación",
      description: "Una vez validados los documentos, obtendrás permisos completos",
      icon: "✅",
      color: "from-purple-400 to-purple-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center mb-16"
          variants={itemVariants}
        >
          <motion.div
            className="inline-block mb-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg"
                 style={{ boxShadow: "0 4px 30px rgba(var(--highlight-rgb), 0.5)" }}>
              Impulsa tu negocio con
            </div>
          </motion.div>
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Classment
            </span>
            <br />
            <span className="text-3xl md:text-5xl text-[rgb(var(--foreground-rgb))]">Members</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-[rgb(var(--foreground-rgb))] max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Únete a la revolución educativa. Transforma tu escuela en pro de tus operaciones.
          </motion.p>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div variants={itemVariants}>
            <div className=" rounded-3xl p-8 shadow-2xl"
                 style={{ boxShadow: "0 4px 30px rgba(var(--highlight-rgb), 0.5)" }}>
              <h2 className="text-3xl font-bold text-[rgb(var(--foreground-rgb))] mb-6">
                ¿Por qué unirme a Classment?
              </h2>
              <div className="space-y-6 ">
                {[
                  { icon: "🚀", text: "Plataforma moderna y escalable" },
                  { icon: "💰", text: "Monetiza tus cursos eficientemente" },
                  { icon: "📊", text: "Toma el control de tu modelo" },
                  { icon: "🌍", text: "Alcance para tus estudiantes" },
                  { icon: "🛡️", text: "Seguridad y respaldo garantizado" }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-2xl">{benefit.icon}</div>
                    <p className="text-lg text-[rgb(var(--foreground-rgb))]">{benefit.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl p-8 text-[rgb(var(--background-rgb))] shadow-2xl"
                 style={{ boxShadow: "0 4px 30px rgba(var(--highlight-rgb), 0.5)" }}>
              <h3 className="text-3xl text-[rgb(var(--foreground-rgb))] font-bold mb-6">¡Comienza Hoy!</h3>
              <p className="text-lg mb-8 opacity-90">
                Grandes escuelas ya confían en nosotros. Es tu turno de brillar!
              </p>
              <div className="space-y-4">
                <motion.button
                  className="w-full bg-black text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/register'}
                >
                  Crear Cuenta de Administrador
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
        <motion.div variants={itemVariants}>
          <h2 className="text-4xl font-bold text-center text-[rgb(var(--foreground-rgb))] mb-12">
            Proceso de Integración
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => setActiveStep(index)}
              >
                <div className={`bg-gradient-to-br ${step.color} rounded-2xl p-6 text-white shadow-xl h-full`}
                     style={{ boxShadow: "0 4px 30px rgba(var(--highlight-rgb), 0.5)" }}>
                  <div className="text-center">
                    <div className="text-4xl mb-4">{step.icon}</div>
                    <div className="bg-yellow-300 bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4">
                      <span className="font-bold">{step.id}</span>
                    </div>
                    <h3 className="font-bold text-xl mb-3">{step.title}</h3>
                    <p className="text-sm opacity-90 leading-relaxed">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">→</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div 
          className="mt-16 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-8 border-l-4 border-red-400"
          variants={itemVariants}
          style={{ boxShadow: "0 4px 30px , 0.5)" }}
        >
          <div className="flex items-start space-x-4">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="font-bold text-lg text-red-800 dark:text-red-300 mb-2">
                Información Importante
              </h3>
              <p className="text-red-700 dark:text-red-400 leading-relaxed">
                <strong>Recuerda:</strong> Es fundamental ingresar un correo electrónico válido y activo durante el registro. 
                Este será nuestro canal principal de comunicación para enviarte el contrato de términos y condiciones, 
                así como todas las actualizaciones sobre el estado de tu postulación.
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div 
          className="text-center mt-16"
          variants={itemVariants}
        >
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <button 
              onClick={() => window.location.href = '/register'}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-4 px-12 rounded-full text-xl shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300"
              style={{ boxShadow: "0 4px 30px rgba(var(--highlight-rgb), 0.5)" }}
            >
              🎓 Comenzar Mi Academia Ahora
            </button>
          </motion.div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            ¿Tienes preguntas? Contáctanos y te ayudaremos en cada paso.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
