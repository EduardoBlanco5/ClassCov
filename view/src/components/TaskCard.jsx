import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const URI = 'http://localhost:4000/task/';
const UPLOAD_URI = 'http://localhost:4000/uploadTask';

function TaskCard() {
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const [notes, setNotes] = useState('');
  const [qualification, setQualification] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [file, setFile] = useState(null); // Para el archivo a subir
  const [message, setMessage] = useState(''); // Mensajes de éxito o error al subir
  const [task_id, setTask_id] = useState(id);

  const { user } = useContext(AuthContext); // Recuperar rol del usuario desde AuthContext
  const role = user?.role || localStorage.getItem('role'); // Respaldo con localStorage
  // Obtener el ID del estudiante desde localStorage
  const student_id = localStorage.getItem('student_id');
  const teacher_id = localStorage.getItem('teacher_id'); // En caso de que sea un profesor

  useEffect(() => {
    getTaskById();
  }, []);

  const getTaskById = async () => {
    try {
      const res = await axios.get(URI + id);
      setTitle(res.data.title);
      setDescription(res.data.description);
      setNotes(res.data.notes);
      setQualification(res.data.qualification);
      setDeliveryDate(res.data.deliveryDate);
    } catch (error) {
      console.error('Error al obtener la tarea:', error);
    }
    
  };

  // Función para manejar la subida de archivos
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Por favor selecciona un archivo para subir.');
      return;
    }


    if (!student_id && !teacher_id) {
      setMessage('No se pudo obtener el ID del usuario.');
      return;
    }

    // Selecciona el ID correcto dependiendo del rol
    const userId = role === 'student' ? student_id : teacher_id;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('task_id', task_id); // ID de la tarea obtenida de los parámetros
    formData.append('student_id', userId); // ID del estudiante o profesor

    try {
      await axios.post(UPLOAD_URI, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Archivo subido exitosamente.');
    } catch (error) {
      console.error('Error al subir archivo:', error);
      setMessage('Error al subir el archivo. Intenta nuevamente.');
    }
    
  };

  return (
    <div className="flex justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md text-white">
        <h1>Título: {title}</h1>
        <p>Descripción: <span className="text-red-700">{description}</span></p>
        <p>Fecha de entrega: {deliveryDate}</p>
        
        {console.log(task_id)}
        {role === 'teacher' && (
          <Link to={`/UpdatedTask/${id}`}>
            <button className="bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded-md">
              Actualizar
            </button>
          </Link>
        )}
        {role === 'student' && (
          <div className="mt-4">
            <h3 className="text-lg font-bold">Sube tu tarea:</h3>
            <form onSubmit={handleUpload}>
              <div>
                <label htmlFor="file" className="block mb-2">Selecciona un archivo:</label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
              >
                Subir archivo
              </button>
            </form>
            {message && <p className="mt-2 text-sm">{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskCard;