import React, { useState } from 'react';
import axios from 'axios';

const UpTasks = () => {
  const [file, setFile] = useState(null);
  const [taskId, setTaskId] = useState(''); // Estado para guardar el taskId

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleTaskIdChange = (event) => {
    setTaskId(event.target.value); // Captura el taskId del input
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId); // Agrega taskId al FormData

    try {
      const response = await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      alert('Error al subir el archivo');
    }
  };

  return (
    <div>
      <h2>Subir archivo</h2>
      <input type="text" placeholder="ID de la tarea" value={taskId} onChange={handleTaskIdChange} />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir</button>
    </div>
  );
};

export default UpTasks;