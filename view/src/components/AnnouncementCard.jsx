import axios from 'axios'
import { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from './AuthContext' // Asegúrate de importar el contexto correcto.
import {Card, CardBody, CardFooter, Image, Button , Divider, CardHeader,
} from "@heroui/react";
import { Car } from 'lucide-react'


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
      var opciones = { year: 'numeric', month: 'short', day: 'numeric' };
      var fecha = new Date(res.data.date)
        .toLocaleDateString('es',opciones)
        .replace(/ /g,'-')
        .replace('.','')
        .replace(/-([a-z])/, function (x) {return '-' + x[1].toUpperCase()});
      // console.log(fecha);
      setDate(fecha)
      setfile(res.data.file)
  
      
    }

    const getTeacherById = async (teacherId) => {
      const res = await axios.get(URIP + teacherId);
      setName(res.data.name);
    };

  
    return (
      <div className=' min-w-[50%] w-10/12 mx-auto  flex justify-center mt-5'>
        <Card className='w-full bg-transparent  max-w-[65%]'>

          <div className='w-full p-10 rounded-md'>
              {/* Mostrar la imagen si existe */}
              
              {/* {console.log(file)} */}
              <CardHeader className='bg-primary-100 '>
                <div className='w-full flex flex-col justify-between items-center'>
                  {file && (
                    <img src={file} className="w-20 h-20 object-cover rounded-full my-2" />
                  )}
                  <h1 className="w-[80%] font-bold text-primary-700 text-3xl text-center text-wrap mr-3"> {title}</h1>
                </div>
              </CardHeader>
              <Divider></Divider>
              <CardBody className='bg-white/60 min-h-[200px] mt-2'>
                <div className='w-full flex flex-col justify-center items-center'>
                  <p className="font-bold text-primary-700 text-3xl text-center mb-3">Contenido:</p>
                  <p className='text-wrap text-primary-700 mb-3'>{content}</p>
                </div>
              </CardBody>
              <Divider className='bg-primary-900'></Divider>
              <CardFooter className='bg-primary-900/50 '>
                <div className='w-full flex flex-col items-center'>
                  <p className="font-bold text-auxColors-300 text-4xl text-center mb-3">{date}</p>
                  <h3 className="font-bold text-black text-3xl text-center">Profesor: </h3>
                  <p>{name}</p>
                </div>
              </CardFooter>

          </div>
          {role === "teacher" && (
            <Link to={`/UpdatedAnnouncement/${id}`}>
              <Button 
              variant='bordered'
              color='warning'
              >
                Actualizar
              </Button>
            </Link>
          )}
        </Card>
      </div>

    )
}

export default AnnouncementCard