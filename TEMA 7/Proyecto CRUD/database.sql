CREATE DATABASE IF NOT EXISTS curso_ajax;
USE curso_ajax;

DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    edad INT,
    idioma VARCHAR(20)
);
