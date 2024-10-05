import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const URI = 'http://localhost:4000/teachers'

function ShowTeachers() {

    const [teachers, setTeachers] = useState([]);
    useEffect(() => {
        getTeachers()
    },[])


    //Mostrar Profes
    const getTeachers = async () => {
        const res = await axios.get(URI)
        if (Array.isArray(res.data)) {
            setTeachers(res.data);
        } else {
            setTeachers([]);
        }
   
    }

    if (teachers.length === 0) {
        return(

            <Link to={'/CreateTeacher'}>
                <h1>No hay Profesor</h1>
                <button className='bg-blue-600 text-black font-bold rounded-md hover:bg-blue-800 px-3'>Crear Profesor</button>
        
            </Link>
        )
      }

  return (
    <>

        <Link to={'/CreateTeacher'}>
            <button className='bg-blue-600 text-black font-bold rounded-md hover:bg-blue-800 px-3'>Crea Profesor</button>
        </Link>
        <div className=" max-w-md rounded-md my-2 px-4 py-2 flex justify-center mx-[40%]">

            <div className=" max-w-md w-full p-10 rounded-md my-2 px-4 py-2 ">
            {teachers.map ((teacher) => (


                    <tr  key={teacher.id} >

                        <Link to={`/ProfileTeacher/${teacher.id}`}>  
                        <header className="flex w-full bg-slate-500 hover:bg-slate-700 rounded-md my-2">
                            <h1 className="text-2xl font-bold w-full my-2 px-4 py-2">{teacher.name}</h1>
                            <div className="w-full px-4 py-2 my-2">
                            <h1>{teacher.email}</h1>   
                            <h1>{teacher.phone}</h1>   
                            <h1>{teacher.date_of_birth}</h1>   
                            <h1>{teacher.role}</h1>   
                            <h1>{teacher.status}</h1>   
                                <Link to={`/UpdatedTeacher/${teacher.id}`}>
                                <button className="bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded-md ">
                                    Actualizar
                                </button>
                                </Link>
                                
                            </div>
                        </header>
                    </Link>
                
                    </tr>
                ))}

            </div>
        </div>

    </>
  )
}

export default ShowTeachers