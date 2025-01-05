-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-12-2024 a las 19:32:02
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `classcov`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrations`
--

CREATE TABLE `administrations` (
  `id` int(11) NOT NULL,
  `name` varchar(70) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `password` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `hire_date` date NOT NULL,
  `role` varchar(255) NOT NULL,
  `status` varchar(20) NOT NULL,
  `file` varchar(255) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `administrations`
--

INSERT INTO `administrations` (`id`, `name`, `email`, `phone`, `password`, `date_of_birth`, `hire_date`, `role`, `status`, `file`, `createdAt`, `updatedAt`) VALUES
(18, 'Admin', 'admin@admin.com', '0123456789', '$2a$10$blwMNs0xudFuhcC/mJNLIuTd0qiLSJVHvCrUDpdrcsZ/VvvXJhlZa', '2024-10-17', '2024-10-17', 'admin', 'Activo', '/1729179093344_th.jpg', '2024-10-17', '2024-10-17');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `content` varchar(500) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `file` varchar(255) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `content`, `teacher_id`, `class_id`, `date`, `file`, `createdAt`, `updatedAt`) VALUES
(6, 'junta de padres', 'junta para padres de familia', 9, 1, '2024-11-25 18:51:00', '/1732560804297_dcmbm_1.jpg', '2024-11-25', '2024-11-25'),
(7, 'anuncio', 'prueba', 9, 1, '2024-11-25 18:59:00', '/1732561184568_maria-del-carmen-toro-castillo.jpg', '2024-11-25', '2024-11-25'),
(8, 'prueba numero 2', 'esta es la prueba numero 2', 9, 1, '2024-11-26 15:54:00', '/1732639686900_gilberto_velazquez_juarez.jpg', '2024-11-26', '2024-11-26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `archivos`
--

CREATE TABLE `archivos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `ruta` varchar(255) NOT NULL,
  `fecha_subida` datetime DEFAULT current_timestamp(),
  `tipo` varchar(50) DEFAULT NULL,
  `tamano` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `grade` int(11) NOT NULL,
  `salon` varchar(5) NOT NULL,
  `shift` varchar(20) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `classes`
--

