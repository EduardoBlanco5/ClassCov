import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from "react-router-dom"

const URI = 'http://localhost:4000/class/'

function ClassStudents() {

    const [students, setStudents] = useState([])
    
    const {id} = useParams()

    useEffect( () => {
        
        getStudentsByClassId(id);
        
        
        
    },[id])

    const getStudentsByClassId = async (classId) => {
        const res = await axios.get(`${URI}${classId}/students`);
    setStudents(res.data); // Establece solo los estudiantes de la clase actual
    };

  return (
    <div>
        <div className='bg-indigo-500'>
            <h2 className="font-bold text-white text-2xl text-center mt-4">Alumnos:</h2>
            <ul className="mt-5 ">
                {students.map(student => (
        <Link to={`/ProfileStudent/${student.id}`}> 
                    <li key={student.id} className="text-center">{student.name}</li> 


        </Link>

        

                ))}
            </ul>

            <Link to={`/CreateAttendances/${id}`} className='bg-green-600 rounded-md'>
                Asistencias
            </Link>
        </div>
    </div>
  )
}

export default ClassStudents