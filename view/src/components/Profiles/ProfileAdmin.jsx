import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardHeader, CardBody, CardFooter, Avatar } from '@heroui/react'


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
        <div className='bg-primary-900/70 max-w-md w-full p-10 rounded-md text-white mt-8'>
          {/* Mostrar el botón de "Editar Clase" solo si el usuario tiene el rol 'admin' */}
        {roleA === 'admin' && (
                <div>
                    <Link to={`/UpdatedAdmin/${id}`} >
                    <Button className='absolute top-[140px] right-4 px-7 bg-[#f5a525] text-white hover:text-black'
                            variant='flat'
                            color='warning'
                            >
                              Editar Administrador
                            </Button>
                    </Link>
                </div>
            )}
                      <Card className=' w-md p-5 bg-primary-300'>
            <CardHeader className=' justify-between'>
            <div className=' flex gap-5'>
                {file && (
                  <Avatar
                    isBordered
                    radius="full"
                    size="lg"
                    src={file}
                  />
                )}
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-primary-900">{name}</h4>
                    <h5 className="text-small tracking-tight text-default-400 hover:text-red-500 hover:duration-700">{email}</h5>
                  </div>

                </div>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400">
            <p className='text-primary-900'>Telefono:<span className='text-default-900 ml-5'>{phone}</span> </p>
              <p className='pt-2'>Fecha de nacimiento: <span className='ml-5 text-default-900'>{date_of_birth}</span> </p>

            </CardBody>
            <CardFooter className="gap-3">
            <div className="flex gap-1">
                
                <p className="font-semibold text-primary-900 text-small ">Status: </p>
                <p className=" text-default-900 text-small ml-1">{status}</p>
              </div>
              <div className="flex gap-1">
                <p className="font-semibold text-primary-900 text-small">Puesto: </p>
                <p className="text-default-900 text-small ml-1">{role}</p>
              </div>
            </CardFooter>
          </Card>

          {/* Mostrar la imagen si existe
          {file && (
                <img src={file} className="w-20 h-20 object-cover rounded-full my-2" />
              )}
            <h1>Nombre: {name}</h1>
            <p>Correo: <span className='text-red-700'>{email}</span></p>
            <p>Telefono: {phone}</p>
            <p>Fecha de nacimiento: {date_of_birth}</p>
            <p>Puesto: {role}</p>
            <p>Status: {status}</p> */}
            
        </div>
      </div>
  )
}

export default ProfileAdmin