import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const URI = 'http://localhost:4000/task/';
const UPLOAD_URI = 'http://localhost:4000/uploadTask';
const URI_SUBJECT = 'http://localhost:4000/subject/';

const TaskCard = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [file, setFile] = useState(null); // Archivo de la tarea del maestro
  const [selectedFile, setSelectedFile] = useState(null); // Archivo que selecciona el alumno
  const [uploadedTask, setUploadedTask] = useState(null);
  const [message, setMessage] = useState('');
  const [subject_id, setSubject_id] = useState('');
  const [subject_name, setSubject_name] = useState('');

  const { user } = useContext(AuthContext);
  const student_id = localStorage.getItem('student_id');
  const role = user?.role || localStorage.getItem('role');

  useEffect(() => {
    getTaskById();
    checkTaskSubmission();
  }, []);

  useEffect(() => {
    if (subject_id) {
      getSubjectById(subject_id);
    }
  }, [subject_id]);

  const getSubjectById = async (subject_id) => {
    const res = await axios.get(URI_SUBJECT + subject_id);
    setSubject_name(res.data.name);
  };

  const getTaskById = async () => {
    try {
      const res = await axios.get(URI + id);
      setTitle(res.data.title);
      setDescription(res.data.description);
      setDeliveryDate(res.data.deliveryDate);
      setFile(res.data.file);
      setSubject_id(res.data.subject_id);
    } catch (error) {
      console.error('Error al obtener la tarea:', error);
    }
  };

  const checkTaskSubmission = async () => {
    let studentIdToCheck = student_id;
    if (role === 'guardian') {
      studentIdToCheck = localStorage.getItem('student_id');
    }
    if (!studentIdToCheck) return;

    try {
      const res = await axios.get('http://localhost:4000/uptask', {
        params: { task_id: id, student_id: studentIdToCheck },
      });
      setUploadedTask(res.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setUploadedTask(null);
      } else {
        console.error('Error al verificar tarea:', error);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage('Por favor selecciona un archivo para subir.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('task_id', id);
    formData.append('student_id', student_id);
    formData.append('subject_id', subject_id);

    try {
      await axios.post(UPLOAD_URI, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Archivo subido exitosamente.');
      setSelectedFile(null);
      checkTaskSubmission();
    } catch (error) {
      console.error('Error al subir archivo:', error);
      setMessage('Error al subir el archivo. Intenta nuevamente.');
    }
  };

  const isImage = (fileUrl) => fileUrl?.match(/\.(jpg|jpeg|png|gif)$/i);
  const isPdf = (fileUrl) => fileUrl?.endsWith('.pdf');

  return (
    <div className="flex justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md text-white">
        <h1>Título: {title}</h1>
        <p>Descripción: {description}</p>
        <p>Materia: {subject_name}</p>
        <p>Fecha de entrega: {deliveryDate}</p>

        {/* Mostrar archivo de la tarea si el maestro subió uno */}
        {file && (
          <>
            {isImage(file) ? (
              <img src={file} className="w-full object-cover my-4" alt="Tarea" />
            ) : isPdf(file) ? (
              <iframe src={file} width="100%" height="400px" title="Archivo PDF" className="my-4" />
            ) : (
              <p className="text-yellow-500">Para ver el archivo, presiona el botón</p>
            )}

            <a href={file} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded block text-center mt-2">
              Ver archivo
            </a>
          </>
        )}

        {role === 'student' && (
          <div className="mt-4">
            {uploadedTask ? (
              <div className="mt-4">
                <p className="text-green-500">Tarea Enviada</p>
                <div className="border p-4 rounded bg-gray-100 text-black">
                  {isImage(uploadedTask.file) ? (
                    <img src={uploadedTask.file} alt="Tarea subida" className="max-w-full max-h-96" />
                  ) : isPdf(uploadedTask.file) ? (
                    <iframe src={uploadedTask.file} title="Tarea subida" className="w-full h-96 border-0"></iframe>
                  ) : (
                    <p>Tipo de archivo no soportado para vista previa. Descárgalo para verlo.</p>
                  )}
                </div>
                {uploadedTask.qualification ? (
                  <p className="text-green-500 font-semibold">Calificación: {uploadedTask.qualification}</p>
                ) : (
                  <p className="text-yellow-500 font-semibold">Pendiente</p>
                )}

                <a href={uploadedTask.file} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded block text-center mt-2">
                  Ver tarea
                </a>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold">Sube tu tarea:</h3>
                <form onSubmit={handleUpload}>
                  <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer" />
                  <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-2">
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
