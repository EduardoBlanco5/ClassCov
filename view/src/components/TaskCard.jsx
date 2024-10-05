import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from "react-router-dom"

const URI = 'http://localhost:4000/task/'

function TaskCard()  {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [notes, setNotes] = useState('')
    const [qualification, setQualification] = useState('')
    const [deliveryDate, setDeliveryDate] = useState('')
  
    const {id} = useParams()
    
  
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
      </div>
      
    )
  }


export default TaskCard