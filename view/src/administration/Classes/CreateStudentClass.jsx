import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateStudentClass = () => {
  const [studentId, setStudentId] = useState('');
  const [classId, setClassId] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/studentClass', {
        student_id: studentId,
        class_id: classId,
      });
      alert('Estudiante inscrito en la clase correctamente');
      navigate('/ShowStudentsClass');
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al inscribir el estudiante');
    }
  };

  const uploadExcel = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
        await axios.post('http://localhost:4000/studentClass-excel', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        alert('Alumnos importados a la clase correctamente');
    } catch (error) {
        console.error('Error al subir el archivo Excel:', error);
        alert('Error al subir el archivo');
    }
};

  return (
    <div className='flex justify-center'>
      <div className='bg-zinc-800  max-w-md w-full p-10 rounded-md'>
      <h2 className='text-white flex'>Inscribir Estudiante a Clase</h2>
      <form onSubmit={handleSubmit}>
        <label className='text-white flex'>Student ID:</label>
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <br />
        <label className='text-white flex'>Class ID:</label>
        <input
          type="text"
          className='text-white flex'
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          required
        />
        <br />
        <button type="submit" className='text-white flex bg-green-500 rounded-md p-3'>Inscribir</button>
      </form>

      <div className='bg-zinc-800  max-w-md w-full  rounded-md flex'>
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
    </div>
  );
};

export default CreateStudentClass;