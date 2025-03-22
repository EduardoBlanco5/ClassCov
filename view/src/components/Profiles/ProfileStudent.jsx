import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardHeader, CardBody, CardFooter, Avatar } from '@heroui/react'

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
        <div className='bg-primary-900/70 max-w-md w-full p-10 rounded-md text-white mt-8'>
        
          {/* Mostrar el botón de "Editar Clase" solo si el usuario tiene el rol 'admin' */}
        {roleA === 'admin' && (
                <div>
                    <Link to={`/UpdatedStudent/${id}`} className=" ">
                      <Button className='absolute top-[140px] right-4 px-7 bg-[#f5a525] text-white hover:text-black'
                      variant='flat'
                      color='warning'
                      >
                        Editar Alumno
                      </Button>
                    </Link>
                </div>
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
              <p className='text-primary-900'>Telefono:<span className='text-default-900 ml-5'>{phone}</span> </p>
              <p className='pt-2'>Fecha de nacimiento: <span className='ml-5 text-default-900'>{date_of_birth}</span> </p>
              <p className='pt-2'>Fecha de Admisión: <span className=' ml-5 text-default-900'>{admission}</span></p>
              
            </CardBody>
            <CardFooter className="gap-3">
              <div className="flex gap-1">
                
                <p className="font-semibold text-primary-900 text-small ">Status: </p>
                <p className=" text-default-900 text-small ml-1">{status}</p>
              </div>
              <div className="flex gap-1">
                <p className="font-semibold text-primary-900 text-small">Tutor: </p>
                <p className="text-default-900 text-small ml-1">{nameG}</p>
              </div>
            </CardFooter>
            
              
              
              
              {roleA === 'guardian' && (
                <div>
                  {studentClass.length > 0 ? (
                  studentClass.map((classItem) => (
                    <div className=' max-w-[280px] mx-auto my-2'>
                      <Card key={classItem.id}>
                        <CardHeader className=' bg-primary-50'>
                          <span className=' text-primary-700 font-semibold'>Curso</span>
                        </CardHeader>
                        <CardBody>
                          <div className=' items-center flex justify-around gap-2'>
                            <h2 className=' font-medium text-xl text-primary-700'>{ classItem.grade} {classItem.salon}</h2>
                            <Link to={`/ClassCard/${classItem.id}`}>
                              <Button>
                                Ir a Clase
                              </Button>
                            </Link>
                          </div>
                        </CardBody>
                        <CardFooter className=' bg-primary-300'>
                        Turno: {classItem.shift}
                        </CardFooter>
                        
                      </Card>
                      {/* <p key={classItem.id}>
                        <Link to={`/ClassCard/${classItem.id}`} >
                        <span className='bg-green-600'>Clase:</span> { classItem.grade} {classItem.salon} <br>
                          </br> Turno: {classItem.shift}
                        </Link>
                      </p> */}
                    </div>
                  )) 
              ) : (
                  <p>No está inscrito en ninguna clase</p>
              )}
                </div>
              )}
          </Card>
            <Link to={`/Dashboard/${id}`} className=" ">
              <Button
              className='absolute top-48 right-4  text-white px-7 bg-[#2b6fee] hover:text-black'
              variant='flat'
              color='primary'
              >
                  Dashboard
              </Button>
            </Link>
        </div>
      </div>
  )
}

export default ProfileStudent