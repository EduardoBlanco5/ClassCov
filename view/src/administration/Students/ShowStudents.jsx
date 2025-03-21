import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Card, CardBody, CardHeader,CardFooter,Avatar, Button } from '@heroui/react'

const URI = 'http://localhost:4000/students'

function ShowStudents() {

    const [students, setStudents] = useState([]);
    useEffect(() => {
        getStudents()
    },[])


    //Mostrar Tareas
    const getStudents = async () => {
        const res = await axios.get(URI)
        if (Array.isArray(res.data)) {
            setStudents(res.data);
        } else {
            setStudents([]);
        }
   
    }

    if (students.length === 0) {
        return(

            <Link to={'/CreateStudent'}>
                <h1>No hay Alumnos</h1>
                <button className='bg-blue-600 text-black font-bold rounded-md hover:bg-blue-800 px-3'>Crear Alumno</button>
        
            </Link>
        )
      }

  return (
    <>

        <Link to={'/CreateStudent'}>
            <Button 
            variant='shadow'
            className='mt-1 ml-2 bg-primary-500 text-primary-700
            hover:bg-primary-600 hover:text-primary-300 hover:duration-500
            '>Crear Alumno</Button>
        </Link>

        <div className=" w-[90%]  mx-auto h-[80vh] overflow-scroll mt-4 ">
            <div className="  w-full grid grid-cols-1 grid-flow-row md:grid-cols-3 md:grid-flow-row gap-4 items-center ">
            {students.map ((student) => (
                
                    <tr  key={student.id} className='w-full bg-primary-900/70 rounded-md flex justify-center' >
                        <div className='w-[100%] p-2'>

                            <Link to={`/Profilestudent/${student.id}`}>  
                                <Card className='w-md p-5 bg-primary-300 shadow-none'>
                                    
                                    <CardHeader className='flex gap-5'>
                                    <div className=' flex gap-5'>
                                        {student.file  && (
                                        <Avatar
                                            isBordered
                                            radius="full"
                                            size="lg"
                                            src={student.file }
                                        />
                                        )}
                                            <div className="flex flex-col gap-1 items-start justify-center">
                                            <h4 className="text-small font-semibold leading-none text-primary-900">{student.name}</h4>
                                            <h5 className="text-small tracking-tight text-default-400 hover:text-red-500 hover:duration-700">{student.email}</h5>
                                        </div>

                                        </div>
                                    </CardHeader>
                                    <CardBody className="px-3 py-0 text-small text-default-400">
                                        <p className='text-primary-900'>Telefono:<span className='text-default-900 ml-5'>{student.phone}</span> </p>
                                        <p className='pt-2'>Fecha de nacimiento: <span className='ml-5 text-default-900'>{student.date_of_birth}</span> </p>
                                        <p className='pt-2'>Rol: <span className=' ml-5 text-default-900'>{student.role}</span></p>
                                        
                                        </CardBody>
                                        <CardFooter className="gap-3">
                                            <div className='flex justify-between w-full'>

                                                <div className="flex gap-1 ">
                                                    
                                                    <p className="font-semibold text-primary-900 text-small ">Status: </p>
                                                    <p className=" text-default-900 text-small ml-1">{student.status}</p>
                                                </div>
                                                <div className="flex gap-1 ">
                                                    <Link to={`/Updatedstudent/${student.id}`}>
                                                        <Button variant='bordered' 
                                                        className=" border-auxColors-350 text-auxColors-350 
                                                        hover:duration-500 hover:bg-auxColors-350/70 hover:text-white ">
                                                            Actualizar
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </CardFooter>
                                        
                                </Card>

                                
                                
                            </Link>
                        </div>
                
                    </tr>
                ))}

            </div>
        </div>

    </>
  )
}

export default ShowStudents