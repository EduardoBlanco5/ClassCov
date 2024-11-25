import axios from 'axios'
import { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from './AuthContext'

const URI = 'http://localhost:4000/task/'

function TaskCard()  {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [notes, setNotes] = useState('')
    const [qualification, setQualification] = useState('')
    const [deliveryDate, setDeliveryDate] = useState('')
  
    const {id} = useParams()
    // Recuperar rol del usuario desde AuthContext o localStorage
    const { user } = useContext(AuthContext); // Si usas AuthContext
    const role = user?.role || localStorage.getItem('role'); // O usa localStorage como respaldo
    
  
    useEffect( () => {
      getTaskById()
    },[])
  
    const getTaskById = async () => {
      const res = await axios.get(URI+id)
      setTitle(res.data.title)
      setDescription(res.data.description)
      setNotes(res.data.notes)
      setQualification(res.data.qualification)
      setDeliveryDate(res.data.deliveryDate)
  
      
    }
  
    return (
      <div className='flex justify-center'>
        <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md text-white'>
            <h1>titulo: {title}</h1>
            <p >Descripción: <span className='text-red-700'>{description}</span></p>
            <p>Fecha de entrega: {deliveryDate}</p>
        </div>
        {role === "teacher" && (
          <Link to={`/UpdatedTask/${id}`}>
            <button className="bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded-md">
              Actualizar
            </button>
          </Link>
        )}
      </div>
      
      
    )
  }


export default TaskCard