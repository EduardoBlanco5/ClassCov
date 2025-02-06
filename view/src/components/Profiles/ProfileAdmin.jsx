import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from "react-router-dom"

const URI = 'http://localhost:4000/admin/'

function ProfileAdmin() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [date_of_birth, setDate_of_birth] = useState('')
    const [role, setRole] = useState('')
    const [status, setStatus] = useState('')
    const [file, setfile] = useState(null)
  
    const {id} = useParams()
    // Obtener el rol del usuario desde el objeto `user` o localStorage
   const roleA = localStorage.getItem('role'); 
    
  
    useEffect( () => {
      getAdminById()
    },[])
  
    const getAdminById = async () => {
      const res = await axios.get(URI+id)
      setName(res.data.name)
      setEmail(res.data.email)
      setPhone(res.data.phone)
      setPassword(res.data.password)
      setDate_of_birth(res.data.date_of_birth)
      setRole(res.data.role)
      setStatus(res.data.status)  
      setfile(res.data.file)

      console.log(res.data.file)
      
    }

  return (
    <div className='flex justify-center'>
        <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md text-white'>
          {/* Mostrar el botón de "Editar Clase" solo si el usuario tiene el rol 'admin' */}
        {roleA === 'admin' && (
                <div>
                    <Link to={`/UpdatedAdmin/${id}`} className="absolute top-30 right-4 bg-blue-500 text-white px-4 py-2 rounded-md">
                        Editar Admin
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
      </div>
  )
}

export default ProfileAdmin