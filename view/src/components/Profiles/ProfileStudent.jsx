import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from "react-router-dom"

const URI = 'http://localhost:4000/student/'
const URIG = 'http://localhost:4000/Guardian/'

function ProfileStudent() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [guardian_id, setGuardian_id] = useState('') 
    const [password, setPassword] = useState('')
    const [date_of_birth, setDate_of_birth] = useState('')
    const [admission, setAdmission] = useState('')
    const [role, setRole] = useState('')
    const [phone, setPhone] = useState('')
    const [status, setStatus] = useState('')
    const [file, setfile] = useState(null)

    const [studentClass, setStudentClass] = useState([]);
    

    const [nameG, setNameG] = useState('') //Nombre del padre
  
    const {id} = useParams()

     // Obtener el rol del usuario desde el objeto `user` o localStorage
   const roleA = localStorage.getItem('role'); 
    

  
    useEffect( () => {
      getStudentById();
      getStudentClass();
    },[])

    useEffect(() => {
      if (guardian_id) {
          getGuardianById(guardian_id);
      }
  }, [guardian_id]);

  const getStudentClass = async () => {
    try {
        const res = await axios.get(`http://localhost:4000/student/${id}/classes`);
        setStudentClass(res.data);
    } catch (error) {
        console.error('Error al obtener la clase del estudiante:', error);
    }
};
  
    const getStudentById = async () => {
      const res = await axios.get(URI+id)
      setName(res.data.name)
      setEmail(res.data.email)
      setGuardian_id(res.data.guardian_id)
      setPassword(res.data.password)
      setDate_of_birth(res.data.date_of_birth)
      setAdmission(res.data.admission)
      setRole(res.data.role)
      setPhone(res.data.phone)
      setStatus(res.data.status)
      setfile(res.data.file)    
      
    }

    const getGuardianById = async (guardianId) => {
      const res = await axios.get(URIG + guardianId);
      setNameG(res.data.name);
  };


  return (
    <div className='flex justify-center'>
        <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md text-white'>
        
          {/* Mostrar el botón de "Editar Clase" solo si el usuario tiene el rol 'admin' */}
        {roleA === 'admin' && (
                <div>
                    <Link to={`/UpdatedStudent/${id}`} className="absolute top-30 right-4 bg-blue-500 text-white px-4 py-2 rounded-md">
                        Editar Alumno
                    </Link>
                </div>
            )}

            
          {/* Mostrar la imagen si existe */}
          {file && (
                <img src={file} className="w-20 h-20 object-cover rounded-full my-2" />
              )}
            <h1>Nombre: {name}</h1>
            <p>Correo: <span className='text-red-700'>{email}</span></p>
            <p>Telefono: {phone}</p>
            <p>Fecha de nacimiento: {date_of_birth}</p>
            <p>Fecha de Admisión: {admission}</p>
            <p>Status: {status}</p>
            <h1>Tutor: {nameG}</h1>
            {roleA === 'guardian' && (
              <div>
                {studentClass.length > 0 ? (
                studentClass.map((classItem) => (
                    <p key={classItem.id}>
                      <Link to={`/ClassCard/${classItem.id}`} >
                      <span className='bg-green-600'>Clase:</span> { classItem.grade} {classItem.salon} <br>
                        </br> Turno: {classItem.shift}
                      </Link>
                    </p>
                )) 
            ) : (
                <p>No está inscrito en ninguna clase</p>
            )}
              </div>
            )}
            <Link to={`/Dashboard/${id}`} className="absolute top-48 right-4 bg-sky-500 text-white px-4 py-2 rounded-md">
                        Dashboard
            </Link>
        </div>
      </div>
  )
}

export default ProfileStudent