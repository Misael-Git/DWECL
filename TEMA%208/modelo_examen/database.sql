CREATE DATABASE IF NOT EXISTS tienda_ropa;
USE tienda_ropa;

CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo CHAR(9) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    talla ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL') NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    email_creador VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos de ejemplo
INSERT INTO productos (codigo, nombre, talla, precio, email_creador) VALUES
('ABC123456', 'Camiseta Algodón', 'M', 19.99, 'admin@tienda.com'),
('XYZ987654', 'Pantalón Vaquero', 'L', 39.95, 'user@tienda.com'),
('DEF456789', 'Sudadera con Capucha', 'S', 29.90, 'gestor@tienda.com');
