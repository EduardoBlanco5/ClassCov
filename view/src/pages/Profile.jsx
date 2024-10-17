// Profile.jsx (solicitud con token)
import { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token'); // Recupera el token del localStorage

      try {
        const response = await axios.get('http://localhost:4000/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          },
        });
        setUserData(response.data);
      } catch (err) {
        console.error('Error al obtener los datos del perfil:', err);
        setError('No se pudo cargar el perfil.');
      }
    };

    fetchUserData();
  }, []);

  if (error) return <div>{error}</div>;
  if (!userData) return <div>Cargando perfil...</div>;

  return (
    <div>
      <h1>Perfil de {userData.name}</h1>
      <p>Correo: {userData.email}</p>
      <p>Rol: {userData.role}</p>
    </div>
  );
};

export default Profile;