import {useForm} from 'react-hook-form'
import axios from 'axios';
import { useState,} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const URI = 'http://localhost:4000/task'

function CreateTask() {
  const {register, handleSubmit} = useForm()
  const { class_id } = useParams(); // Obtener el id de la clase desde la URL
  const teacher_id = localStorage.getItem("teacher_id") || "1"; // Asegúrate de guardar este dato al iniciar sesión

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')
  const [qualification, setQualification] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [status, setStatus] = useState('')
  const [file, setFile] = useState(null);
  

  const navigate =useNavigate()

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  })

  const create = async (e) => {
    e.preventDefault() 
    const formData = new FormData();

        formData.append('title', title);
        formData.append('description', description);
        formData.append('notes', notes);
        formData.append('qualification', qualification);
        formData.append('deliveryDate', deliveryDate);
        formData.append('status', status);
        // Agregar el archivo al FormData

        if (file) {
        formData.append('file', file);
        }

        formData.append('teacher_id', teacher_id); // Añade teacher_id
        formData.append('class_id', class_id); // Asegúrate de que `class_id` provenga de `useParams`

        try {
            // Enviar el FormData con una solicitud POST
            await axios.post(URI, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            navigate('/ShowClass')
            } catch (error) {
                console.error('Error al crear tarea:', error);
            }
    navigate(`/ClassCard/${class_id}`)
  }


  return (
    <div className='flex justify-center'>
      <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md flex'>
        <form onSubmit={create} >
          <h1 className='font-bold text-white text-center text-3xl'>Tareas</h1>

          <label className='text-white text-1xl font-semibold'>Titulo</label>
          <input 
          type='text' 
          placeholder='Titulo'
          value={title}
          onChange={ (e) => setTitle(e.target.value)}
          className='w-full px-4 py-2 rounded-md my-2'
          autoFocus
          ></input>

          <label className='text-white text-1xl font-semibold'>Descripción</label>
          <textarea rows='3' 
          placeholder='Descripcion'
          value={description}
          onChange={ (e) => setDescription(e.target.value)}
          className='w-full px-4 py-2 rounded-md my-2'
          ></textarea>

          <label className='text-white text-1xl font-semibold'>Notas</label>
          <textarea rows='3'
          placeholder='Anuncio o Instrucción extra'
          value={notes}
          onChange={ (e) => setNotes(e.target.value)}
          className='w-full px-4 py-2 rounded-md my-2'
          ></textarea>

          <label className='text-white text-1xl font-semibold'>Calificación</label>
          <input 
          type='text'
          placeholder='0/10'
          value={qualification}
          onChange={ (e) => setQualification(e.target.value)}
          className='w-32 px-1 py-1 rounded-md my-1 mx-[20%]'
          ></input>

          <label className='text-white text-1xl font-semibold'>Fecha de Entrega</label>
          <input
          type='date'
          placeholder='0000-00-00'
          value={deliveryDate}
          onChange={ (e) => setDeliveryDate(e.target.value)}
          className='px-1 py-1 rounded-md my-2 mx-10'
          >
          </input>

          <label className='text-white text-1xl font-semibold'>Estatus</label>
          <input 
          type='text'
          placeholder='Asignada, En revisión, Entregada'
          value={status}
          onChange={ (e) => setStatus(e.target.value)}
          className='w-40 px-1 py-1 rounded-md my-1 mx-16'
          ></input>

          <label htmlFor="file" className='text-white'>Selecciona un archivo:</label>
          <input type="file" id="file" onChange={(e) => setFile(e.target.files[0])} />

          <button className='bg-green-600 rounded-md w-20 mx-32' type='submit'>Guardar</button>
        </form>
      </div>
    </div>
  )
}

export default CreateTask
