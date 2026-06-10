// netlify/functions/mensajes.js

function respuesta(statusCode, data) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod === "GET") {
      const mensajesDemo = [
        {
          id: 1,
          nombre: "Ana",
          email: "ana@correo.com",
          mensaje: "Hola, este es un mensaje de ejemplo.",
          fecha: new Date().toISOString()
        }
      ];

      return respuesta(200, {
        ok: true,
        data: mensajesDemo
      });
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      const { nombre, email, mensaje } = body;

      if (!nombre || !email || !mensaje) {
        return respuesta(400, {
          ok: false,
          error: "Nombre, email y mensaje son obligatorios."
        });
      }

      if (!validarEmail(email)) {
        return respuesta(400, {
          ok: false,
          error: "El email no tiene un formato válido."
        });
      }

      if (mensaje.length < 10) {
        return respuesta(400, {
          ok: false,
          error: "El mensaje debe tener al menos 10 caracteres."
        });
      }

      const nuevoMensaje = {
        id: Date.now(),
        nombre,
        email,
        mensaje,
        fecha: new Date().toISOString()
      };

      return respuesta(201, {
        ok: true,
        message: "Mensaje recibido correctamente.",
        data: nuevoMensaje
      });
    }

    return respuesta(405, {
      ok: false,
      error: "Método no permitido. Usa GET o POST."
    });
  } catch (error) {
    console.error(error);
    return respuesta(500, {
      ok: false,
      error: "Error interno en la función."
    });
  }
};