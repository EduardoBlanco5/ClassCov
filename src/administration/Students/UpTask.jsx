import axios from 'axios';
import { useState } from 'react';

const URI = 'http://localhost:4000/uploadTask';

const UpTasks = () => {
    const [taskId, setTaskId] = useState('');
    const [studentId, setStudentId] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const create = async (e) => {
        e.preventDefault();

        // Validar que el archivo, task_id y student_id existen
        if (!file || !taskId || !studentId) {
            setMessage('Por favor, llena todos los campos y selecciona un archivo.');
            return;
        }

        // Crear un objeto FormData para enviar el archivo
        const formData = new FormData();
        formData.append('file', file);
        formData.append('task_id', taskId);
        formData.append('student_id', studentId);

        try {
            const res = await axios.post(URI, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage('Archivo subido exitosamente');
        } catch (err) {
            console.error(err);
            setMessage('Error al subir el archivo');
        }
    };

    return (
        <div>
            <h1>Subir Archivo</h1>
            <form onSubmit={create}>
                <div>
                    <label htmlFor="task_id">ID de la tarea:</label>
                    <input
                        type="number"
                        id="task_id"
                        value={taskId}
                        onChange={(e) => setTaskId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="student_id">ID del estudiante:</label>
                    <input
                        type="number"
                        id="student_id"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="file">Selecciona un archivo:</label>
                    <input
                        type="file"
                        id="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                    />
                </div>
                <button type="submit">Subir archivo</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UpTasks;