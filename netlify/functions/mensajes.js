const { createClient } = require('@supabase/supabase-js');

// Estas variables de entorno las debes configurar en tu panel de Netlify
const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_ANON_KEY; 
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
    // Manejar la petición POST (Insertar nuevo mensaje)
    if (event.httpMethod === 'POST') {
        try {
            const data = JSON.parse(event.body);

            // Insertamos en Supabase. OJO: Mapeamos data.email a la columna 'correo'
            const { data: insertedData, error } = await supabase
                .from('mensajes')
                .insert([
                    { 
                        nombre: data.nombre, 
                        correo: data.email, 
                        mensaje: data.mensaje 
                    }
                ])
                .select(); // El .select() es para que devuelva el registro creado (con el ID y created_at)

            if (error) throw error;

            return {
                statusCode: 200,
                body: JSON.stringify({ 
                    message: "Mensaje guardado exitosamente en Supabase", 
                    data: insertedData[0] 
                })
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: error.message })
            };
        }
    }

    // Manejar la petición GET (Cargar mensajes desde la base de datos)
    if (event.httpMethod === 'GET') {
        try {
            const { data, error } = await supabase
                .from('mensajes')
                .select('*')
                .order('created_at', { ascending: true }); // Trae los más antiguos primero para que prepend los acomode
                
            if (error) throw error;

            return {
                statusCode: 200,
                body: JSON.stringify({ data: data })
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: error.message })
            };
        }
    }

    // Si no es GET ni POST
    return {
        statusCode: 405,
        body: JSON.stringify({ error: "Método no permitido" })
    };
};