import dotenv from 'dotenv';
dotenv.config(); // Cargar las variables de entorno del archivo .env

import OpenAI from 'openai'; // Asegúrate de tener esta importación
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Usar la variable de entorno
});

export const processRequest = async (req, res) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // O el modelo que prefieras
            messages: [{ role: 'user', content: req.body.prompt }],
        });
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error procesando la solicitud de IA' });
    }
};