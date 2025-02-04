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
  
          const { token, role, name, id } = response.data; // Asegúrate de que tu API devuelva el rol y el ID correcto
          login(token, role, name, id); // Llama a login con el token y rol
          
          // Guarda los datos en localStorage según el rol
          localStorage.setItem('role', role); 
          if (role === 'teacher') {
              localStorage.setItem('teacher_id', id);
          } else if (role === 'student') {
              localStorage.setItem('student_id', id);
          }
  
          navigate('/Home'); // Redirige al usuario a /Home después del login
      } catch (err) {
          console.error('Error al iniciar sesión:', err);
          setError('Usuario o contraseña incorrectos');
          setTimeout(() => {
              setError(null);
          }, 2000);
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