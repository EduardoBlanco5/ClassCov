import { Card, CardBody, CardHeader, Divider } from '@heroui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

const URIT = 'http://localhost:4000/teacher/';
const URIS = 'http://localhost:4000/student/';
const URIG = 'http://localhost:4000/guardian/';
const URIA = 'http://localhost:4000/admin/';

function Profile() {
  const [profile, setProfile] = useState({});
  const { id } = useParams();
  const role = localStorage.getItem('role'); // Obtén el rol

  useEffect(() => {
    getProfileById(role);
  }, [id, role]);

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
    } catch (error) {
      console.error('Error fetching profile:', error);
    }

    

  };
  var opciones = { year: 'numeric', month: 'short', day: 'numeric' };
  var fechaNac = new Date(profile.date_of_birth)
    .toLocaleDateString('es',opciones)
    .replace(/ /g,'-')
    .replace('.','')
    .replace(/-([a-z])/, function (x) {return '-' + x[1].toUpperCase()});
  var fechaAdmi = new Date(profile.admission)
  .toLocaleDateString('es',opciones)
  .replace(/ /g,'-')
  .replace('.','')
  .replace(/-([a-z])/, function (x) {return '-' + x[1].toUpperCase()});

  return (
    <div className="w-10/12 h-[80%] mx-auto flex justify-center mt-8 overflow-scroll">
      
      <Card className=' w-full bg-primary-300'>
        
        <CardHeader className=' w-full bg-primary-500 flex flex-col'>
          <div className='w-full flex items-end gap-9 '>
            {profile.file && (
                <img
                  src={profile.file}
                  className="w-20 h-20 object-cover rounded-full mb-4 ml-3"
                  alt="Profile"
                />
              )}
              <div className='flex flex-col'>
                <h1 className='text-2xl text-primary-600'>Nombre:<span className=' ml-10 text-secondary-400'>{profile.name || 'N/A'}</span> </h1>
                <p className='text-lg text-primary-600/70'>Correo: <span className="ml-4 text-red-700">{profile.email || 'N/A'}</span></p>
              </div>
          </div>
          <Divider className='mt-3 h-1 rounded-full bg-primary-100'/>
        </CardHeader>
        <CardBody className='w-[90%]  mx-auto flex justify-center '>
          <div className='w-full h-[90%] bg-white rounded-2xl overflow-scroll'>
            <h2 className='m-5 text-primary-700 border-b border-primary-900  border-separate'>Datos personales</h2>
                <div className=' w-10/12 flex justify-center items-center  mx-auto gap-4'>
                  
                  <Card className='w-[80%] bg-primary-500 mx-auto'>
                    <CardHeader className='w-full flex flex-col items-start'>
                      <h3 className='text-primary-600'>Telefono</h3>
                      <Divider/>
                    </CardHeader>
                    <CardBody >
                      <p className='ml-10 text-primary-700 text-xl' >{profile.phone || 'N/A'}</p>
                    </CardBody>
                  </Card>
                  <Card className='w-[80%] bg-primary-500 mx-auto'>
                    <CardHeader className='w-full flex flex-col items-start' >
                      <h3 className='text-primary-600'>Fecha de nacimiento:</h3>
                      <Divider/>
                    </CardHeader>
                    <CardBody>
                      <p className='ml-10 text-primary-700 text-xl'> {fechaNac|| 'N/A'}</p>
                      </CardBody>
                  </Card>
                  
                </div>
            <h2 className='m-5 text-primary-700 border-b border-primary-900  border-separate'>Datos academicos</h2>
                <div className='w-10/12 flex justify-center items-center  mx-auto gap-4'>
                  <Card className='w-[80%] bg-secondary-200 mx-auto'>
                    <CardHeader className='w-full flex flex-col items-start'>
                      <h3 className='text-secondary-50'>Status:</h3>
                      <Divider/>
                    </CardHeader>
                    <CardBody><p className='text-secondary-600 ml-6'>{profile.status || 'N/A'}</p></CardBody>
                  </Card>

                  {/* Mostrar solo si el perfil tiene la propiedad */}
                  {profile.hire_date && 
                    <Card className='w-[80%] bg-secondary-200 mx-auto'>
                      <CardHeader className='w-full flex flex-col items-start'>
                        <h3 className='text-secondary-50'>Fecha de contratación</h3>
                        <Divider/>
                      </CardHeader>
                      <CardBody><p className='text-secondary-600 ml-6'>{profile.hire_date}</p></CardBody>
                    </Card>
                  }
                  {profile.admission && 
                    <Card className='w-[80%] bg-secondary-200 mx-auto'>
                      <CardHeader className='w-full flex flex-col items-start'>
                        <h3 className='text-secondary-50'>Fecha de admisión</h3>
                        <Divider/>
                      </CardHeader>
                      <CardBody><p className='text-secondary-600 ml-6'> {fechaAdmi}</p></CardBody>
                    </Card>
                  }
                  {profile.guardian_id && 
                    <Card className='w-[80%] bg-secondary-200 mx-auto'>
                      <CardHeader className='w-full flex flex-col items-start'>
                        <h3 className='text-secondary-50'>ID del Tutor </h3>
                        <Divider/>
                      </CardHeader>
                      <CardBody><p className='text-secondary-600 ml-6'>{profile.guardian_id}</p></CardBody>
                    </Card>
                  }
                  {profile.class_id && 
                    <Card className='w-[80%] bg-secondary-200 mx-auto'>
                      <CardHeader className='w-full flex flex-col items-start'>
                        <h3 className='text-secondary-50'>ID de la Clase</h3>
                        <Divider/>
                      </CardHeader>
                      <CardBody><p className='text-secondary-600 ml-6'> {profile.class_id}</p></CardBody>
                    </Card>
                  }
                

                </div>
          </div>
        </CardBody>
        
      </Card>
    </div>
  );
}

export default Profile;