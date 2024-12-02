import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext,  } from '../../components/AuthContext';

const URIT = 'http://localhost:4000/tasks/';

function ClassTasks() {
    const [tasks, setTasks] = useState([]);
    const { id } = useParams();
    const { user } = useContext(AuthContext); // Si usas AuthContext

    // Recuperar rol del usuario desde AuthContext o localStorage
    const role = user?.role || localStorage.getItem('role'); // O usa localStorage como respaldo
    const studentId = localStorage.getItem('student_id'); // Recupera el ID del estudiante
    

    useEffect(() => {
        getTasksByClassId(id, studentId);
    }, [id, studentId]);

    const getTasksByClassId = async (classId, studentId) => {
        if (!classId || !studentId) {
            console.error("classId o studentId no están definidos:", { classId, studentId });
            return;
        }
    
        try {
            const res = await axios.get(`${URIT}class`, {
                params: { class_id: classId, student_id: studentId },
            });
            setTasks(res.data);
        } catch (error) {
            console.error("Error al obtener tareas:", error);
        }
    };

    // Dividir tareas en entregadas y no entregadas
    const notDeliveredTasks = tasks.filter((task) => !task.isDelivered);
    const deliveredTasks = tasks.filter((task) => task.isDelivered);

    return (
        <div>
            <div className="bg-indigo-500">
                <h2 className="font-bold text-white text-2xl text-center mt-4">Tareas:</h2>
                {role === 'student' && (
                    <div>
                        {/* Tareas no entregadas */}
                        <h3 className="font-bold text-white text-xl text-center mt-4">Pendientes:</h3>
                        <ul className="mt-5">
                            {notDeliveredTasks.map((task) => (
                                <Link to={`/TaskCard/${task.id}`} key={task.id}>
                                    <li className="text-center">{task.title}</li>
                                </Link>
                            ))}
                        </ul>

                        {/* Tareas entregadas */}
                        <h3 className="font-bold text-white text-xl text-center mt-4">Entregadas:</h3>
                        <ul className="mt-5">
                            {deliveredTasks.map((task) => (
                                <Link to={`/TaskCard/${task.id}`} key={task.id}>
                                    <li className="text-center">{task.title}</li>
                                </Link>
                            ))}
                        </ul>
                    </div>

                )}

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
        </div>
    );
}

export default ClassTasks;