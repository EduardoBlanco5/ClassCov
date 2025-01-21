import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateStudentClass = () => {
  const [studentId, setStudentId] = useState('');
  const [classId, setClassId] = useState('');
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

  return (
    <div className='bg-zinc-800  max-w-md w-full p-10 rounded-md flex'>
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
    </div>
  );
};

export default CreateStudentClass;