import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const URI = 'http://localhost:4000/guardian/'

function UpdatedGuardian() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [date_of_birth, setDate_of_birth] = useState('')
    const [role, setRole] = useState('')
    const [status, setStatus] = useState('')
  
    const {id} = useParams()
    
    const update = async (e) => {

        e.preventDefault()
        await axios.put(URI+id, {
            name: name,
            email: email,
            phone: phone,
            password: password,
            date_of_birth: date_of_birth,
            role: role,
            status: status,
        })
        navigate('/ShowGuardians')
    
      }
      
      useEffect( () => {
        getGuardianById()
      },[])
    
      const getGuardianById = async () => {
        const res = await axios.get(URI+id)
        setName(res.data.name)
        setEmail(res.data.email)
        setPhone(res.data.phone)
        setPassword(res.data.password)
        setDate_of_birth(res.data.date_of_birth)
        setRole(res.data.role)
        setStatus(res.data.status)  
        
      }

  return (
    <div className='flex justify-center'>
      <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md flex'>
        <form onSubmit={update} >
        <h1 className="text-white font-bold text-3xl text-center">Tutor</h1>

            <label className="text-white">Nombre</label>
            <input 
            type='text' 
            placeholder='Nombre'
            value={name}
            onChange={ (e) => setName(e.target.value)}
            className='w-full px-2 py-2 rounded-md my-2'
            autoFocus
            ></input>

            <label className="text-white">Correo</label>
            <input 
            type='text'
            placeholder='ejemplo@correo.com'
            value={email}
            onChange={ (e) => setEmail(e.target.value)}
            className='w-full px-2 py-2 rounded-md my-1 '
            ></input>

            <label className="text-white">Telefono</label>
            <input 
            type='text'
            placeholder='3312345678'
            value={phone}
            onChange={ (e) => setPhone(e.target.value)}
            className='w-22 px-1 py-1 rounded-md my-1 mx-5'
            ></input>

            <label className="text-white">Contraseña</label>
            <input 
            type='password'
            placeholder='password***'
            value={password}
            onChange={ (e) => setPassword(e.target.value)}
            className='w-32 px-1 py-1 rounded-md my-1 mx-16'
            ></input>

            <label className="text-white mx-1">Fecha de nacimiento</label>
            <input
            type='date'
            placeholder='0000-00-00'
            value={date_of_birth}
            onChange={ (e) => setDate_of_birth(e.target.value)}
            className='px-1 py-1 rounded-md my-2 mx-5'
            >
            </input>

            <label className="text-white mx-1">Puesto</label>
            <input 
            type='text'
            placeholder='Profesor, Alumno, ...'
            value={role}
            onChange={ (e) => setStatus(e.target.value)}
            className='w-32 px-1 py-1 rounded-md my-1 mx-20'
            ></input>

            <label className="text-white mx-1">Estatus</label>
            <input 
            type='text'
            placeholder='Activo, Inactivo'
            value={status}
            onChange={ (e) => setStatus(e.target.value)}
            className='w-32 px-1 py-1 rounded-md my-1 mx-10'
            ></input>


            <button className='bg-green-600 hover:bg-green-800 rounded-md w-20 mx-32 mt-2' type='submit'>Actualizar</button>
        </form>
      </div>
    </div>
  )
}

export default UpdatedGuardian