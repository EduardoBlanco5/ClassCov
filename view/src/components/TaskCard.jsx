import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const URI = 'http://localhost:4000/task/';
const UPLOAD_URI = 'http://localhost:4000/uploadTask';

const TaskCard = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [file, setFile] = useState(null);
  const [uploadedTask, setUploadedTask] = useState(null); // Para almacenar la tarea enviada
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);
  const student_id = localStorage.getItem('student_id');
  const role = user?.role || localStorage.getItem('role');

  useEffect(() => {
      getTaskById();
      checkTaskSubmission();
  }, []);

  //Información de la tarea dejada por el maestro
  const getTaskById = async () => {
      try {
          const res = await axios.get(`http://localhost:4000/task/${id}`);
          setTitle(res.data.title);
          setDescription(res.data.description);
          setDeliveryDate(res.data.deliveryDate);
          setFile(res.data.file);
      } catch (error) {
          console.error('Error al obtener la tarea:', error);
      }
  };

  const checkTaskSubmission = async () => {
      if (role !== 'student' || !student_id) return;

      try {
          const res = await axios.get('http://localhost:4000/uptask', {
              params: { task_id: id, student_id },
          });
          setUploadedTask(res.data); // Si existe, almacenamos los datos
      } catch (error) {
          if (error.response?.status === 404) {
              setUploadedTask(null); // No hay tarea enviada
          } else {
              console.error('Error al verificar tarea:', error);
          }
      }
  };

  const handleUpload = async (e) => {
      e.preventDefault();
      if (!file) {
          setMessage('Por favor selecciona un archivo para subir.');
          return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('task_id', id);
      formData.append('student_id', student_id);

      try {
          await axios.post('http://localhost:4000/uploadTask', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
          });
          setMessage('Archivo subido exitosamente.');
          checkTaskSubmission(); // Actualizamos el estado después de subir
      } catch (error) {
          console.error('Error al subir archivo:', error);
          setMessage('Error al subir el archivo. Intenta nuevamente.');
      }
  };

  return (
    <div className="flex justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md text-white">
        <h1>Título: {title}</h1>
        <p>Descripción: {description}</p>
        <p>Fecha de entrega: {deliveryDate}</p>
         {/* Mostrar la imagen si existe */}
       
          {file && (
                <img src={file} className="w-20 h-20 object-cover rounded-full my-2" />
              )}
  
        {role === 'student' && (
          <div className="mt-4">
           
            {uploadedTask ? (
              <div className="mt-4">
                <p className="text-green-500">Tarea Enviada</p>
                <div className="border p-4 rounded bg-gray-100 text-black">
                  {uploadedTask.file.endsWith('.jpg') ||
                  uploadedTask.file.endsWith('.jpeg') ||
                  uploadedTask.file.endsWith('.png') ? (
                    // Mostrar imagen
                    <img
                      src={uploadedTask.file}
                      alt="Tarea subida"
                      className="max-w-full max-h-96"
                    />
                    
                  ) : uploadedTask.file.endsWith('.pdf') ? (
                    // Mostrar PDF
                    <iframe
                      src={uploadedTask.file}
                      title="Tarea subida"
                      className="w-full h-96 border-0"
                    ></iframe>
                  ) : (
                    // Mostrar texto como fallback
                    <p>Tipo de archivo no soportado para vista previa. Descárgalo para verlo.</p>
                  )}
                </div>
                {uploadedTask.qualification ? (
                                <p className="text-green-500 font-semibold">
                                    Calificación: {uploadedTask.qualification}
                                </p>
                            ):(
                              <>
                                <p className='text-yellow-500 font-semibold'>
                                  Pendiente
                                </p>
                              </>
                            )}
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold">Sube tu tarea:</h3>
                <form onSubmit={handleUpload}>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
                  >
                    Subir archivo
                  </button>
                </form>
                {message && <p className="mt-2 text-sm">{message}</p>}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;