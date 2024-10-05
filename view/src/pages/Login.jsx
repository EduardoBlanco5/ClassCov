import {set, useForm} from 'react-hook-form'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(password, email);
      }

  return (
    <div className='flex justify-center'>

        <div className='bg-cyan-800 p-28 w-35 rounded-md'>
            <form onSubmit={handleSubmit}>
                <label className='text-black text-3xl font-extrabold flex'>Correo: </label>
                <input 
                type='email'
                placeholder=' correo'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                className='rounded-md w-60 font-semibold my-3 py-1'

                >
                </input>

                <label className='text-black text-3xl font-extrabold flex my-3'>Contraseña: </label>
                <input 
                type='password'
                placeholder=' Contraseña'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='rounded-md w-60 font-semibold py-1'
                >
                </input>

                <button className='p-2 flex bg-indigo-500 rounded-md mt-10 ml-20' type='submit'>Entrar</button>
            </form>
        </div>
    </div>
  )
}

export default Login