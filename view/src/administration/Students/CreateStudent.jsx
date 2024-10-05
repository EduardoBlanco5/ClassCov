import {useForm} from 'react-hook-form'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URI = 'http://localhost:4000/student'

function CreateStudent() {

    const navigate =useNavigate()
    const {register, handleSubmit} = useForm()


    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [admission, setAdmission] = useState('')
    const [phone, setPhone] = useState('')
    const [date_of_birth, setDate_of_birth] = useState('')
    const [role, setRole] = useState('4')
    const [guardian_id, setGuardian_id] = useState ('')
    const [class_id, setClass_id] = useState ('')

    const onSubmit = handleSubmit((data) => {
        console.log(data);
    })

    const create = async (e) => {
        e.preventDefault() 
        await axios.post(URI,  {name: name, email: email, password: password, role: role,
                            phone: phone, date_of_birth: date_of_birth, admission: admission, guardian_id: guardian_id,
                            class_id: class_id,
        })
        navigate('/showStudents')
    }
  return (

    <div className='flex justify-center'>
        <div className='bg-zinc-800  max-w-md w-full p-10 rounded-md flex'>
        <form onSubmit={create} >
            <h1 className='font-bold text-white text-center text-3xl'>Alumno</h1>

            <label className='text-white'>Nombre Completo</label>
            <input 
            type='text' 
            placeholder='Nombre'
            value={name}
            onChange={ (e) => setName(e.target.value)}
            className='w-full px-4 py-2 rounded-md my-2'
            autoFocus
            ></input>

            <label className='text-white'>Correo</label>
            <input 
            type='text'
            placeholder='Correo'
            value={email}
            onChange={ (e) => setEmail(e.target.value)}
            className='w-full px-4 py-2 rounded-md my-2'
            ></input>

            <label className='text-white'>Contraseña</label>
            <input
            placeholder='Contraseña'
            value={password}
            onChange={ (e) => setPassword(e.target.value)}
            className='w-full px-4 py-2 rounded-md my-2'
            ></input>

            <label className='text-white'>Teléfono de Emergencia</label>
            <input
            type='text'
            placeholder='Telefono'
            value={phone}
            onChange={ (e) => setPhone(e.target.value)}
            className='w-full px-4 py-2 rounded-md my-2'
            ></input>

            <label className='text-white'>id el Tutor</label>
            <input
            type='text'
            placeholder='id Tutor'
            value={guardian_id}
            onChange={ (e) => setGuardian_id(e.target.value)}
            className='w-full px-4 py-2 rounded-md my-2'
            ></input>

            <label className='text-white'>id de la clase</label>
            <input
            type='text'
            placeholder='1, 2, 3, ...'
            value={class_id}
            onChange={ (e) => setClass_id(e.target.value)}
            className='w-full px-4 py-2 rounded-md my-2'
            ></input>

            <label className='text-white'>Fecha de Nacimiento</label>
            <input
            type='date'
            value={date_of_birth}
            onChange={(e) => setDate_of_birth(e.target.value)}
            className='w-full px-4 py-2 rounded-md my-2'
            >
            </input>

            <label className='text-white'>Fecha de Admisión</label>
            <input
            type='date'
            value={admission}
            onChange={(e) => setAdmission(e.target.value)}
            className='w-full px-4 py-2 rounded-md my-2'
            >
            </input>

            <button className='bg-green-600 rounded-md w-20 mx-32' type='submit'>Guardar</button>
        </form>
        </div>
    </div>
    
  )
}

export default CreateStudent