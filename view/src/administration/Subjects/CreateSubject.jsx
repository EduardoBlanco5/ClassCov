import {useForm} from 'react-hook-form'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const URI = 'http://localhost:4000/subject'

function CreateSubject() {

    const navigate =useNavigate()
    const {register, handleSubmit} = useForm()


    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [grade, setGrade] = useState('');

    const [teacher_id, setTeacher_id] = useState('')
    

    const onSubmit = handleSubmit((data) => {
      console.log(data);
    })

    const create = async (e) => {
      e.preventDefault() 
      await axios.post(URI,  {name: name, description: description, grade: grade, 
      })
      navigate('/ShowSubjects')
    }

    useEffect(() => {
      console.log(grade)
    }, [])
    

    
  return (
    <div className='flex justify-center'>
          <div className='bg-zinc-800  max-w-md w-full p-10 rounded-md flex'>
          <form onSubmit={create} >
              <h1 className='font-bold text-white text-center text-3xl'>Materias</h1>

              <label className='text-white'>Nombre</label>
              <input 
              type='text' 
              placeholder='Español, Matemáticas, Historia,...'
              value={name}
              onChange={ (e) => setName(e.target.value)}
              className='w-full px-4 py-2 rounded-md my-2'
              autoFocus
              ></input>

              <label className='text-white'>Descripción</label>
              <input 
              type='text'
              placeholder='Breve descripción de la materia'
              value={description}
              onChange={ (e) => setDescription(e.target.value)}
              className='w-full px-4 py-2 rounded-md my-2'
              ></input>

              <label className="text-white">Grado</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-2 rounded-md my-2"
              >
                <option value="" disabled>Selecciona un grado</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
        
              <button className='bg-green-600 rounded-md w-20 mx-32' type='submit'>Guardar</button>
          </form>
          </div>
      </div>
  )
}

export default CreateSubject