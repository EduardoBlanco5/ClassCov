import React, { useState } from 'react';
import axios from 'axios';

const AiHelper = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:4000/ai/process', { prompt });
            setResponse(res.data.text);
        } catch (error) {
            console.error('Error al procesar la solicitud:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Escribe tu pregunta o problema"
                />
                <button type="submit">Enviar</button>
            </form>
            <p>Respuesta de la IA: {response}</p>
        </div>
    );
};

export default AiHelper;