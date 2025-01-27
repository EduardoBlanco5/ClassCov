import {useForm} from 'react-hook-form'
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const URI = 'http://localhost:4000/student'
const URIGUARDIANS = 'http://localhost:4000/guardiansSearch';

function CreateStudent() {

    const navigate =useNavigate()
    const {register, handleSubmit} = useForm()


    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [admission, setAdmission] = useState('')
    const [phone, setPhone] = useState('')
    const [date_of_birth, setDate_of_birth] = useState('')
    const [role, setRole] = useState('student')
    const [guardian_id, setGuardian_id] = useState ('')
    //const [class_id, setClass_id] = useState ('')
    const [status, setStatus] = useState ('activo')
    const [file, setFile] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [guardians, setGuardians] = useState([]);

    const fetchGuardians = useCallback(
        async (searchTerm) => {
          if (!searchTerm.trim()) {
            setGuardians([]);
            return;
          }
    
          try {
            const response = await axios.get(`${URIGUARDIANS}?search=${searchTerm}`);
            setGuardians(response.data);
          } catch (error) {
            console.error('Error al buscar tutores:', error);
          }
        },
        []
      );
      const debounceFetchGuardians = useCallback(
        debounce((term) => fetchGuardians(term), 500),
        [fetchGuardians]
      );
    
      const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debounceFetchGuardians(value);
      };

    const onSubmit = handleSubmit((data) => {
        console.log(data);
    })

    const create = async (e) => {
        e.preventDefault() 
        const formData = new FormData();

        formData.append('name', name);
        formData.append('email', email);
        formData.append('guardian_id', guardian_id);
        //formData.append('class_id', class_id);
        formData.append('password', phone);
        formData.append('date_of_birth', date_of_birth);
        formData.append('admission', admission);
        formData.append('status', status);
        formData.append('phone', phone);
        formData.append('role', role);
        // Agregar el archivo al FormData
        formData.append('file', file);

        try {
            // Enviar el FormData con una solicitud POST
            await axios.post(URI, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            navigate('/ShowStudents')
            } catch (error) {
                console.error('Error al crear el Tutor:', error);
            }
    }

    const uploadExcel = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('file', file);
  
      try {
          await axios.post('http://localhost:4000/student-excel', formData, {
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

            <label className='text-white'>Teléfono de Emergencia</label>
            <input
            type='text'
            placeholder='Telefono'
            value={phone}
            onChange={ (e) => setPhone(e.target.value)}
            className='w-full px-4 py-2 rounded-md my-2'
            ></input>

            <label className="text-white">Buscar Tutor</label>
          <input
            type="text"
            placeholder="Buscar por nombre o correo"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 rounded-md my-2"
          />
          {guardians.length > 0 && (
            <ul className="bg-white rounded-md shadow-md max-h-40 overflow-auto">
              {guardians.map((guardian) => (
                <li
                  key={guardian.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setGuardian_id(guardian.id);
                    setSearchTerm(`${guardian.name} (${guardian.email})`);
                    setGuardians([]);
                  }}
                >
                  {guardian.name} ({guardian.email})
                </li>
              ))}
            </ul>
          )} 


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

            <label htmlFor="file" className='text-white'>Selecciona un archivo:</label>
            <input type="file" id="file" onChange={(e) => setFile(e.target.files[0])} required />

            <button className='bg-green-600 rounded-md w-20 mx-32' type='submit'>Guardar</button>
        </form>
        </div>
        
        <div className='bg-zinc-800  max-w-md w-full p-10 rounded-md flex'>
        <form onSubmit={uploadExcel}>
                <h1 className="font-bold text-white text-center text-3xl">Subir Excel de Alumnos</h1>
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

function debounce(func, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }

export default CreateStudent