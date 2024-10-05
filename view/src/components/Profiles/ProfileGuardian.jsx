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

    const [students, setStudents] = useState([]); // Estado para estudiantes
  
    const {id} = useParams()
    
  
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
      
    }

    
    const getStudentsByGuardianId = async (guardianId) => {
      const res = await axios.get(`${URIS}guardian?guardian_id=${guardianId}`);
      setStudents(res.data); // Establecer solo los estudiantes del tutor actual
  };

  return (
    <div className=' justify-center'>
        <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md text-white'>
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
                        <li key={student.id} className="text-center">{student.name}</li> 

                    ))}
                </ul>

        </div>
    </div>
  )
}

export default ProfileGuardian