import {useForm} from 'react-hook-form'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const URI = 'http://localhost:4000/class'
const URIT = 'http://localhost:4000/teachers'

function CreateClass() {

    const navigate =useNavigate()
    const {register, handleSubmit} = useForm()


    const [grade, setGrade] = useState('')
    const [salon, setSalon] = useState('')
    const [shift, setShift] = useState('')

    const [teachers, setTeachers] = useState([]); // Lista de Profesores
    const [teacher_id, setTeacher_id] = useState('')
    

    const onSubmit = handleSubmit((data) => {
      console.log(data);
    })


    useEffect(() => {
      // Obtener materias desde el backend
      const fetchTeachers = async () => {
        try {
          const response = await axios.get(URIT);
          setTeachers(response.data);
        } catch (error) {
          console.error('Error al obtener materias:', error);
        }
      };
  
      fetchTeachers();
    }, []);

    const create = async (e) => {
      e.preventDefault() 
      await axios.post(URI,  {grade: grade, salon: salon, shift: shift, teacher_id: teacher_id , 
      })
      navigate('/ShowClass')
    }

    
  return (
    <div className='flex justify-center'>
          <div className='bg-zinc-800  max-w-md w-full p-10 rounded-md flex'>
          <form onSubmit={create} >
              <h1 className='font-bold text-white text-center text-3xl'>Clases</h1>

              <label className='text-white'>grado</label>
              <input 
              type='text' 
              placeholder='1,2,3,4,5,6'
              value={grade}
              onChange={ (e) => setGrade(e.target.value)}
              className='w-full px-4 py-2 rounded-md my-2'
              autoFocus
              ></input>

              <label className='text-white'>Grupo</label>
              <input 
              type='text'
              placeholder='A, B'
              value={salon}
              onChange={ (e) => setSalon(e.target.value)}
              className='w-full px-4 py-2 rounded-md my-2'
              ></input>

              <label className='text-white'>Turno</label>
              <input
              placeholder='Matutino, Vespertino'
              value={shift}
              onChange={ (e) => setShift(e.target.value)}
              className='w-full px-4 py-2 rounded-md my-2'
              ></input>

              <label className='text-white text-1xl font-semibold'>    Profesor</label>
              <select
                value={teacher_id}
                onChange={(e) => setTeacher_id(e.target.value)}
                className='w-full px-4 py-2 rounded-md my-2'
              >
                <option value=''>Selecciona un Profesor</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
          

              <button className='bg-green-600 rounded-md w-20 mx-32' type='submit'>Guardar</button>
          </form>
          </div>
      </div>
  )
}

export default CreateClass