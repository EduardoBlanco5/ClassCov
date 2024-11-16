import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from "react-router-dom"

const URIT = 'http://localhost:4000/tasks/'

function ClassTasks() {

    const [tasks, setTasks] = useState([])
    
    const {id} = useParams()

    useEffect( () => {
        
        getTasksByClassId(id);
        
        
    },[id])

    const getTasksByClassId = async (classId) => {
        const res = await axios.get(`${URIT}class?class_id=${classId}`);
        setTasks(res.data); // Establecer solo los estudiantes de la clase actual
    };


  return (
    <div>
        <div className='bg-indigo-500'>
            <h2 className="font-bold text-white text-2xl text-center mt-4">Tareas:</h2>
            <ul className="mt-5 ">
                {tasks.map(task => (
        <Link to={`/TaskCard/${task.id}`}> 
                    <li key={task.id} className="text-center">{task.title}</li> 


        </Link>
                ))}
            </ul>

        </div>

        {/* Botón para crear tarea */}
        <div className="text-center mt-4">
                <Link to={`/CreateTask/${id}`}>
                    <button className="bg-green-700 rounded-md px-4 py-2 text-white">
                        Crear Tarea
                    </button>
                </Link>
            </div>
    </div>
  )
}

export default ClassTasks