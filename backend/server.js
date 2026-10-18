const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// Configuración de la conexión a la base de datos MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || "database",
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "cv_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get("/cv", async (req, res) => {
  try {
    const [personaRows] = await pool.query(
      "SELECT * FROM persona ORDER BY id ASC LIMIT 1",
    );
    const [formacionRows] = await pool.query(
      "SELECT * FROM formacion ORDER BY id ASC",
    );

    if (personaRows.length === 0) {
      return res.status(404).json({ error: "CV no encontrado" });
    }

    const cv = {
      datos_personales: personaRows[0],
      formacion_academica: formacionRows,
    };

    res.json(cv);
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post("/formacion", async (req, res) => {
  try {
    const { titulo, institucion, anio } = req.body;
    const [personaRows] = await pool.query(
      "SELECT id FROM persona ORDER BY id ASC LIMIT 1",
    );
    if (personaRows.length === 0) {
      return res.status(404).json({ error: "CV no encontrado" });
    }
    const persona_id = personaRows[0].id;

    await pool.query(
      "INSERT INTO formacion (titulo, institucion, anio, persona_id) VALUES (?, ?, ?, ?)",
      [titulo, institucion, anio, persona_id],
    );
    res.status(201).json({ message: "Formación agregada exitosamente" });
  } catch (error) {
    console.error("Error al insertar formación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.put("/persona", async (req, res) => {
  try {
    const { nombre, apellido, ciudad, foto } = req.body;
    await pool.query(
      `UPDATE persona 
       SET nombre = ?, apellido = ?, ciudad = ?, foto = ? 
       WHERE id = (SELECT id FROM (SELECT id FROM persona ORDER BY id ASC LIMIT 1) AS sub)`,
      [nombre, apellido, ciudad, foto],
    );
    res.json({ message: "Datos personales actualizados" });
  } catch (error) {
    console.error("Error al actualizar persona:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.listen(port, () => {
  console.log(`Backend escuchando en el puerto ${port}`);
});
