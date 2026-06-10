// netlify/functions/config.js

exports.handler = async function() {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      appName: process.env.APP_NAME || "Sin nombre",
      docente: process.env.DOCENTE || "Sin docente"
    })
  };
};