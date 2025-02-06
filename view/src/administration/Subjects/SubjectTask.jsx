import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const URIT = 'http://localhost:4000/tasks/'; // URL base del backend

function SubjectTask() {
    const { id } = useParams(); // Recuperar el subject_id de la URL
    const [tasks, setTasks] = useState([]); // Estado para almacenar las tareas
    const [loading, setLoading] = useState(true); // Estado para manejar la carga
    const [error, setError] = useState(null); // Estado para manejar errores

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await axios.get(`${URIT}subject`, { 
                params: { subject_id: id },
            });
            setTasks(res.data); // Asigna las tareas obtenidas
        } catch (err) {
            console.error('Error al obtener las tareas:', err);
            setError('Hubo un problema al cargar las tareas. Inténtalo más tarde.');
        } finally {
            setLoading(false); // Finaliza la carga
        }
    };

    return (
        <div className="p-5">
            <h1 className="font-bold text-2xl text-center mb-4">Tareas para Materia {id}</h1>
            
            {loading ? (
                <p className="text-center text-gray-500">Cargando tareas...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <ul className="bg-gray-100 p-5 rounded-md shadow-md">
                    {tasks.length > 0 ? (
                        tasks.map(task => (
                            <li key={task.id} className="mb-4 p-4 border-b border-gray-300">
                                <h2 className="font-semibold text-lg">{task.title}</h2>
                                <p>{task.description}</p>
                                <p className="text-sm text-gray-600">Fecha de entrega: {task.deliveryDate}</p>
                                {task.file && (
                                    <a
                                        href={task.file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline mt-2 block"
                                    >
                                        Ver archivo adjunto
                                    </a>
                                )}
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No hay tareas disponibles.</p>
                    )}
                </ul>
            )}
        </div>
    );
}

export default SubjectTask;