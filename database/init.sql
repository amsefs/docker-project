CREATE TABLE IF NOT EXISTS persona (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  ciudad VARCHAR(100),
  foto VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS formacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150),
  institucion VARCHAR(150),
  anio VARCHAR(50),
  persona_id INT,
  FOREIGN KEY (persona_id) REFERENCES persona(id) ON DELETE CASCADE
);

INSERT INTO persona (nombre, apellido, ciudad, foto) VALUES 
('Marco', 'Calvo', 'Bolivia', 'https://randomuser.me/api/portraits/men/20.jpg');

INSERT INTO formacion (titulo, institucion, anio, persona_id) VALUES 
('Ingenieria de Software', 'Universidad Privada Boliviana', '2015-2020', (SELECT id FROM (SELECT id FROM persona LIMIT 1) AS sub)),
('Master en Desarrollo Web', 'Universidad San Simon', '2021-2022', (SELECT id FROM (SELECT id FROM persona LIMIT 1) AS sub));
