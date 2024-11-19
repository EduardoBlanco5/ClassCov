import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../components/AuthContext'; // Asegúrate de importar el contexto correcto.

const URIT = 'http://localhost:4000/tasks/';

function ClassTasks() {
    const [tasks, setTasks] = useState([]);
    const { id } = useParams();

    // Recuperar rol del usuario desde AuthContext o localStorage
    const { user } = useContext(AuthContext); // Si usas AuthContext
    const role = user?.role || localStorage.getItem('role'); // O usa localStorage como respaldo

    useEffect(() => {
        getTasksByClassId(id);
    }, [id]);

    const getTasksByClassId = async (classId) => {
        const res = await axios.get(`${URIT}class?class_id=${classId}`);
        setTasks(res.data); // Establecer las tareas de la clase actual
    };

    return (
        <div>
            <div className="bg-indigo-500">
                <h2 className="font-bold text-white text-2xl text-center mt-4">Tareas:</h2>
                <ul className="mt-5">
                    {tasks.map((task) => (
                        <Link to={`/TaskCard/${task.id}`} key={task.id}>
                            <li className="text-center">{task.title}</li>
                        </Link>
                    ))}
                </ul>
            </div>

            {/* Mostrar el botón solo si el rol es "Profesor" */}
            {role === 'teacher' && (
                <div className="text-center mt-4">
                    <Link to={`/CreateTask/${id}`}>
                        <button className="bg-green-700 rounded-md px-4 py-2 text-white">
                            Crear Tarea
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default ClassTasks;