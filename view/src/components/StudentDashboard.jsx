import React, { useEffect, useState } from 'react';
import axios from 'axios';  // Asegúrate de importar axios
import io from 'socket.io-client';

const socket = io('http://localhost:7000'); // URL del servidor

const StudentDashboard = ({ studentId }) => {
    console.log('studentId:', studentId);  // Verifica si el studentId está definido
  
    const [challenges, setChallenges] = useState([]);
    const [message, setMessage] = useState('');
  
    useEffect(() => {
      if (!studentId) {
        console.error('No se ha proporcionado un studentId válido');
        return;
      }
  
      // Conectar el socket
      socket.on('newChallenge', (data) => {
        // Mostrar un mensaje al usuario cuando se asigne un desafío nuevo
        alert(`Nuevo desafío asignado: ${data.title}`);
        // Obtener los desafíos de nuevo
        getChallenges();
      });
  
      // Obtener desafíos asignados
      const getChallenges = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/student/${studentId}/challenges`);
          console.log('Desafíos obtenidos:', response.data);
  
          if (Array.isArray(response.data)) {
            setChallenges(response.data);
            if (response.data.length > 0) {
              setMessage('Tienes nuevos desafíos asignados. ¡Ve a completarlos!');
            } else {
              setMessage('No tienes desafíos asignados por ahora.');
            }
          } else {
            console.error('La respuesta no es un array:', response.data);
            setMessage('Hubo un error al obtener tus desafíos.');
          }
        } catch (error) {
          console.error('Error al obtener los desafíos:', error);
          setMessage('Hubo un error al obtener tus desafíos.');
        }
      };
  
      getChallenges();
  
      return () => {
        socket.off('newChallenge');
      };
    }, [studentId]);
  
    return (
      <div>
        <h1>Bienvenido al Panel de Estudiante</h1>
        <p>{message}</p>
  
        {challenges.length > 0 && (
          <div>
            <h2>Desafíos Asignados:</h2>
            <ul>
              {challenges.map((challenge) => (
                <li key={challenge.id}>
                  <strong>{challenge.challenge.title}</strong>
                  <p>{challenge.challenge.description}</p>
                  <p>Estado: {challenge.status}</p>
                  <p>Progreso: {challenge.progress}%</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

export default StudentDashboard;