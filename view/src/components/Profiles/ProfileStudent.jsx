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
    

    const [nameG, setNameG] = useState('') //Nombre del padre
  
    const {id} = useParams()
    

  
    useEffect( () => {
      getStudentById()
    },[])

    useEffect(() => {
      if (guardian_id) {
          getGuardianById(guardian_id);
      }
  }, [guardian_id]);
  
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
          {/* Mostrar la imagen si existe */}
          {file && (
                <img src={file} className="w-20 h-20 object-cover rounded-full my-2" />
              )}
            <h1>Nombre: {name}</h1>
            <p>Correo: <span className='text-red-700'>{email}</span></p>
            <p>Telefono: {phone}</p>
            <p>Fecha de nacimiento: {date_of_birth}</p>
            <p>Fecha de Admisión: {admission}</p>
            <p>Puesto: {role}</p>
            <p>Status: {status}</p>
            <h1>Tutor: {nameG}</h1>
        </div>
      </div>
  )
}

export default ProfileStudent