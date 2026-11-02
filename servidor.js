require("dotenv").config();
const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const mysql = require("mysql2/promise");
const RegistroPedido = require("./clases/RegistroPedido");

const app = express();
const PUERTO = Number(process.env.PUERTO) || 3000;
const RUTA_CSV = path.join(__dirname, "Datos.csv");




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); //  sirve el frontend

//   PooL de conexiones - para gestión de concurrencia..
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "coquito_amarillo",
  waitForConnections: true,
  connectionLimit: 10
});


//   Lleva info a excel 

async function guardarEnCSV(registro) {
  try {
    await fs.writeFile(RUTA_CSV, "\uFEFF" + RegistroPedido.ENCABEZADO_CSV, { flag: "wx" });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
  await fs.appendFile(RUTA_CSV, registro.toCSV(), "utf8");
}

app.post("/registrar", async (req, res) => {
  const { nombreCliente, producto, cantidad, correo } = req.body;
  const registro = new RegistroPedido(nombreCliente, producto, cantidad, correo);

  // datos invalidos, no se guarda nada
  const errores = registro.validar();
  if (errores.length > 0) {
    return res.status(400).json({ error: errores.join(". ") });
  }

  //  MySQL y excel se guardan juntos o no  se guarda ninguno
  
  let conexion;
  try {
    conexion = await pool.getConnection();
    await conexion.beginTransaction();

    const sql = "INSERT INTO registros (nombre_cliente, producto, cantidad, correo, fecha_registro) VALUES (?, ?, ?, ?, ?)";
    const [resultado] = await conexion.execute(sql, [
      registro.nombreCliente, registro.producto, registro.cantidad, registro.correo, registro.fechaFormateada()
    ]);
    registro.asignarId(resultado.insertId);

    await guardarEnCSV(registro);
    await conexion.commit();

    console.log(`Pedido #${registro.id} guardado en MySQL y CSV: ${registro.nombreCliente} - ${registro.producto} x${registro.cantidad}`);
    res.status(201).json({ mensaje: "Registro guardado exitosamente" });
  } catch (error) {
    // si algo fallo se deshace el INSERT
    if (conexion) await conexion.rollback().catch(() => {});
    console.error("Error al guardar el pedido:", error.message);
    res.status(500).json({ error: "Error al guardar el registro" });
  } finally {
    if (conexion) conexion.release();
  }
});

//   Verifica la base de datos antes de recibir pedidos
async function iniciar() {
  try {
    await pool.query("SELECT 1");
    app.listen(PUERTO, () => console.log(`Servidor escuchando en http://localhost:${PUERTO}/formulario.html`));
  } catch (error) {
    console.error("No fue posible conectar con MySQL:", error.message);
    process.exit(1);
  }
}

iniciar();
