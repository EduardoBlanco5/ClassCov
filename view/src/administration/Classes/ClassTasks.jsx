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

    const [teacherTasks, setTeacherTasks] = useState([]);
    

    useEffect(() => {
        getTasksByClassId(id, studentId);

    }, [id, studentId]);

    useEffect(() => {
        if (role === 'teacher') {
            const teacherId = localStorage.getItem('teacher_id'); // Asegúrate de tener el ID del profesor en localStorage
            getTeacherTasks(id, teacherId);
        }
    }, [id, role]);

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

    const getTeacherTasks = async (classId, teacherId) => {
        if (!classId || !teacherId) {
            console.error("classId o teacherId no están definidos:", { classId, teacherId });
            return;
        }
    
        try {
            const res = await axios.get(`${URIT}submissions`, {
                params: { class_id: classId, teacher_id: teacherId },
            });
            setTeacherTasks(res.data);
        } catch (error) {
            console.error("Error al obtener tareas del profesor:", error);
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

            <div className="mt-5">
                <h3 className="font-bold text-white text-xl text-center mt-4">Tareas Asignadas:</h3>
                        {teacherTasks.map((task) => (
                            <div key={task.id} className="bg-gray-200 p-4 rounded-md shadow-md mb-4">
                                <Link to={`/GradingTask/${task.id}`}>
                                <h4 className="font-bold">{task.title}</h4>
                                </Link>
                                <p>{task.description}</p>
                                <h5 className="font-semibold mt-2">Entregas:</h5>
                 
                                {task.upTasks && task.upTasks.length > 0 ? (
                                    <ul>
                                        {task.upTasks.map((submission) => (
                                            <li key={submission.id} className="mt-2">
                                                <span className="font-semibold">{submission.student.name}:</span>{' '}
                                                
                                            
                                                <p className="text-green-500 font-bold">
                                                    Entregado
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                            ) : (
                                <p>No hay entregas aún.</p>
                            )}
                        </div>
                    ))}
        </div>
    </div>
)}
            </div>
        </div>
    );
}

export default ClassTasks;