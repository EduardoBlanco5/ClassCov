import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from "react-router-dom"

const URI = 'http://localhost:4000/guardian/'
const URIS = 'http://localhost:4000/students/'


function ProfileGuardian() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [date_of_birth, setDate_of_birth] = useState('')
    const [role, setRole] = useState('')
    const [status, setStatus] = useState('')
    const [file, setfile] = useState(null)

    const [students, setStudents] = useState([]); // Estado para estudiantes
  
    const {id} = useParams()
    // Obtener el rol del usuario desde el objeto `user` o localStorage
   const roleA = localStorage.getItem('role'); 
    
  
    useEffect( () => {
      getGuardianById()
      getStudentsByGuardianId(id);
    },[id])
  
    const getGuardianById = async () => {
      const res = await axios.get(URI+id)
      setName(res.data.name)
      setEmail(res.data.email)
      setPhone(res.data.phone)
      setPassword(res.data.password)
      setDate_of_birth(res.data.date_of_birth)
      setRole(res.data.role)
      setStatus(res.data.status)
      setfile(res.data.file)  
      
    }

    
    const getStudentsByGuardianId = async (guardianId) => {
      const res = await axios.get(`${URIS}guardian?guardian_id=${guardianId}`);
      setStudents(res.data); // Establecer solo los estudiantes del tutor actual
  };

  return (
    <div className=' justify-center'>
        <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md text-white'>
          {/* Mostrar el botón de "Editar Clase" solo si el usuario tiene el rol 'admin' */}
        {roleA === 'admin' && (
                <div>
                    <Link to={`/UpdatedGuardian/${id}`} className="absolute top-30 right-4 bg-blue-500 text-white px-4 py-2 rounded-md">
                        Editar Tutor
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
            <p>Puesto: {role}</p>
            <p>Status: {status}</p>
        </div>

        <div className='bg-emerald-500'>
            <h2 className="font-bold text-white text-2xl text-center mt-4">Estudiantes:</h2>
                <ul className="mt-2">
                    {students.map(student => (

                    <Link to={`/ProfileStudent/${student.id}`}> 
                      <li key={student.id} className="text-center">{student.name}</li> 
                    </Link>

                    ))}
                </ul>

        </div>
    </div>
  )
}

export default ProfileGuardian