import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from "react-router-dom"
import {Card, CardBody, CardFooter, Image, Button ,ButtonGroup, Divider
    ,Table, TableHeader, TableColumn, TableBody, TableRow, TableCell
} from "@heroui/react";
import ButtonT1 from './ButtonT1'

const URI = 'http://localhost:4000/class/'
const URIP = 'http://localhost:4000/teacher/'
const URIS = 'http://localhost:4000/students/'
const URIT = 'http://localhost:4000/tasks/'
const URIA = 'http://localhost:4000/announcements/'
const URISC = 'http://localhost:4000/class/'



function ClassCard() {
    
    const [grade, setGrade] = useState('')
    const [salon, setSalon] = useState('')
    const [shift, setShift] = useState('')
    const [teacher_id, setTeacher_id] = useState('')
    const studentId = localStorage.getItem('student_id'); // Recupera el ID del estudiante
    
    

    const [students, setStudents] = useState([]); // Estado para estudiantes
    const [tasks, setTasks] = useState([])
    const [announcements, setAnnouncemets] = useState([])
    

    const [name, setName] = useState('')
    const {id} = useParams()

   // Obtener el rol del usuario desde el objeto `user` o localStorage
   const role = localStorage.getItem('role'); 
    
    
    useEffect( () => {
        getClassById()
        getStudentsByClassId(id);
        getTasksByClassId(id);
        getAnnouncementsByClassId(id);
        
    },[id])
    
    useEffect(() => {
        if (teacher_id) {
            getTeacherById(teacher_id);
        }
    }, [teacher_id]);
    
    const getClassById = async () => {
        const res = await axios.get(URI+id)
        setGrade(res.data.grade)
        setSalon(res.data.salon)
        setShift(res.data.shift)
        setTeacher_id(res.data.teacher_id)

        // console.log(id)

    }
    
    
    const getTeacherById = async (teacherId) => {
        const res = await axios.get(URIP + teacherId);
        setName(res.data.name);
    };


    const getStudentsByClassId = async (classId) => {
        const res = await axios.get(`${URISC}${classId}/students`);
    setStudents(res.data); // Establece solo los estudiantes de la clase actual
    // console.log(res.data)
    };

    const getTasksByClassId = async (classId) => {
        if (!classId || !studentId) {
            console.error('classId o studentId están vacíos', { classId, studentId });
            return;
        }
    
        try {
            const res = await axios.get(`${URIT}class`, { 
                params: { class_id: classId, student_id: studentId } 
            });
            setTasks(res.data);
        } catch (error) {
            if (error.response) {
                console.error('Error del servidor:', error.response.data);
            } else if (error.request) {
                console.error('Error en la solicitud:', error.request);
            } else {
                console.error('Error:', error.message);
            }
        }
    };

    const getAnnouncementsByClassId = async (classId) => {
        const res = await axios.get(`${URIA}class?class_id=${classId}`);
        setAnnouncemets(res.data); // Establecer solo los estudiantes de la clase actual
    };


    const ConvertirGrado = (grade) => {
        switch (grade) {
            case 1:
                return 'Primero';
                break;
            case 2:
                return 'Segundo';
                break;
            case 3:
                return 'Tercero';
                break;
            case 4:
                return 'Cuarto';
                break;
            case 5:
                return 'Quinto';
                break;
            case 6:
                return 'Sexto';
                break;

            default:
                return `Grado: ${grade}`
                break;
        }
    }
  return (
    <div className='justify-center'>




        {/* Mostrar el botón de "Editar Clase" solo si el usuario tiene el rol 'admin' */}
        <Card  className=' w-11/12 bg-gradient-to-tl  from-secondary-50 via-secondary-100  to-primary-200/90
        mx-auto mt-3 h-[150px] md:h-[300px] '>
            {role === 'admin' && (
                    <div>
                        <Link to={`/UpdateClass/${id}`} className="absolute  bottom-8 right-4   text-white   rounded-md">
                            <Button color='warning' variant='ghost' className=' w-full  hover:scale-110 hover:text-white '>
                                Editar Clase
                            </Button>
                        </Link>
                    </div>
                )}

            <div className=' w-10/12 h-full p-10 rounded-md text-secondary-500 grid grid-cols-6 gap-4  '>
                <h1 className="font-bold  text-3xl  col-start-1 col-span-4 ">Grado: {ConvertirGrado(grade)}</h1>
                <h1 className="font-bold  text-3xl text-center col-start-1 col-end-3">Grupo: {salon}</h1>
                <h1 className="font-bold  text-3xl text-center col-end-7 col-span-2 ">Turno: {shift}</h1>
                <h1 className="font-bold  text-3xl  col-start-1 col-end-7 ">Profesor: {name}</h1>

                        
                {/* <div class="grid grid-cols-6 bg-slate-400 gap-4">
                    <div class="col-start-2 col-span-4 bg-slate-600 ...">01</div>
                    <div class="col-start-1 col-end-3 bg-gray-900 ...">02</div>
                    <div class="col-end-7 col-span-2 bg-zinc-50 ...">03</div>
                    <div class="col-start-1 col-end-7 bg-red-900 ...">04</div>
                </div> */}

            </div>
        </Card>

    
        <ButtonGroup  className=' w-10/12 mx-auto mt-3  h-12 flex justify-around mb-12 '>
            
            <Link to={`/ClassTasks/${id}`}> 
                <Button variant='bordered'   className=' border-primary-900 
                px-8
                text-primary-900 font-semibold hover:duration-500 text-xl
                hover:bg-primary-900 hover:shadow-none hover:text-white'>Tareas</Button>
            </Link>

            <Link to={`/ClassAnnouncements/${id}`}> 
                <Button variant='bordered'   
                className='border-secondary-200
                    px-8
                    text-secondary-200 font-semibold hover:duration-500 text-xl
                    hover:bg-secondary-900 hover:shadow-none hover:text-white'>Anuncios</Button>
            {/* <Button className='bg-slate-700 rounded-md mx-2 px-1 text-white'></Button> */}
            </Link>

            {/* Mostrar el botón "Alumnos" si no es estudiante */}
            {role !== 'student' && (
                    <Link to={`/ClassStudents/${id}`}> 
                        <Button variant='bordered'   
                        className='border-auxColors-500
                            px-8
                            text-auxColors-500 font-semibold hover:duration-500 text-xl
                            hover:bg-auxColors-500 hover:shadow-none hover:text-white'>Alumnos</Button>
                        {/* <Button className='bg-yellow-500 rounded-md mx-2 px-1 text-white'></Button> */}
                    </Link>
                )}

                {/* Mostrar el botón "Asistencias" si no es estudiante */}
                {role == 'teacher' && (
                    <Link to={`/CreateAttendances/${id}`}> 
                        <Button 
                        variant='bordered'
                        className='border-primary-700
                        px-8
                        text-primary-700 font-semibold hover:duration-500 text-xl
                        hover:bg-primary-700 hover:shadow-none hover:text-white'
                        >Asistencias</Button>
                    </Link>
                )}
                {/* Mostrar el botón "Asistencias" si no es estudiante */}
                {role == 'guardian' && (
                    <Link to={`/ShowAttendances/${id}`}> 
                        <Button 
                        variant='bordered'
                        className='border-primary-700
                        px-8
                        text-primary-700 font-semibold hover:duration-500 text-xl
                        hover:bg-primary-700 hover:shadow-none hover:text-white'
                        >Ver Asistencias</Button>
                    </Link>
                )}
        </ButtonGroup>

        <div className="flex w-full    space-x-4 ">

                <Divider orientation='vertical'/>
            <div className='w-1/2' >
                    <Divider />

                <h2 className="font-bold text-primary-900   text-2xl text-center  jus mt-4">Tareas:</h2>
                <Table 
                aria-label='Tabla de tareas'
                hideHeader
                // removeWrapper
                className='w-[60%] mx-auto text-center my-5 '
                classNames={{
                    wrapper : "bg-secondary-100",
                    td: "pr-4 text-primary-900 text-xl ",
                    tr: "w-[70%] mx-auto  flex justify-center",
                }}

                >
                    <TableHeader>
                        <TableColumn>
                        Tareas:
                        </TableColumn>
                        {/* <h2 className="font-bold text-primary-500 text-2xl text-center mt-4">Alumnos:</h2> */}
                    </TableHeader>
                    <TableBody className=' bg-slate-800 '>
                        {tasks.map(task => (
                            <TableRow key={task.id} className='  p-4'>
                                <TableCell className=' '>
                                    {task.title}
                                    <Divider></Divider>
                                </TableCell>
                                
                            </TableRow>
                            
                        ))}
                    </TableBody>
                </Table>

            </div>

            <div className='w-[50%]' >
            <Divider/>
                <h2 className="font-bold text-auxColors-500 text-2xl text-center  jus mt-4">Alumnos:</h2>
                <Table 
                aria-label='Tabla de alumnos'
                hideHeader
                // removeWrapper
                className='w-[60%] mx-auto text-center my-5 '
                classNames={{
                    wrapper : "bg-secondary-100",
                    td: "pr-4 text-auxColors-500  text-xl ",
                    tr: "w-[70%] mx-auto  flex justify-center",
                }}

                >
                    <TableHeader>
                        <TableColumn>
                        Alumnos:
                        </TableColumn>
                        {/* <h2 className="font-bold text-primary-500 text-2xl text-center mt-4">Alumnos:</h2> */}
                    </TableHeader>
                    <TableBody className=' bg-slate-800 '>
                        {students.map(student => (
                            <TableRow key={student.id} className='  p-4'>
                                <TableCell className=' '>
                                    {student.name}
                                    <Divider></Divider>
                                </TableCell>
                                
                            </TableRow>
                            
                        ))}
                    </TableBody>
                </Table>

            </div>

        </div>
        {/* <div className=''>
            <Divider/>
            <h2 className="font-bold text-secondary-200 text-2xl text-center mt-4">Tareas:</h2>
            
            <ul className="mt-5 ">
                {tasks.map(task => (
                    <li key={task.id} className="text-center">{task.title}</li> 

                ))}
            </ul>

        </div> */}

<div className='w-full'>
            <Divider/>
            <h2 className="font-bold text-secondary-200  text-2xl text-center  jus mt-4">Anuncios:</h2>
            <Table 
            aria-label='Tabla de tareas'
            hideHeader
            // removeWrapper
            className='w-[60%] mx-auto text-center my-5 '
            classNames={{
                wrapper : "bg-secondary-100",
                td: "pr-4 text-secondary-200 text-xl ",
                tr: "w-[70%] mx-auto  flex justify-center",
            }}

            >
                <TableHeader>
                    <TableColumn>
                    Anuncios:
                    </TableColumn>
                    {/* <h2 className="font-bold text-primary-500 text-2xl text-center mt-4">Alumnos:</h2> */}
                </TableHeader>
                <TableBody className=' bg-slate-800 '>
                    {announcements.map(announcement => (
                        <TableRow key={announcement.id} className='  p-4'>
                            <TableCell className=' '>
                                {announcement.title}
                                <Divider></Divider>
                            </TableCell>
                            
                        </TableRow>
                        
                    ))}
                </TableBody>
            </Table>

        </div>
        {/* <div className=''>
        <Divider/>
            <h2 className="font-bold text-auxColors-500 text-2xl text-center mt-4">Anuncios:</h2>
            <ul className="mt-5 ">
                {announcements.map(announcement => (
                    <li key={announcement.id} className="text-center">{announcement.title}</li> 

                ))}
            </ul>

        </div> */}
      </div>
  )
}

export default ClassCard