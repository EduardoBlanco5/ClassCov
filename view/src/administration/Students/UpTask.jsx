import {useForm} from 'react-hook-form'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URI = 'http://localhost:4000/upload/Task'

const UpTasks = () => {
  const [taskId, setTaskId] = useState('');
  const [student_id, setStudent_id] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');


  const onFileChange = (e) => {
    setFile(e.target.files[0]); // Captura el archivo
  };
  const onTaskIdChange = (e) => {
    setTaskId(e.target.value); // Captura el ID de la tarea
  };
  const onStudent_idChange = (e) => {
    setStudent_id(e.target.value)
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    // Validar que el archivo y el task_id existen
    if (!file || !taskId) {
      setMessage('Por favor selecciona un archivo e ingresa un ID de tarea');
      return;
    }
    // Crear un objeto FormData para enviar el archivo
    const formData = new FormData();
    formData.append('file', file);
    formData.append('task_id', taskId);
    formData.append('student_id', student_id);

    try {
      const res = await axios.post(URI, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Archivo subido exitosamente');
    } catch (err) {
      console.error(err);
      setMessage('Error al subir el archivo');
    }
  };


  return (
    <div>
       <h1>Subir Archivo</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="task_id">ID de la tarea:</label>
          <input
            type="number"
            id="task_id"
            value={taskId}
            onChange={onTaskIdChange}
            required
          />
        </div>
        <div>
          <label htmlFor="student_id">ID del estudiante:</label>
          <input
            type="number"
            id="student_id"
            value={student_id}
            onChange={onStudent_idChange}
            required
          />
        </div>
        <div>
          <label htmlFor="file">Selecciona un archivo:</label>
          <input type="file" id="file" onChange={onFileChange} required />
        </div>
        <button type="submit">Subir archivo</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpTasks;