-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-03-2026 a las 14:27:15
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `inmobiliaria`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comprados`
--

CREATE TABLE `comprados` (
  `usuario_comprador` int(11) DEFAULT NULL,
  `Codigo_piso` int(11) DEFAULT NULL,
  `Precio_final` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comprados`
--

INSERT INTO `comprados` (`usuario_comprador`, `Codigo_piso`, `Precio_final`) VALUES
(4, 8, 450000),
(4, 1, 520000),
(1, 11, 290000),
(1, 11, 290000),
(1, 9, 315000),
(4, 9, 315000),
(4, 2, 750000),
(4, 11, 290000),
(4, 11, 290000),
(4, 1, 520000),
(4, 9, 315000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pisos`
--

CREATE TABLE `pisos` (
  `Codigo_piso` int(11) NOT NULL,
  `calle` varchar(40) NOT NULL,
  `numero` int(11) NOT NULL,
  `piso` int(11) NOT NULL,
  `puerta` varchar(5) NOT NULL,
  `cp` int(11) NOT NULL,
  `metros` int(11) NOT NULL,
  `zona` varchar(15) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `imagen` varchar(100) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pisos`
--

INSERT INTO `pisos` (`Codigo_piso`, `calle`, `numero`, `piso`, `puerta`, `cp`, `metros`, `zona`, `precio`, `imagen`, `usuario_id`) VALUES
(1, 'Calle Luna', 12, 1, 'B', 8010, 180, 'CENTRO', 520000.00, '1770814017_16.jpg', 3),
(2, 'Av. del Mar', 45, 0, '0', 28001, 250, 'Playa', 750000.00, '1770563478_6988a7963c2d1.jpg', 3),
(3, 'Paseo Olivos', 8, 2, 'C', 41012, 145, 'RESIDENCIAL', 385000.00, '1770563537_6988a7d14dbf0.jpg', 3),
(5, 'Calle Roble', 22, 0, 'BAJO', 28223, 210, 'NORTE', 610000.00, '1770563743_6988a89f2869c.jpg', 3),
(7, 'Av. Ilustración', 104, 5, '1', 28034, 120, 'CENTRO', 450000.00, '1770563939_6988a963f21f0.jpg', 3),
(9, 'Calle Mayor', 1, 0, 'A', 46001, 180, 'PLAYA', 315000.00, '1770565367_6988aef7cd49d.jpg', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `usuario_id` int(11) NOT NULL,
  `nombres` varchar(35) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `clave` varchar(80) NOT NULL,
  `tipo_usuario` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`usuario_id`, `nombres`, `correo`, `clave`, `tipo_usuario`) VALUES
(1, 'GEMA', 'ADMIN@GEMA.COM', '$2y$10$XifmOCwjD.oQqbwfuSwV4.nHdWqHcGwznQtL8dWuPD.W4RDr074Ye', 'administrador'),
(2, 'ENZO', 'ENZO@ENZO.COM', '$2y$10$8XIPGcSUUGjYbkKmi0QtreH5wAEjp9HhxcezpSI.JthDVSMtB7Kcq', 'vendedor'),
(3, 'LEO', 'LEO@LEO.COM', '$2y$10$bShFjL6Ett62z2tQsOIp4O7A49K.o4fjJxj2dcs2dD5EBFLBoSAty', 'vendedor'),
(4, 'CARLOS', 'CARLOS@CARLOS.COM', '$2y$10$/xWttx4Dua8hS6rF6nXyDeVGMBGj.4UI5V554gBmLI40TVk23uCGC', 'comprador');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comprados`
--
ALTER TABLE `comprados`
  ADD KEY `usuario_comprador` (`usuario_comprador`),
  ADD KEY `Codigo_piso` (`Codigo_piso`);

--
-- Indices de la tabla `pisos`
--
ALTER TABLE `pisos`
  ADD PRIMARY KEY (`Codigo_piso`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`usuario_id`),
  ADD UNIQUE KEY `uq_usuario_correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pisos`
--
ALTER TABLE `pisos`
  MODIFY `Codigo_piso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `usuario_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comprados`
--
ALTER TABLE `comprados`
  ADD CONSTRAINT `comprados_ibfk_1` FOREIGN KEY (`usuario_comprador`) REFERENCES `usuario` (`usuario_id`),
  ADD CONSTRAINT `comprados_ibfk_2` FOREIGN KEY (`Codigo_piso`) REFERENCES `pisos` (`Codigo_piso`);

--
-- Filtros para la tabla `pisos`
--
ALTER TABLE `pisos`
  ADD CONSTRAINT `pisos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
