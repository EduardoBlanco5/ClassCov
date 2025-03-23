import axios from 'axios';
import { useEffect, useState, useContext, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext,  } from '../../components/AuthContext';
import { Card, Divider,  CardHeader, CardBody, CardFooter, 
    Button, Tabs, Tab, Table, TableBody, TableHeader, TableColumn,TableRow,TableCell 
} from '@heroui/react';


const URIT = 'http://localhost:4000/tasks/';
const URIA = 'http://localhost:4000/tasksAdmin/';
const URI_SUBJECT = 'http://localhost:4000/subject/';
const URISC = 'http://localhost:4000/class/'

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
    const [students, setStudents] = useState([]); // Estado para estudiantes
    
    
    useEffect(() => {
        getTasksByClassId(id, studentId);
        getStudentsByClassId(id);
        // console.log(id)

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

    const getSubjectById = async (subject_id) => {
        const res = await axios.get(URI_SUBJECT + subject_id);
        setSubject_name(res.data.name);
        return subject_name
    };

    const getStudentsByClassId = async (classId) => {
        const res = await axios.get(`${URISC}${classId}/students`);
    setStudents(res.data); // Establece solo los estudiantes de la clase actual
    
    };

    // Dividir tareas en entregadas y no entregadas
    const notDeliveredTasks = tasks.filter((task) => !task.isDelivered);
    const deliveredTasks = tasks.filter((task) => task.isDelivered);

    const [selected, setSelected] = useState("pendientes");

    return (
        <div className=' w-full'>
            <div className=" w-10/12 mx-auto ">
                    <h2 className="font-bold text-primary-900 text-3xl text-center mt-4">Tareas</h2>
                    <Divider/>
                    {role === 'student' && (
                        <div>
                            <div className="mx-auto mt-3 flex w-10/12 max-h-[75vh]  justify-center flex-col overflow-hidden">
                                <Tabs
                                fullWidth
                                aria-label="Tabs works"
                                selectedKey={selected}
                                size="lg"
                                onSelectionChange={setSelected}
                                classNames={{
                                    tabList: "gap-6 w-full relative rounded-2xl ",
                                    cursor: "w-full bg-primary-900",
                                    tab: "w-[70%] px-0 h-12 text-xl font-semibold",
                                    tabContent: "group-data-[selected=true]:text-primary-300 text-primary-300",
                                }}
                                color="primary"
                                variant="light"
                                // light  bordered
                                className='bg-primary-100/90 rounded-2xl'
                                >
                                    <Tab key='pendientes' title='Pendientes'>
                                        {/* Tareas no entregadas */}
                                        <div className='h-full w-full  overflow-scroll'>

                                            <Table
                                            isHeaderSticky
                                            aria-label="tabla alumnos"
                                            selectionMode="single"
                                            color='secondary'
                                            classNames={{
                                                wrapper:"bg-white/70 rounded " ,
                                                th:"bg-auxColors-500/90 text-white",
                                                td: "hover:bg-auxColors-500 hover:duration-250 rounded-lg",
                                                base:" overflow-scroll",
                                                
                                            }}
                                            >
                                                <TableHeader>
                                                    <TableColumn>Pendientes</TableColumn>
                                                </TableHeader>
                                                <TableBody>
                                                    {notDeliveredTasks.map(task => (
                                                        <TableRow key={task.id}>
                                                            <TableCell>
                                                                <Link to={`/TaskCard/${task.id}`} key={task.id}>
                                                                    <div className="text-center ">{task.title}</div>
                                                                </Link>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                    
                                                </TableBody>

                                            </Table>
                                        </div>
                                        {/* <h3 className="font-bold text-white text-xl text-center mt-4">Pendientes:</h3> */}
                                        
                                    </Tab>
                                    <Tab key='entregadas' title='Entregadas' >
                                        {/* Tareas entregadas */}
                                        <Table
                                        aria-label="tabla alumnos"
                                        selectionMode="single"
                                        color='secondary'
                                        classNames={{
                                            wrapper:"bg-white/70 overflow-scroll " ,
                                            th:"bg-primary-500/90 text-primary-700",
                                            td: "hover:bg-primary-600 hover:duration-250 rounded-lg"
                                        }}
                                        >
                                            <TableHeader>
                                                <TableColumn>Entregadas</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                {deliveredTasks.map(task => (
                                                    <TableRow key={task.id}>
                                                        <TableCell>
                                                            <Link to={`/TaskCard/${task.id}`} key={task.id}>
                                                                <div className="text-center  ">{task.title}</div>
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>

                                        </Table>
                                        
                                    </Tab>

                                </Tabs>
                            </div>
                            

                            
                        </div>

                    )}

                    {/* Mostrar el botón solo si el rol es "Profesor" */}
                    {role === 'teacher' && (
            <div className="text-center mt-4">
            <div className="w-full flex justify-start">

                <Link to={`/CreateTask/${id}`}>
                    <Button
                    variant='bordered'
                    className=" border-primary-600 bg-primary-600/70 text-white 
                    hover:bg-primary-600 hover:duration-500 hover:scale-110
                    ">
                        Crear Tarea
                    </Button>
                </Link>
            </div>

                <div className="mt-5">
                    {/* <h3 className="font-bold text-black text-xl text-center mt-4">Tareas Asignadas:</h3> */}
                        <div className='h-[70vh] w-full  overflow-scroll'>

                            <Table
                            isHeaderSticky='true'
                            aria-label="tabla Tareas Asignadas"
                            selectionMode="single"
                            color='secondary'
                            classNames={{
                                wrapper:"bg-white/70 rounded " ,
                                th:"bg-primary-900/90 text-white",
                                td: "hover:bg-primary-900 hover:duration-250 rounded-lg",
                                
                                
                            }}
                            className="overflow-scroll"
                            >
                                <TableHeader>
                                    <TableColumn>Asignadas</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {teacherTasks.map(task => (
                                        <TableRow key={task.id}>
                                            <TableCell>
                                                <Link to={`/GradingTask/${task.id}`} key={task.id}>
                                                    <div className=" flex justify-between gap-5 ">
                                                        <div className=" w-11/12 text-wrap">
                                                            <h2 className='font-semibold capitalize text-lg text-primary-600'>
                                                                {task.title}
                                                            </h2>
                                                            <p className='text-wrap'>{task.description}</p>
                                                        </div>
                                                        <div>
                                                            {task.upTasks && task.upTasks.length > 0 ? (
                                                                <ul>

                                                                    <li className="mt-2">
                                                                        
                                                                        <p className="text-green-500 font-bold">
                                                                            <span className='text-default-500'>Entregas: </span> 
                                                                            <span className='text-primary-100'>
                                                                                {task.upTasks.length} 
                                                                            </span>
                                                                                
                                                                        </p>
                                                                        
                                                                    </li>
                                                                </ul>
                                
                                                        ) : (
                                                            <p>No hay entregas aún.</p>
                                                        )}
                                                        </div>

                                                    </div>
                                                </Link>
                                                <Divider className=' mt-1 bg-auxColors-500/50'/>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    
                                </TableBody>

                            </Table>
                        </div>
                            
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
                            <div className="mx-auto mt-3 flex w-10/12 max-h-[75vh]  justify-center flex-col overflow-hidden">
                                <Tabs
                                fullWidth
                                aria-label="Tabs works"
                                selectedKey={selected}
                                size="lg"
                                onSelectionChange={setSelected}
                                classNames={{
                                    tabList: "gap-6 w-full relative rounded-2xl ",
                                    cursor: "w-full bg-primary-900",
                                    tab: "w-[70%] px-0 h-12 text-xl font-semibold",
                                    tabContent: "group-data-[selected=true]:text-primary-300 text-primary-300",
                                }}
                                color="primary"
                                variant="light"
                                // light  bordered
                                className='bg-primary-100/90 rounded-2xl'
                                >
                                    <Tab key='pendientes' title='Pendientes'>
                                        {/* Tareas no entregadas */}
                                        <div className='h-full w-full  overflow-scroll'>

                                            <Table
                                            isHeaderSticky
                                            aria-label="tabla alumnos"
                                            selectionMode="single"
                                            color='secondary'
                                            classNames={{
                                                wrapper:"bg-white/70 rounded " ,
                                                th:"bg-auxColors-500/90 text-white",
                                                td: "hover:bg-auxColors-500 hover:duration-250 rounded-lg",
                                                base:" overflow-scroll",
                                                
                                            }}
                                            >
                                                <TableHeader>
                                                    <TableColumn>Pendientes</TableColumn>
                                                </TableHeader>
                                                <TableBody>
                                                    {notDeliveredTasks.map(task => (
                                                        <TableRow key={task.id}>
                                                            <TableCell>
                                                                <Link to={`/TaskCard/${task.id}`} key={task.id}>
                                                                    <div className="text-center ">{task.title}</div>
                                                                </Link>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                    
                                                </TableBody>

                                            </Table>
                                        </div>
                                        {/* <h3 className="font-bold text-white text-xl text-center mt-4">Pendientes:</h3> */}
                                        
                                    </Tab>
                                    <Tab key='entregadas' title='Entregadas' >
                                        {/* Tareas entregadas */}
                                        <Table
                                        aria-label="tabla alumnos"
                                        selectionMode="single"
                                        color='secondary'
                                        classNames={{
                                            wrapper:"bg-white/70 overflow-scroll " ,
                                            th:"bg-primary-500/90 text-primary-700",
                                            td: "hover:bg-primary-600 hover:duration-250 rounded-lg"
                                        }}
                                        >
                                            <TableHeader>
                                                <TableColumn>Entregadas</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                {deliveredTasks.map(task => (
                                                    <TableRow key={task.id}>
                                                        <TableCell>
                                                            <Link to={`/TaskCard/${task.id}`} key={task.id}>
                                                                <div className="text-center  ">{task.title}</div>
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>

                                        </Table>
                                        
                                    </Tab>

                                </Tabs>
                            </div>
                            

                            
                        </div>
                // <div>
                //     <h3 className="font-bold text-white text-xl text-center mt-4">Tareas del Estudiante:</h3>
                //     <ul className="mt-5">
                //         {tasks.length > 0 ? (
                //             tasks.map(task => (
                //                 <Link to={`/TaskCard/${task.id}`} key={task.id}>
                //                     <li className="text-center">{task.title}</li>
                //                 </Link>
                //             ))
                //         ) : (
                //             <p className="text-center text-white">No hay tareas disponibles.</p>
                //         )}
                //     </ul>
                // </div>
            )}
        </div>

        
    );
}

export default ClassTasks;