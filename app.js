const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para servir la carpeta public como contenido estático
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para aceptar datos JSON y datos codificados en URL enviados desde el navegador
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arreglo de servicios (mínimo 3 servicios con id, nombre y descripcion)
const servicios = [
  {
    id: 1,
    nombre: "Consulta Veterinaria General",
    descripcion: "Revisión médica completa, diagnóstico y seguimiento para la salud de tu mascota."
  },
  {
    id: 2,
    nombre: "Vacunación y Desparasitación",
    descripcion: "Esquema completo de vacunas y desparasitación interna y externa."
  },
  {
    id: 3,
    nombre: "Cirugía y Esterilización",
    descripcion: "Procedimientos quirúrgicos seguros con monitoreo y cuidados postoperatorios."
  },
  {
    id: 4,
    nombre: "Urgencias y Hospitalización",
    descripcion: "Atención médica inmediata y monitoreo continuo en situaciones de emergencia."
  }
];

// Ruta GET /api/servicios: devuelve el arreglo JSON de servicios
app.get('/api/servicios', (req, res) => {
  res.json(servicios);
});

// Ruta POST /api/solicitudes: recibe datos del formulario y valida campos obligatorios
app.post('/api/solicitudes', (req, res) => {
  const { nombre, correo, servicio, comentario } = req.body;

  // Validación: nombre y servicio no deben estar vacíos
  if (!nombre || !servicio || !nombre.toString().trim() || !servicio.toString().trim()) {
    return res.status(400).json({
      error: "Datos obligatorios faltantes. 'nombre' y 'servicio' son requeridos."
    });
  }

  // Respuesta con estado 201 y confirmación
  return res.status(201).json({
    mensaje: "Solicitud registrada con éxito.",
    solicitud: {
      nombre: nombre.toString().trim(),
      correo: correo ? correo.toString().trim() : "",
      servicio: servicio.toString().trim(),
      comentario: comentario ? comentario.toString().trim() : "",
      fechaRegistro: new Date().toISOString()
    }
  });
});

// Manejador 404 para rutas que no existan
app.use((req, res) => {
  res.status(404).json({
    error: "404",
    mensaje: "Ruta no encontrada"
  });
});

// Iniciar servidor en el puerto 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
