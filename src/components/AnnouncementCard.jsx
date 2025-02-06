import axios from 'axios'
import { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from './AuthContext' // Asegúrate de importar el contexto correcto.


const URI = 'http://localhost:4000/announcement/'
const URIP = 'http://localhost:4000/teacher/'

function AnnouncementCard() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [teacher_id, setTeacher_id] = useState('')
    const [class_id, setClass_id] = useState('')
    const [date, setDate] = useState('')
    const [file, setfile] = useState(null)
  
    const [name, setName] = useState('')

    const {id} = useParams()

    // Recuperar rol del usuario desde AuthContext o localStorage
    const { user } = useContext(AuthContext); // Si usas AuthContext
    const role = user?.role || localStorage.getItem('role'); // O usa localStorage como respaldo

    
  
    useEffect( () => {
      getAnnouncementById()
    },[])

    useEffect(() => {
      if (teacher_id) {
          getTeacherById(teacher_id);
      }
  }, [teacher_id]);
  
    const getAnnouncementById = async () => {
      const res = await axios.get(URI+id)
      setTitle(res.data.title)
      setContent(res.data.content)
      setTeacher_id(res.data.teacher_id)
      setClass_id(res.data.class_id)
      setDate(res.data.date)
      setfile(res.data.file)
  
      
    }

    const getTeacherById = async (teacherId) => {
      const res = await axios.get(URIP + teacherId);
      setName(res.data.name);
    };

  
    return (
      <div className='flex justify-center'>
        <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md text-white'>
            {/* Mostrar la imagen si existe */}
            {console.log(file)}
          {file && (
                <img src={file} className="w-20 h-20 object-cover rounded-full my-2" />
              )}
            <h1 className="font-bold text-white text-3xl text-center">titulo: {title}</h1>
            <p className="font-bold text-white text-3xl text-center">Contenido: <span className='text-red-700'>{content}</span></p>
            <p className="font-bold text-white text-3xl text-center">Fecha: {date}</p>
            <h1 className="font-bold text-white text-3xl text-center">Profesor: {name}</h1>

        </div>
        {role === "teacher" && (
          <Link to={`/UpdatedAnnouncement/${id}`}>
            <button className="bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded-md">
              Actualizar
            </button>
          </Link>
        )}
      </div>

    )
}

export default AnnouncementCard