import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from "react-router-dom"

const URIT = 'http://localhost:4000/teacher/'
const URIS = 'http://localhost:4000/students/'
const URIG = 'http://localhost:4000/guardian/'
const URIA = 'http://localhost:4000/admin/'

function Profile() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [date_of_birth, setDate_of_birth] = useState('')
    const [role, setRole] = useState('')
    const [status, setStatus] = useState('')
    const [hire_date, setHire_date] = useState('')
    const [admission, setAdmission] = useState('')
    const [guardian_id, setGuardian_id] = useState('')
    const [class_id, setClass_id] = useState('')
    const [teacher_id, setTeacher_id] = useState('')
    const [file, setfile] = useState(null)
  
    const {id} = useParams()
    

    useEffect( () => {
      getProfileById()
      findAdmin()
      findStudent()
    },[id])

    const findAdmin = async () => {
      const res = await axios.get(URIA+id)
      setName(res.data.name)
      setEmail(res.data.email)
      setPhone(res.data.phone)
      setPassword(res.data.password)
      setDate_of_birth(res.data.date_of_birth)
      setHire_date(res.data.hire_date)
      setRole(res.data.role)
      setStatus(res.data.status)  
      setfile(res.data.file)
    }

    const findTeacher = async () => {
      const res = await axios.get(URIT+id)
      setName(res.data.name)
      setEmail(res.data.email)
      setPhone(res.data.phone)
      setPassword(res.data.password)
      setDate_of_birth(res.data.date_of_birth)
      setRole(res.data.role)
      setStatus(res.data.status)  
      setfile(res.data.file)
      setHire_date(res.data.hire_date)
    }
    const findStudent = async () => {
      const res = await axios.get(URIS+id)
      setName(res.data.name)
      setEmail(res.data.email)
      setGuardian_id(res.data.guardian_id)
      setPassword(res.data.password)
      setDate_of_birth(res.data.date_of_birth)
      setAdmission(res.data.admission)
      setRole(res.data.role)
      setPhone(res.data.phone)
      setStatus(res.data.status)  
    }
    const findGuardian = async () => {
      const res = await axios.get(URIG+id)
      setName(res.data.name)
      setEmail(res.data.email)
      setPhone(res.data.phone)
      setPassword(res.data.password)
      setDate_of_birth(res.data.date_of_birth)
      setRole(res.data.role)
      setStatus(res.data.status)  
    }



    const getProfileById = async (role

    ) => {
        switch (role) {
            case 'admin':
                return findAdmin();
                break;
            case 'teacher':
                return 'Segundo';
                break;
            case 'student':
                return findStudent();
                break;
            case 'guardian':
                return 'Cuarto';
                break;
            default:
                return `role: ${role}`
                break;
        }
      
    }
    
  return (
    <div>
      <div className='flex justify-center'>
      <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md text-white'>
          <h1>Nombre: {name}</h1>
          <p>Correo: <span className='text-red-700'>{email}</span></p>
          <p>Telefono: {phone}</p>
          <p>Fecha de nacimiento: {date_of_birth}</p>
          <p>Puesto: {role}</p>
          <p>Status: {status}</p>
          {/* Mostrar la imagen si existe */}
          {file && (
            <img src={file} className="w-20 h-20 object-cover rounded-full my-2" />
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile