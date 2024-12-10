-- Se elimina la base de datos si existe y se crea una nueva
DROP DATABASE IF EXISTS `classment-academy`;
CREATE DATABASE `classment-academy`;
USE `classment-academy`;

-- Estructura de la tabla `roles`
CREATE TABLE `roles` (
  `rol_id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `rol_nombre` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Estructura de la tabla `escuelas`
CREATE TABLE `escuelas` (
  `escuela_id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `escuela_nombre` VARCHAR(100) NOT NULL,
  `escuela_nit` INT(10) NOT NULL,  
  `escuela_descripcion` TEXT,
  `escuela_telefono` VARCHAR(20) NOT NULL,
  `escuela_direccion` TEXT NOT NULL,
  `escuela_correo` VARCHAR (100)  NOT NULL,
  `escuela_password`  VARCHAR (255) NOT NULL,
  `escuela_imagen_url` VARCHAR(255) DEFAULT '/PUBLIC/Img/escuelas/nf.jpg',
  `escuela_fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `escuela_estado` ENUM('activo', 'inactivo') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Estructura de la tabla `usuarios`
CREATE TABLE `usuarios` (
  `usuario_documento` VARCHAR(20) NOT NULL PRIMARY KEY,
  `usuario_tipo_documento` ENUM('CC', 'CE', 'TI', 'PPN', 'NIT', 'SSN', 'EIN') NOT NULL,
  `usuario_nombre` VARCHAR(100) NOT NULL,
  `usuario_apellido` VARCHAR(100) NOT NULL,
  `usuario_correo` VARCHAR(100) NOT NULL UNIQUE,
  `usuario_password` VARCHAR(255) NOT NULL,
  `usuario_telefono` VARCHAR(20),
  `usuario_direccion` TEXT,
  `usuario_nacimiento` DATE NOT NULL,
  `usuario_imagen_url` VARCHAR(255) DEFAULT '../../PUBLIC/Img/usuarios/nf.jpg',
  `usuario_fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `usuario_ultima_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `usuario_estado` ENUM('activo', 'inactivo') DEFAULT 'activo',
  `rol_id` INT NOT NULL,
  `escuela_id` INT NOT NULL,
  FOREIGN KEY (`rol_id`) REFERENCES `roles`(`rol_id`),
  FOREIGN KEY (`escuela_id`) REFERENCES `escuelas`(`escuela_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
 
CREATE TABLE `recuperacion_cuentas` (
    `recuperacion_id` INT PRIMARY KEY AUTO_INCREMENT,
    `usuario_documento` VARCHAR(20) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `fecha_expiracion` TIMESTAMP DEFAULT DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 HOUR),
    FOREIGN KEY (`usuario_documento`) REFERENCES `usuarios`(`usuario_documento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Estructura de la tabla `cursos`
CREATE TABLE `cursos` (
  `curso_id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `curso_nombre` VARCHAR(100) NOT NULL,
  `curso_descripcion` TEXT,
  `curso_precio` DECIMAL(10, 2) NOT NULL,
  `curso_cupos` INT NOT NULL,
  `curso_capacidad_maxima` INT NOT NULL,
  `curso_edad_minima` INT NOT NULL DEFAULT 0,
  `curso_imagen_url` VARCHAR(255) DEFAULT '/PUBLIC/Img/cursos/nf.jpg',
  -- PENDIENTE POR AGREGAR LA GALERIA DEL CURSO`
  `curso_fecha_inicio` DATE NOT NULL,
  `curso_fecha_fin` DATE NOT NULL,
  `curso_estado` ENUM('activo', 'inactivo', 'completo') DEFAULT 'activo',
  `escuela_id` INT NOT NULL,
  `curso_direccion` TEXT NOT NULL,
  FOREIGN KEY (`escuela_id`) REFERENCES `escuelas`(`escuela_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Estructura de la tabla `horarios`
CREATE TABLE `horarios` (
  `horario_id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `curso_id` INT NOT NULL,
  `horario_dia_semana` ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo') NOT NULL,
  `horario_hora_inicio` TIME NOT NULL,
  `horario_hora_fin` TIME NOT NULL,
  FOREIGN KEY (`curso_id`) REFERENCES `cursos`(`curso_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Estructura de la tabla `profesores_cursos`
CREATE TABLE `profesores_cursos` (
  `profesor_id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `escuela_id` VARCHAR(100) NOT NULL,
  `usuario_documento` VARCHAR(20) NOT NULL,
  `curso_id` INT NOT NULL,
  FOREIGN KEY (`usuario_documento`) REFERENCES `usuarios`(`usuario_documento`),
  FOREIGN KEY (`curso_id`) REFERENCES `cursos`(`curso_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Estructura de la tabla `matriculas`
CREATE TABLE `matriculas` (
  `matricula_id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `matricula_fecha` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `matricula_fecha_fin` DATE NOT NULL,
  `matricula_estado` ENUM('activo', 'inactivo', 'completado') DEFAULT 'activo',
  `matricula_plan` ENUM('mensual', 'trimestral', 'semestral', 'anual') NOT NULL,
  `curso_id` INT NOT NULL,
  `usuario_documento` VARCHAR(20) NOT NULL,
  FOREIGN KEY (`curso_id`) REFERENCES `cursos`(`curso_id`),
  FOREIGN KEY (`usuario_documento`) REFERENCES `usuarios`(`usuario_documento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Estructura de la tabla `asistencias`
CREATE TABLE `asistencias` (
  `asistencia_id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `matricula_id` INT NOT NULL,
  `asistencia_fecha` DATE NOT NULL,
  `asistencia_estado` ENUM('presente', 'ausente', 'justificado') NOT NULL,
  FOREIGN KEY (`matricula_id`) REFERENCES `matriculas`(`matricula_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Estructura de la tabla `metodos_pagos`
CREATE TABLE `metodos_pagos` (
  `metodo_pago_id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `metodo_pago_nombre` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Estructura de la tabla `ordenes_pagos`
CREATE TABLE `ordenes_pagos` (
  `orden_pago_id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `usuario_documento` VARCHAR(20) NOT NULL,
  `curso_id` INT NOT NULL,
  `metodo_pago_id` INT NOT NULL,
  `orden_pago_monto` DECIMAL(10, 2) NOT NULL,
  `orden_pago_fecha` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `orden_pago_estado` ENUM('pendiente', 'pagada', 'cancelada') DEFAULT 'pendiente',
  `orden_pago_fecha_plazo` TIMESTAMP NULL,
  `orden_pago_estado_pago` ENUM('pendiente', 'completado', 'fallido') DEFAULT 'pendiente',
  `orden_pago_numero_referencia` VARCHAR(50),
  FOREIGN KEY (`usuario_documento`) REFERENCES `usuarios`(`usuario_documento`),
  FOREIGN KEY (`curso_id`) REFERENCES `cursos`(`curso_id`),
  FOREIGN KEY (`metodo_pago_id`) REFERENCES `metodos_pagos`(`metodo_pago_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Estructura de la tabla `facturas`
CREATE TABLE `facturas` (
  `factura_id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `orden_pago_id` INT NOT NULL,
  `factura_fecha_emision` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `factura_total` DECIMAL(10, 2) NOT NULL,
  `factura_estado` ENUM('emitida', 'pagada', 'anulada') DEFAULT 'emitida',
  FOREIGN KEY (`orden_pago_id`) REFERENCES `ordenes_pagos`(`orden_pago_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Estructura de la tabla `mensajes`
CREATE TABLE `mensajes` (
  `mensaje_id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `remitente_documento` VARCHAR(20) NOT NULL,
  `destinatario_documento` VARCHAR(20) NOT NULL,
  `mensaje_asunto` VARCHAR(255) NOT NULL,
  `mensaje_contenido` TEXT NOT NULL,
  `mensaje_fecha_envio` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `mensaje_leido` BOOLEAN DEFAULT FALSE,
  `mensaje_thread_id` INT,
  FOREIGN KEY (`remitente_documento`) REFERENCES `usuarios`(`usuario_documento`),
  FOREIGN KEY (`destinatario_documento`) REFERENCES `usuarios`(`usuario_documento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Se insertan roles iniciales
INSERT INTO `roles` (`rol_nombre`) VALUES
('invitado'),
('alumno'),
('profesor'),
('coordinador'),
('administrador');

-- Se insertan métodos de pago iniciales
INSERT INTO `metodos_pagos` (`metodo_pago_nombre`) VALUES
('Tarjeta de Crédito'),
('PSE'),
('Transferencia Bancaria'),
('Efecty'),
('PayPal');

-- Se crean índices adicionales para mejorar el rendimiento
CREATE INDEX idx_curso_estado ON `cursos` (`curso_estado`);
CREATE INDEX idx_matricula_estado ON `matriculas` (`matricula_estado`);
CREATE INDEX idx_orden_pago_estado ON `ordenes_pagos` (`orden_pago_estado`, `orden_pago_estado_pago`);
CREATE INDEX idx_mensaje_destinatario ON `mensajes` (`destinatario_documento`, `mensaje_leido`);


-- Datos de prueba para la tabla `escuelas`
INSERT INTO `escuelas` (`escuela_nombre`, `escuela_nit`, `escuela_descripcion`, `escuela_telefono`, `escuela_direccion`, `escuela_correo`, `escuela_password`, `escuela_fecha_creacion`, `escuela_estado`, `escuela_imagen_url`) VALUES
('GO FIT', '123456789-1', 'Entrenamiento y acondicionamiento fisico', '1234567890', 'Calle 123, Bogota D.C.', 'danielbernalg.04@gmail.com', '$2y$10$GqH1TO3tF.2wu5qBzMR/0Oq2vZI4WqI34.3PIT.oxiSf.4OH3kL9C', '2020-01-01 00:00:00', 'activo', '/PUBLIC/Img/escuelas/gofit.jpeg'),
('Soy Fitness', '987654321-1', 'Yoga, Pilates y mas', '9876543210', 'Avenida 456, primera de mayo con boyaca', 'soyfitness@gmail.com', '$2y$10$GqH1TO3tF.2wu5qBzMR/0Oq2vZI4WqI34.3PIT.oxiSf.4OH3kL9C', '2020-01-01 00:00:00', 'activo', '/PUBLIC/Img/escuelas/soyfitness.jpg'),
('Taekwondo', '555555555-1', 'Cursos de taekwondo para todos los niveles', '5555555555', 'Plaza Principal, Carrera 10 con circunvalar', 'taekwondo@gmail.com', '$2y$10$GqH1TO3tF.2wu5qBzMR/0Oq2vZI4WqI34.3PIT.oxiSf.4OH3kL9C', '2020-01-01 00:00:00', 'activo', '/PUBLIC/Img/escuelas/taekwondo.jpg'),
('Administrativo', '1234567891', 'Administracion classment academy', '1234567891', 'sena complejo sur, Bogota D.C.', 'classmentacademy@gmail.com', '$2y$10$GqH1TO3tF.2wu5qBzMR/0Oq2vZI4WqI34.3PIT.oxiSf.4OH3kL9C', '2020-01-01 00:00:00', 'activo', '/PUBLIC/Img/escuelas/administrativo.jpg');

-- Datos de prueba para la tabla `usuarios`
INSERT INTO `usuarios` (`usuario_documento`, `usuario_tipo_documento`, `usuario_nombre`, `usuario_apellido`, `usuario_correo`, `usuario_password`, `usuario_telefono`, `usuario_direccion`, `usuario_nacimiento`, `usuario_imagen_url`, `rol_id`, `escuela_id`) VALUES
('1025531531', 'CC', 'Kevin', 'Parra', 'luisparra5380@gmail.com', '$2y$10$GqH1TO3tF.2wu5qBzMR/0Oq2vZI4WqI34.3PIT.oxiSf.4OH3kL9C', '3001234567', 'Calle 789, tabogo', '1990-05-15', '/PUBLIC/Img/usuarios/1726301436_20240901_122208.jpg', 5, 4),
('1002002002', 'CC', 'Chris ', 'Bumstead', 'cbum@email.com', '$2y$10$GqH1TO3tF.2wu5qBzMR/0Oq2vZI4WqI34.3PIT.oxiSf.4OH3kL9C', '3001234560', 'Avenida 012, Ciudad C USA', '1985-10-20', '/PUBLIC/Img/usuarios/1726022704_coach_1.png', 5, 2),
('1003003003', 'CC', 'Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', '$2y$10$GqH1TO3tF.2wu5qBzMR/0Oq2vZI4WqI34.3PIT.oxiSf.4OH3kL9C', '3005555555', 'Carrera 345, Ciudad C', '1988-03-25', '/PUBLIC/Img/usuarios/nf.jpg', 3, 3),
('1004004004', 'CC', 'Ana', 'Martínez', 'ana.martinez@email.com', '$2y$10$GqH1TO3tF.2wu5qBzMR/0Oq2vZI4WqI34.3PIT.oxiSf.4OH3kL9C', '3007777777', 'Diagonal 678, Ciudad A', '1992-12-10', '/PUBLIC/Img/usuarios/nf.jpg', 4, 1),
('1004004005', 'CC', 'Marco', 'Gonzalez', 'marco@email.com', '$2y$10$GqH1TO3tF.2wu5qBzMR/0Oq2vZI4WqI34.3PIT.oxiSf.4OH3kL9C', '3087777777', 'Diagonal 788, Ciudadela colsubsidio', '1999-12-10', '/PUBLIC/Img/usuarios/nf.jpg', 2, 1),
('1025531522', 'CC', 'Daniel', 'Gomez', 'danielbernalg.04@gmail.com', '$2y$10$GqH1TO3tF.2wu5qBzMR/0Oq2vZI4WqI34.3PIT.oxiSf.4OH3kL9C', '3001234565', 'Calle 189, tayogo', '1991-05-15', '/PUBLIC/Img/usuarios/nf.jpg', 5, 1);


-- Datos de prueba para la tabla `cursos`

-- Cursos para GO FIT
INSERT INTO `cursos` (`curso_nombre`, `curso_descripcion`, `curso_precio`, `curso_cupos`, `curso_capacidad_maxima`, `curso_edad_minima`, `curso_imagen_url`, `curso_fecha_inicio`, `curso_fecha_fin`, `escuela_id`, `curso_direccion`) VALUES
('Entrenamiento personal', 'Asesorias de entrenamiento personal para lograr tus obejetivos', 500000, 15, 20, 16, '/PUBLIC/Img/cursos/entrenamiento.jpg', '2024-08-01', '2024-12-15', 1, 'GO FIT, Carrera 45b,diagonal 60 Sur'),
('Entrenamiento Funcional', 'Clases de entrenamiento funcional para mejorar tu rendimiento físico', 600000, 20, 25, 16, '/PUBLIC/Img/cursos/entrenamiento-funcional.jpg', '2024-08-01', '2024-12-15', 1, 'GO FIT, Carrera 45b, diagonal 60 Sur'),
('Defensa Personal', 'Programa de defensa personal para mejorar tu resistencia', 500000, 15, 20, 14, '/PUBLIC/Img/cursos/defensa_personal.jpg', '2024-09-01', '2025-01-15', 1, 'GO FIT, Carrera 45b, diagonal 60 Sur'),

-- Cursos para Soy Fitness
('Entrenamiento de Fuerza', 'Clases de entrenamiento de fuerza para tonificar el cuerpo', 650000, 15, 20, 18, '/PUBLIC/Img/cursos/entrenamiento_fuerza.jpeg', '2024-08-15', '2024-12-15', 2, 'Soy Fitness, Calle 45, Ciudad B'),
('Zumba', 'Clases de Zumba para quemar calorías y divertirse', 400000, 20, 25, 16, '/PUBLIC/Img/cursos/zumba.jpg', '2024-09-01', '2025-02-28', 2, 'Soy Fitness, Calle 45, Ciudad B'),

-- Cursos para Taekwondo
('Taekwondo Básico', 'Curso de taekwondo para principiantes', 500000, 20, 25, 8, '/PUBLIC/Img/cursos/taekwondo_ninos.jpg', '2024-07-15', '2024-12-20', 3, 'Aula 203, Taekwondo'),
('Taekwondo Avanzado', 'Curso avanzado de taekwondo para competidores', 700000, 15, 20, 10, '/PUBLIC/Img/cursos/2.jpg', '2024-08-01', '2025-01-15', 3, 'Aula 203, Taekwondo');

-- Datos de prueba para la tabla `horarios`
INSERT INTO `horarios` (`curso_id`, `horario_dia_semana`, `horario_hora_inicio`, `horario_hora_fin`) VALUES
(1, 'Lunes', '14:00:00', '16:00:00'),
(1, 'Miércoles', '14:00:00', '16:00:00'),
(2, 'Martes', '18:00:00', '20:00:00'),
(2, 'Jueves', '18:00:00', '20:00:00'),
(3, 'Lunes', '10:00:00', '12:00:00'),
(3, 'Miércoles', '10:00:00', '12:00:00'),
(3, 'Viernes', '10:00:00', '12:00:00');

-- Datos de prueba para la tabla `profesores_cursos`
INSERT INTO `profesores_cursos` (`escuela_id`, `usuario_documento`, `curso_id`) VALUES
('1','1002002002', 1),
('2','1002002002', 2),
('3','1003003003', 3);

-- Datos de prueba para la tabla `matriculas`
INSERT INTO `matriculas` (`matricula_fecha`, `matricula_fecha_fin`, `matricula_estado`, `matricula_plan`, `curso_id`, `usuario_documento`) VALUES
(CURRENT_TIMESTAMP, '2024-12-15', 'activo', 'semestral', 1, '1004004005'),
(CURRENT_TIMESTAMP, '2025-02-28', 'activo', 'anual', 2, '1004004005'),
(CURRENT_TIMESTAMP, '2024-12-20', 'activo', 'semestral', 3, '1004004004');

-- Datos de prueba para la tabla `asistencias`
INSERT INTO `asistencias` (`matricula_id`, `asistencia_fecha`, `asistencia_estado`) VALUES
(1, '2024-08-01', 'presente'),
(1, '2024-08-06', 'presente'),
(1, '2024-08-08', 'ausente'),
(2, '2024-09-01', 'presente'),
(2, '2024-09-03', 'presente'),
(3, '2024-07-15', 'presente'),
(3, '2024-07-17', 'justificado');

-- Datos de prueba para la tabla `ordenes_pagos`
INSERT INTO `ordenes_pagos` (`usuario_documento`, `curso_id`, `metodo_pago_id`, `orden_pago_monto`, `orden_pago_estado`, `orden_pago_estado_pago`, `orden_pago_numero_referencia`) VALUES
('1004004005', 1, 1, 50000, 'pagada', 'completado', 'REF001'),
('1004004005', 2, 2, 75000, 'pagada', 'completado', 'REF002'),
('1004004004', 3, 3, 60000, 'pendiente', 'pendiente', 'REF003');

-- Datos de prueba para la tabla `facturas`
INSERT INTO `facturas` (`orden_pago_id`, `factura_total`, `factura_estado`) VALUES 
(1, 50000, 'pagada'),
(2, 75000, 'pagada'),
(3, 60000, 'emitida');



-- Datos de prueba para la tabla `mensajes`
INSERT INTO `mensajes` (`remitente_documento`, `destinatario_documento`, `mensaje_asunto`, `mensaje_contenido`, `mensaje_leido`, `mensaje_thread_id`) VALUES 
('1004004005', '1002002002', 'Consulta sobre el curso', '¿Podría darme más información sobre los materiales necesarios para el curso de Pintura al Óleo?', FALSE, 1),
('1002002002', '1004004005', 'RE: Consulta sobre el curso', 'Claro, con gusto. Para el curso necesitarás lo siguiente: [lista de materiales]', FALSE, 1),
('1004004004', '1003003003', 'Cambio de horario', '¿Es posible cambiar mi horario del curso de Inglés Intermedio?', FALSE, 2),
('1003003003', '1004004004', 'RE: Cambio de horario', 'Podemos discutir las opciones disponibles. ¿Qué horario te convendría más?', FALSE, 2),
('1025531531', '1004004005', 'Recordatorio de pago', 'Recuerde que tiene un pago pendiente por el curso de Matemáticas Avanzadas.', FALSE, 3); 