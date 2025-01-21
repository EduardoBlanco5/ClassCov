import {useForm} from 'react-hook-form'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URI = 'http://localhost:4000/guardian'

function CreateGuardian() {

    const navigate =useNavigate()
    const {register, handleSubmit} = useForm()


    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [date_of_birth, setDate_of_birth] = useState('')
    const [role, setRole] = useState('guardian')
    const [status, setStatus] = useState('')
    const [file, setFile] = useState(null);

    const onSubmit = handleSubmit((data) => {
        console.log(data);
    })

    const create = async (e) => {
        e.preventDefault() 
        const formData = new FormData();

        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('phone', phone);
        formData.append('date_of_birth', date_of_birth);
        formData.append('role', role);
        formData.append('status', status);
        // Agregar el archivo al FormData
        formData.append('file', file);

        try {
            // Enviar el FormData con una solicitud POST
            await axios.post(URI, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
      
            navigate('/ShowGuardians');
          } catch (error) {
            console.error('Error al crear el Tutor:', error);
          }
    }

    const uploadExcel = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('file', file);
  
      try {
          await axios.post('http://localhost:4000/guardian-excel', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          });
          alert('Tutores importados correctamente');
      } catch (error) {
          console.error('Error al subir el archivo Excel:', error);
          alert('Error al subir el archivo');
      }
  };

    return (


    <div className='flex justify-center'>
        <div className='bg-zinc-800  max-w-md w-full p-10 rounded-md flex'>
        <form onSubmit={create} >
            <h1 className='font-bold text-white text-center text-3xl'>Tutor</h1>

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

            <label className='text-white'>Teléfono</label>
            <input
            type='text'
            placeholder='Telefono'
            value={phone}
            onChange={ (e) => setPhone(e.target.value)}
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

            <label className='text-white'>Status</label>
            <input
            type='text'
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className='w-full px-4 py-2 rounded-md my-2'
            >
            </input>

            <label htmlFor="file" className='text-white'>Selecciona un archivo:</label>
            <input type="file" id="file" onChange={(e) => setFile(e.target.files[0])} required />

            <button className='bg-green-600 rounded-md w-20 mx-32' type='submit'>Guardar</button>
        </form>

        
        </div>
        <div className='bg-zinc-800  max-w-md w-full p-10 rounded-md flex'>
        <form onSubmit={uploadExcel}>
                <h1 className="font-bold text-white text-center text-3xl">Subir Excel de Tutores</h1>
                <label htmlFor="excelFile" className="text-white">
                    Selecciona un archivo Excel:
                </label>
                <input
                    type="file"
                    id="excelFile"
                    onChange={(e) => setFile(e.target.files[0])}
                    accept=".xlsx,.xls"
                    required
                />
                <button className="bg-blue-600 rounded-md w-20 mx-32" type="submit">
                    Subir Excel
                </button>
            </form>
        </div>
    </div>
        
    )
}

export default CreateGuardian