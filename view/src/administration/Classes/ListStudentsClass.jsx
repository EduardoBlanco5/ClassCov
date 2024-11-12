import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListStudentClasses = () => {
  const [studentClasses, setStudentClasses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/StudentsClasses');
        setStudentClasses(response.data);
      } catch (error) {
        console.error('Error al obtener inscripciones:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container">
      <h2>Inscripciones de Estudiantes en Clases</h2>
      <ul>
        {studentClasses.map((studentClass) => (
          <li key={`${studentClass.student_id}-${studentClass.class_id}`}>
            Estudiante ID: {studentClass.student_id}, Clase ID: {studentClass.class_id}, Fecha de Inscripción: {studentClass.createdAt}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListStudentClasses;