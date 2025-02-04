import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

const URIT = 'http://localhost:4000/teacher/';
const URIS = 'http://localhost:4000/student/';
const URIG = 'http://localhost:4000/guardian/';
const URIA = 'http://localhost:4000/admin/';

function Profile() {
  const [profile, setProfile] = useState({});
  const [guardianName, setGuardianName] = useState('');  // Estado para almacenar el nombre del tutor
  const { id } = useParams();
  const role = localStorage.getItem('role'); // Obtén el rol

  useEffect(() => {
    getProfileById(role);
  }, [id, role]);

  // Obtiene el perfil según el rol
  const getProfileById = async (role) => {
    try {
      let url;
      switch (role) {
        case 'admin':
          url = URIA + id;
          break;
        case 'teacher':
          url = URIT + id;
          break;
        case 'student':
          url = URIS + id;
          break;
        case 'guardian':
          url = URIG + id;
          break;
        default:
          console.error(`Role not recognized: ${role}`);
          return;
      }

      const res = await axios.get(url);
      setProfile(res.data);  // Actualizamos solo los datos obtenidos

      // Si el rol es estudiante, obtenemos el nombre del tutor
      if (role === 'student' && res.data.guardian_id) {
        getGuardianName(res.data.guardian_id);
      }

    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Función para obtener el nombre del tutor
  const getGuardianName = async (guardianId) => {
    try {
      const res = await axios.get(URIG + guardianId);  // Usamos el URL para obtener los datos del tutor
      setGuardianName(res.data.name);  // Almacenamos el nombre del tutor
    } catch (error) {
      console.error('Error fetching guardian name:', error);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md text-white">
        {console.log(profile.file)}
        {console.log(profile.email)}
        {profile.file && (
          <img
            src={profile.file}
            className="w-20 h-20 object-cover rounded-full my-2"
            alt="Profile"
          />
        )}
        <h1>Nombre: {profile.name || 'N/A'}</h1>
        <p>Correo: <span className="text-red-700">{profile.email || 'N/A'}</span></p>
        <p>Teléfono: {profile.phone || 'N/A'}</p>
        <p>Fecha de nacimiento: {profile.date_of_birth || 'N/A'}</p>
        <p>Status: {profile.status || 'N/A'}</p>

        {/* Mostrar solo si el perfil tiene la propiedad */}
        {profile.hire_date && <p>Fecha de contratación: {profile.hire_date}</p>}
        {profile.admission && <p>Fecha de admisión: {profile.admission}</p>}
        
        {/* Mostrar el nombre del tutor en lugar del ID */}
        {role === 'student' && profile.guardian_id && (
          <p>Nombre del Tutor: {guardianName || 'Cargando...'}</p>
        )}

        {profile.class_id && <p>ID de la Clase: {profile.class_id}</p>}
      </div>
    </div>
  );
}

export default Profile;
