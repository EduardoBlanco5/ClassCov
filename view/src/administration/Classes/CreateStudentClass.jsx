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
    <div className="container">
      <h2>Inscribir Estudiante a Clase</h2>
      <form onSubmit={handleSubmit}>
        <label>Student ID:</label>
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <br />
        <label>Class ID:</label>
        <input
          type="text"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          required
        />
        <br />
        <button type="submit">Inscribir</button>
      </form>
    </div>
  );
};

export default CreateStudentClass;