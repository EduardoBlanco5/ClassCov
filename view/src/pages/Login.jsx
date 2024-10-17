import {set, useForm} from 'react-hook-form'
import axios from 'axios';
import { useState, useContext } from 'react';
import { AuthContext } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';

const URI = 'http://localhost:4000/auth/login'

function Login() {


    const [email, setEmail] = useState('')

    const [password, setPassword] = useState('')
    const [error, setError] = useState(null); // Estado para mensajes de error
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
  

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(password, email);
        try {
            const response = await axios.post(URI, { email, password });
      

            const { token, role, name} = response.data; // Asegúrate de que tu API devuelva el rol
      login(token, role, name); // Llama a login con el token y rol
      if (role === 'student') {
        navigate(`/Home`);
      }else if (role === 'admin') {
        navigate('/CreateAdmins');
      }
      else if (role === 'teacher') {
        navigate('/CreateTask');
      }
      else if (role === 'guardian') {
        navigate('/ShowStudents');
      }
          } catch (err) {
            console.error('Error al iniciar sesión:', err);
            setError('Usuario o contraseña incorrectos');
          }
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
                {error && <p className="text-red-500 mt-2">{error}</p>}

                <button className='p-2 flex bg-indigo-500 rounded-md mt-10 ml-20' type='submit'>Entrar</button>
            </form>
        </div>
    </div>
  )
}

export default Login