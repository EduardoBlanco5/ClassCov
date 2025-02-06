import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

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
            <button className='bg-blue-600 text-black font-bold rounded-md hover:bg-blue-800 px-3'>Crear Alumno</button>
        </Link>

        <div className=" max-w-md rounded-md my-2 px-4 py-2 flex justify-center mx-[40%]">
            <div className=" max-w-md w-full p-10 rounded-md my-2 px-4 py-2 ">
            {students.map ((student) => (


                    <tr  key={student.id} >

                        <Link to={`/Profilestudent/${student.id}`}>  
                        <header className="flex w-full bg-slate-500 hover:bg-slate-700 rounded-md my-2">
                            <h1 className="text-2xl font-bold w-full my-2 px-4 py-2">{student.name}</h1>
                            <div className="w-full px-4 py-2 my-2">
                            <h1>{student.email}</h1>   
                            <h1>{student.phone}</h1>   
                            <h1>{student.date_of_birth}</h1>   
                            <h1>{student.role}</h1>   
                            <h1>{student.status}</h1>   

                            {/* Mostrar la imagen si existe */}
                            {console.log(student.file)}
                                {student.file && (
                                    <img src={student.file} className="w-20 h-20 object-cover rounded-full my-2" />
                                )}

                                <Link to={`/Updatedstudent/${student.id}`}>
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

export default ShowStudents