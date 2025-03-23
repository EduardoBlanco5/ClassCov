import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardHeader, CardBody, CardFooter, Avatar } from '@heroui/react'

const URI = 'http://localhost:4000/teacher/'

function ProfileTeacher() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    const [password, setPassword] = useState('')
    const [date_of_birth, setDate_of_birth] = useState('')
    const [hire_date, setHire_date] = useState('')
    const [role, setRole] = useState('')
    const [phone, setPhone] = useState('')
    const [status, setStatus] = useState('')
    const [file, setfile] = useState(null)
  
    const {id} = useParams()
    // Obtener el rol del usuario desde el objeto `user` o localStorage
   const roleA = localStorage.getItem('role'); 
    
  
    useEffect( () => {
      getTeacherById()
    },[])
  
    const getTeacherById = async () => {
      const res = await axios.get(URI+id)
      setName(res.data.name)
      setEmail(res.data.email)
  
      setPassword(res.data.password)
      setDate_of_birth(res.data.date_of_birth)
      setHire_date(res.data.hire_date)
      setRole(res.data.role)
      setPhone(res.data.phone)
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
                          <Link to={`/UpdatedTeacher/${id}`} className=" ">
                            <Button className='absolute top-[140px] right-4 px-7 bg-[#f5a525] text-white hover:text-black'
                            variant='flat'
                            color='warning'
                            >
                              Editar Profesor
                            </Button>
                          </Link>
                      </div>
                // <div>
                //     <Link to={`/UpdatedTeacher/${id}`} className="absolute top-30 right-4 bg-blue-500 text-white px-4 py-2 rounded-md">
                //         Editar Profesor
                //     </Link>
                // </div>
            )}
          {/* Mostrar la imagen si existe */}
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
            <p className='text-primary-900'>Codigo:<span className='text-default-900 ml-5'>{id}</span> </p>
            <p className='text-primary-900'>Telefono:<span className='text-default-900 ml-5'>{phone}</span> </p>
              <p className='pt-2'>Fecha de nacimiento: <span className='ml-5 text-default-900'>{date_of_birth}</span> </p>
              <p className='pt-2'>Fecha de Contrato: <span className=' ml-5 text-default-900'>{hire_date}</span></p>
              

            </CardBody>
            <CardFooter className="gap-3">
            <div className="flex gap-1">
                
                <p className="font-semibold text-primary-900 text-small ">Status: </p>
                <p className=" text-default-900 text-small ml-1">{status}</p>
              </div>
              <div className="flex gap-1">
                <p className="font-semibold text-primary-900 text-small">Rol: </p>
                <p className="text-default-900 text-small ml-1">{role}</p>
              </div>
            </CardFooter>
          </Card>
          
        </div>
      </div>
  )
}

export default ProfileTeacher