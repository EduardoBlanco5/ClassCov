import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from "react-router-dom"

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

      console.log(id)

    }
    
    
    const getTeacherById = async (teacherId) => {
        const res = await axios.get(URIP + teacherId);
        setName(res.data.name);
    };


    const getStudentsByClassId = async (classId) => {
        const res = await axios.get(`${URISC}${classId}/students`);
    setStudents(res.data); // Establece solo los estudiantes de la clase actual
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
        {role === 'admin' && (
                <div>
                    <Link to={`/UpdateClass/${id}`} className="absolute top-30 right-4 bg-blue-500 text-white px-4 py-2 rounded-md">
                        Editar Clase
                    </Link>
                </div>
            )}

        <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md text-white mx-[38%]'>
            <h1 className="font-bold text-white text-3xl text-center">{ConvertirGrado(grade)}</h1>
            <h1 className="font-bold text-white text-3xl text-center">Grupo: {salon}</h1>
            <h1 className="font-bold text-white text-3xl text-center">Turno: {shift}</h1>
            <h1 className="font-bold text-white text-3xl text-center">Profesor: {name}</h1>

                    
            

        </div>

      
        <Link to={`/ClassTasks/${id}`}> 
        <button className='bg-blue-700 rounded-md mx-2 px-1 text-white'>Tareas</button>
        </Link>

        <Link to={`/ClassAnnouncements/${id}`}> 
        <button className='bg-slate-700 rounded-md mx-2 px-1 text-white'>Anuncios</button>
        </Link>

        {/* Mostrar el botón "Alumnos" si no es estudiante */}
        {role !== 'student' && (
                <Link to={`/ClassStudents/${id}`}> 
                    <button className='bg-yellow-500 rounded-md mx-2 px-1 text-white'>Alumnos</button>
                </Link>
            )}

            {/* Mostrar el botón "Asistencias" si no es estudiante */}
            {role == 'teacher' && (
                <Link to={`/CreateAttendances/${id}`}> 
                    <button className='bg-green-500 rounded-md mx-2 px-1 text-white'>Asistencias</button>
                </Link>
            )}
            {/* Mostrar el botón "Asistencias" si no es estudiante */}
            {role == 'guardian' && (
                <Link to={`/ShowAttendances/${id}`}> 
                    <button className='bg-green-500 rounded-md mx-2 px-1 text-white'>Ver Asistencias</button>
                </Link>
            )}

        <div className='bg-emerald-500'>
            <h2 className="font-bold text-white text-2xl text-center mt-4">Alumnos:</h2>
                <ul className="mt-2">
                    {students.map(student => (
                        <li key={student.id} className="text-center">{student.name}</li> 
                        
                    ))}
                </ul>

        </div>
    

        <div className='bg-indigo-500'>
            <h2 className="font-bold text-white text-2xl text-center mt-4">Tareas:</h2>
            <ul className="mt-5 ">
                {tasks.map(task => (
                    <li key={task.id} className="text-center">{task.title}</li> 

                ))}
            </ul>

        </div>

        <div className='bg-slate-500'>
            <h2 className="font-bold text-white text-2xl text-center mt-4">Anuncios:</h2>
            <ul className="mt-5 ">
                {announcements.map(announcement => (
                    <li key={announcement.id} className="text-center">{announcement.title}</li> 

                ))}
            </ul>

        </div>
      </div>
  )
}

export default ClassCard