INSERT INTO `classes` (`id`, `grade`, `salon`, `shift`, `teacher_id`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'A', 'Matutino', 9, '2024-09-26', '2024-10-03'),
(2, 2, 'A', 'Matutino', 10, '2024-09-30', '2024-11-25'),
(3, 3, 'A', 'Matutino', 6, '2024-10-03', '2024-10-03'),
(4, 4, 'A', 'Matutino', 7, '2024-10-03', '2024-10-03'),
(5, 5, 'A', 'Matutino', 5, '2024-10-03', '2024-10-03'),
(6, 6, 'A', 'Matutino', 6, '2024-10-03', '2024-10-03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `guardians`
--

CREATE TABLE `guardians` (
  `id` int(11) NOT NULL,
  `name` varchar(70) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `password` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `role` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  `file` varchar(255) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `guardians`
--

INSERT INTO `guardians` (`id`, `name`, `email`, `phone`, `password`, `date_of_birth`, `role`, `status`, `file`, `createdAt`, `updatedAt`) VALUES
(3, 'Iván Mendoza', 'ivan@tutors.com', '3322659874', '123456', '1980-02-28', '3', 'Activo', '', '2024-09-30', '2024-09-30'),
(4, 'Nancy Contreras Lopez', 'nancy@tutor.com', '3366987452', '123456', '1984-07-12', '3', 'Activo', '', '2024-10-03', '2024-10-03'),
(5, 'Norma Guzman', 'norma@tutor.com', '3345782136', '123456', '1972-08-10', '3', 'Activo', '', '2024-10-03', '2024-10-03'),
(6, 'Alejandro Caballero', 'alejandro@tutor.com', '3366987452', '123456', '1967-08-11', '3', 'Activo', '', '2024-10-03', '2024-10-03'),
(8, 'tutor 1', 'tutor1@tutor.com', '0123456789', '$2a$10$S7X/1ma8Fxfxc342IgVuK.Z2uOpqXO6xHuICYmcPu/axF1g6xtkDy', '2024-10-15', 'guardian', 'Activo', '/1729180836055_mroi_1.jpg', '2024-10-17', '2024-10-17'),
(9, 'Tutor Eduardo', 'eduardoblanco58@gmail.com', '0123456789', '$2a$10$UCxYqdHkkOmsTkXBeIBUbu0MWSazv.m/exbwx8amER4M1zvzh.eSO', '2024-12-09', 'guardian', 'Activo', '/1733767111937_juan_manuel_viveros_paredes.jpg', '2024-12-09', '2024-12-09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `name` varchar(70) NOT NULL,
  `email` varchar(50) NOT NULL,
  `guardian_id` int(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `admission` date NOT NULL,
  `status` varchar(20) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `role` varchar(20) NOT NULL,
  `file` varchar(255) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `students`
--

INSERT INTO `students` (`id`, `name`, `email`, `guardian_id`, `password`, `date_of_birth`, `admission`, `status`, `phone`, `role`, `file`, `createdAt`, `updatedAt`) VALUES
(12, 'Alumno 1', 'alumno1@alumnos.com', 3, '$2a$10$pf1EXy3mxCxodc8z4Ioaj.WNLitC2i91XkmXWaL7v9imTUigg3ICy', '2024-11-12', '2024-11-12', 'Activo', '0123456789', 'student', '/1731427843849_luis_guillermo_guerrero.jpg', '2024-11-12', '2024-11-12'),
(13, 'Alumno 2', 'alumno2@alumnos.com', 5, '$2a$10$NNk4hsvu0CzPTyS3pDTaU.XsHBlJIOFJleRjdvL28ql9BwoaGuWTi', '2024-11-12', '2024-11-12', 'Activo', '0123456789', 'student', '/1731435492512_maria-del-carmen-toro-castillo.jpg', '2024-11-12', '2024-11-12'),
(14, 'Alumno 3', 'alumno3@alumnos.com', 8, '$2a$10$fgOFb6b6Dy7gAFUJaR9yTOqFz3M//ZHrdTCufjiF9oKCMKBKWQPyS', '2024-12-02', '2024-12-02', 'Activo', '0123456789', 'student', '/1733161972664_adelaida-sara-minia-zepeda-morales.jpg', '2024-12-02', '2024-12-02'),
(15, 'Alumno Eduardo', 'eduardoblanco58@gmail.com', 9, '$2a$10$84Dv8vD8qeFOWykCP5iDdeJE0d86rWsBffnAGiq/A1yWNNTY35QwW', '2024-12-09', '2024-12-09', 'Activo', '0123456789', 'student', '/1733767171309_braniff-de-la-torre-valdovinos.jpg', '2024-12-09', '2024-12-09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `students_classes`
--

CREATE TABLE `students_classes` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `students_classes`
--

INSERT INTO `students_classes` (`id`, `student_id`, `class_id`, `createdAt`, `updatedAt`) VALUES
(1, 12, 1, '2024-11-12', '2024-11-12'),
(3, 13, 2, '2024-11-12', '2024-11-12'),
(4, 14, 1, '2024-12-02', '2024-12-02'),
(5, 15, 1, '2024-12-09', '2024-12-09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(500) NOT NULL,
  `deliveryDate` date NOT NULL,
  `notes` varchar(200) NOT NULL,
  `status` varchar(20) NOT NULL,
  `class_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `file` varchar(255) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `description`, `deliveryDate`, `notes`, `status`, `class_id`, `teacher_id`, `file`, `createdAt`, `updatedAt`) VALUES
(16, 'Sumas 2', 'Realizar 10 sumas de 2 dígitos.', '2024-11-09', '', 'Asignada', 1, 5, '', '2024-10-04', '2024-11-25'),
(17, 'Restas', 'Realizar 10 restas.', '2024-11-01', '', 'Asignada', 2, 6, '', '2024-10-04', '2024-10-04'),
(19, 'Tarea de prueba', 'esta es una tarea de prueba', '2024-12-03', '', 'Asignada', 1, 9, '/1733247095105_dcbmt_1.png', '2024-12-03', '2024-12-03'),
(20, 'Tarea 2', 'Tarea de prueba numero 2', '2024-12-05', '', 'Asignada', 1, 9, '', '2024-12-05', '2024-12-05'),
(26, 'Correo', 'Correo de prueba ', '2024-12-10', '', 'Asignada', 1, 9, '', '2024-12-10', '2024-12-10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `teachers`
--

CREATE TABLE `teachers` (
  `id` int(11) NOT NULL,
  `name` varchar(70) NOT NULL,
  `email` varchar(50) NOT NULL,
  `hire_date` date NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `date_of_birth` date NOT NULL,
  `role` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  `file` varchar(255) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `teachers`
--

INSERT INTO `teachers` (`id`, `name`, `email`, `hire_date`, `password`, `phone`, `date_of_birth`, `role`, `status`, `file`, `createdAt`, `updatedAt`) VALUES
(5, 'Andres Galindo', 'andres@maestros.com', '2024-09-25', '123456', '3369587841', '1983-07-14', '2', 'Activo', '/1729017047933_mendizabal-ruiz-adriana-patricia.jpg', '2024-09-25', '2024-10-15'),
(6, 'Bryan Ferreira', 'bryan@profesor.com', '2024-09-05', '123456', '3366987520', '1986-04-05', '2', '', '/1729015605593_mcria_7.jpg', '2024-09-30', '2024-10-15'),
(7, 'Mateo Lopez', 'mateo@profes.com', '2024-10-03', '123456', '3322659874', '1972-06-08', '2', '', '', '2024-10-03', '2024-10-03'),
(8, 'asdf', 'asfd', '2024-10-15', 'asd', '0123456789', '2024-10-01', '2', 'act', '/1729007888769_adelaida-sara-minia-zepeda-morales.jpg', '2024-10-15', '2024-10-15'),
(9, 'profesor 1', 'profe1@profes.com', '2024-10-03', '$2a$10$WdAxhyB1XIRmQ1TTZIklzOCEZ/3lN8jMCVyNHggiTNrVzRfQnyeRa', '0123456789', '2024-10-03', 'teacher', 'Activo', '/1729180730557_dcbmt.p_1.png', '2024-10-17', '2024-10-17'),
(10, 'profesor 2', 'profe2@profes.com', '2024-11-25', '$2a$10$lombykqe8xGynPcwhggGge4Yj8hnkJGc2zzeLpjfXSd.mn352vjS.', '0123456789', '1986-02-04', 'teacher', 'Activo', '/1732551887322_gilberto_velazquez_juarez.jpg', '2024-11-25', '2024-11-25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `uptasks`
--

CREATE TABLE `uptasks` (
  `id` int(11) NOT NULL,
  `file` varchar(255) NOT NULL,
  `task_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `qualification` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `uptasks`
--

INSERT INTO `uptasks` (`id`, `file`, `task_id`, `student_id`, `qualification`, `createdAt`, `updatedAt`) VALUES
(21, '/1732810927509_dcmbm_4.jpg', 16, 12, '', '2024-11-28 16:22:07', '2024-11-28'),
(22, '/1733247147842_dra._teresa_romero_1.jpg', 19, 12, '10', '2024-12-03 17:32:27', '2024-12-09'),
(23, '/1733247255436_adalberto-zamudio-ojeda.jpg', 19, 14, '5', '2024-12-03 17:34:15', '2024-12-09'),
(24, '/1733423942254_bioquimica-3.jpg', 20, 12, '10', '2024-12-05 18:39:02', '2024-12-09');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administrations`
--
ALTER TABLE `administrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Indices de la tabla `archivos`
--
ALTER TABLE `archivos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Indices de la tabla `guardians`
--
ALTER TABLE `guardians`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD KEY `guardian_id` (`guardian_id`);

--
-- Indices de la tabla `students_classes`
--
ALTER TABLE `students_classes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indices de la tabla `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Indices de la tabla `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `uptasks`
--
ALTER TABLE `uptasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `student_id` (`student_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `administrations`
--
ALTER TABLE `administrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `archivos`
--
ALTER TABLE `archivos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `guardians`
--
ALTER TABLE `guardians`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `students_classes`
--
ALTER TABLE `students_classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `uptasks`
--
ALTER TABLE `uptasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  ADD CONSTRAINT `announcements_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`);

--
-- Filtros para la tabla `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`);

--
-- Filtros para la tabla `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`guardian_id`) REFERENCES `guardians` (`id`);

--
-- Filtros para la tabla `students_classes`
--
ALTER TABLE `students_classes`
  ADD CONSTRAINT `students_classes_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `students_classes_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`);

--
-- Filtros para la tabla `uptasks`
--
ALTER TABLE `uptasks`
  ADD CONSTRAINT `uptasks_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`),
  ADD CONSTRAINT `uptasks_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
