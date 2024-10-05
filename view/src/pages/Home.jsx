import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import ShowTask from '../teachers/Tasks/ShowTask'
import ShowAnnouncements from '../teachers/Announcements/ShowAnnouncements'
import ShowClass from '../administration/Classes/ShowClass'

function Home() {

  const URI = 'http://localhost:4000/tasks'
  
    const [tasks, setTask] = useState([])
    useEffect(() => {
        getTasks()
    },[])


    //Mostrar Tareas
    const getTasks = async () => {
        const res = await axios.get(URI)
        setTask(res.data)
    }


    return (
      <div className='flex h-[calc(100vh-100px)] items-center justify-between'>
      
         
        <div className='bg-blue-700 '>
          
          <ShowTask></ShowTask>
   
        </div>

        <div className='bg-green-700 '>
          <ShowAnnouncements></ShowAnnouncements>
        </div>

        <div className='bg-red-700 '>
        
          <ShowClass></ShowClass>

        </div>


      </div>
    )
  }


export default Home
