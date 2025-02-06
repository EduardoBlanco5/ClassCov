import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext,  } from '../../components/AuthContext';
import { Card, Divider,  CardHeader, CardBody, CardFooter, Avatar, Button } from '@heroui/react';

const URIT = 'http://localhost:4000/tasks/';
const URIA = 'http://localhost:4000/tasksAdmin/';
const URI_SUBJECT = 'http://localhost:4000/subject/';

function ClassTasks() {
    const [tasks, setTasks] = useState([]);
    const { id } = useParams();
    const { user } = useContext(AuthContext); // Si usas AuthContext

    // Recuperar rol del usuario desde AuthContext o localStorage
    const role = user?.role || localStorage.getItem('role'); // O usa localStorage como respaldo
    const studentId = localStorage.getItem('student_id'); // Recupera el ID del estudiante

    const [teacherTasks, setTeacherTasks] = useState([]);

    const guardianId = localStorage.getItem('guardian_id');

    const [subject_id, setSubject_id] = useState('');
    const [subject_name, setSubject_name] = useState('');
    
    
    useEffect(() => {
        getTasksByClassId(id, studentId);
        

    }, [id, studentId]);

    useEffect(() => {
        if (role === 'teacher') {
            const teacherId = localStorage.getItem('teacher_id'); // Asegúrate de tener el ID del profesor en localStorage
            getTeacherTasks(id, teacherId);
        }
        if (role === 'admin') {
            getTasksByClassIdAdmin(id);
        }
        if (role === 'guardian') {
            getGuardianTasks(id, studentId);
        }
    }, [id, role, studentId]);

    
    
    const getGuardianTasks = async (classId, studentId) => {
        if (!classId || !studentId) {
            console.error("classId o studentId no están definidos:", { classId, studentId });
            return;
        }
    
        try {
            const res = await axios.get(`${URIT}guardianTasks`, {
                params: { class_id: classId, student_id: studentId },
            });
            setTasks(res.data);
        } catch (error) {
            console.error("Error al obtener tareas para el tutor:", error);
        }
    };
    


    const getTasksByClassIdAdmin = async (classId) => {
        if (!classId) {
            console.error("classId no está definido:", { classId });
            return;
        }
    
        try {
            // Realizar la petición al servidor
            const res = await axios.get(`${URIA}class`, {
                params: { class_id: classId },
            });
    
            // Guardar las tareas obtenidas en el estado
            setTasks(res.data);
            console.log(res.data)
        } catch (error) {
            console.error("Error al obtener tareas para admin:", error);
        }
    };


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
            // console.log(res.data)
            // const res2 = await axios.get(URI_SUBJECT + subject_id);
            // setSubject_name(res2.data.name);

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

    // useEffect(() => {
    //     if (tasks.subject_id) {
    //         getSubjectById(tasks.subject_id);
    //     }
        
    // }, [subject_id]);

    const getSubjectById = async (subject_id) => {
        const res = await axios.get(URI_SUBJECT + subject_id);
        setSubject_name(res.data.name);
        return subject_name
    };

    // Dividir tareas en entregadas y no entregadas
    const notDeliveredTasks = tasks.filter((task) => !task.isDelivered);
    const deliveredTasks = tasks.filter((task) => task.isDelivered);

    return (
        <div className=' w-full'>
            <div className=" w-10/12 mx-auto ">
                <Divider/>
                    <h2 className="font-bold text-primary-500 text-3xl text-center mt-4">Tareas:</h2>
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

            {role === 'admin' && (
                // con estilos 
                <div>
                    <Divider className=' mt-5'/>
                    <h3 className="font-bold text-secondary-200 text-2xl text-center mt-4">Tareas de la clase:</h3>
                    
                    <ul className="mt-5 gap-2 grid grid-cols-2 sm:grid-cols-4">
                        {/* faltan los estilos de las cartas de las tareas en admin */}
                        {tasks.length > 0 ? (
                            tasks.map(task => (
                                <Card isPressable key={task.id} shadow='sm' className='max-w-[340px]'>
                                    <CardHeader className="justify-between">
                                        <div className="flex gap-5">
                                            <div className="flex flex-col gap-1 items-start justify-center">
                                                <h4 className="text-small font-semibold leading-none text-default-600">{task.title}</h4>
                                                {/* <h5 className="text-small tracking-tight text-default-400"></h5> */}
                                            </div>
                                        </div>
                                        
                                        <Link to={`/TaskCard/${task.id}`} >
                                            <Button
                                            className= " text-foreground border-default-200 bg-primary-200"
                                            color="default"
                                            radius="full"
                                            size="sm"
                                            variant="flat"
                                            
                                            >
                                                Ir
                                            </Button>
                                                
                                        </Link>
                                    </CardHeader>
                                    
                                </Card>
                            ))
                        ) : (
                            <p className="text-center text-secondary-500">No hay tareas disponibles.</p>
                        )}
                    </ul>
                </div>
            )}
            </div> 
            {role === 'guardian' && (
                <div>
                    <h3 className="font-bold text-white text-xl text-center mt-4">Tareas del Estudiante:</h3>
                    <ul className="mt-5">
                        {tasks.length > 0 ? (
                            tasks.map(task => (
                                <Link to={`/TaskCard/${task.id}`} key={task.id}>
                                    <li className="text-center">{task.title}</li>
                                </Link>
                            ))
                        ) : (
                            <p className="text-center text-white">No hay tareas disponibles.</p>
                        )}
                    </ul>
                </div>
            )}
        </div>

        
    );
}

export default ClassTasks;