-- 1. Crear la base de datos
CREATE DATABASE IF NOT EXISTS inmobiliaria;
USE inmobiliaria;

-- 2. Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuario (
  usuario_id INT NOT NULL AUTO_INCREMENT,
  nombres VARCHAR(35) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  clave VARCHAR(80) NOT NULL,
  tipo_usuario VARCHAR(20),
  PRIMARY KEY (usuario_id),
  CONSTRAINT uq_usuario_correo UNIQUE (correo)
);

-- 3. Crear tabla de pisos
CREATE TABLE IF NOT EXISTS pisos (
  Codigo_piso INT NOT NULL AUTO_INCREMENT,
  calle VARCHAR(40) NOT NULL,
  numero INT NOT NULL,
  piso INT NOT NULL,
  puerta VARCHAR(5) NOT NULL,
  cp INT NOT NULL,
  metros INT NOT NULL,
  zona VARCHAR(15),
  precio DECIMAL(10,2) NOT NULL,
  imagen VARCHAR(100) NOT NULL,
  usuario_id INT,
  PRIMARY KEY (Codigo_piso),
  FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
);

-- 4. Crear tabla de comprados
CREATE TABLE IF NOT EXISTS comprados (
  usuario_comprador INT,
  Codigo_piso INT,
  Precio_final FLOAT NOT NULL,
  FOREIGN KEY (usuario_comprador) REFERENCES usuario(usuario_id),
  FOREIGN KEY (Codigo_piso) REFERENCES pisos(Codigo_piso)
);
