import React, { useState } from 'react';
import axios from 'axios';

const UpTasks = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data);
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      alert('Error al subir el archivo');
    }
  };

  return (
    <div>
      <h2>Subir archivo</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir</button>
    </div>
  );
};

export default UpTasks;