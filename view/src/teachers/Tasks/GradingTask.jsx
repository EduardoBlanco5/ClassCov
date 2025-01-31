import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../components/AuthContext';

const URI = 'http://localhost:4000/task/';
const UP_URI = 'http://localhost:4000/UpTasks/';
const URI_SUBJECT = 'http://localhost:4000/subject/';

function GradingTask() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [file, setFile] = useState(null);
    const [subject_id, setSubject_id] = useState('');
    const [averageGrade, setAverageGrade] = useState(null);

    const [upTasks, setUpTasks] = useState([]);
    
    const { user } = useContext(AuthContext);
    const student_id = localStorage.getItem('student_id');
    const role = user?.role || localStorage.getItem('role');

    const [subject_name, setSubject_name] = useState('');

    useEffect(() => {
        getTaskById();
        getUpTask();
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

    const getUpTask = async () => {
        try {
            const res = await axios.get(`${UP_URI}${id}`);
            if (Array.isArray(res.data)) {
                setUpTasks(res.data);
            } else {
                setUpTasks([]);
            }
        } catch (error) {
            console.error('Error al obtener las tareas enviadas:', error);
        }
    };
  
    const handleGrade = async (taskId, qualification) => {
        if (!qualification || isNaN(parseFloat(qualification))) {
            alert('Introduce una calificación válida.');
            return;
        }
    
        try {
            await axios.put(`${UP_URI}grade/${taskId}`, { qualification: parseFloat(qualification) });
            alert('Calificación guardada y promedio actualizado exitosamente.');
            getUpTask();
        } catch (error) {
            console.error('Error al calificar la tarea:', error);
            alert('Hubo un error al guardar la calificación.');
        }
    };
  
    return (
      <div className="justify-stretch">
        <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md text-white">
          <h1>Título: {title}</h1>
          <p>Descripción: {description}</p>
          <p>Materia: {subject_name}</p>
          <p>Fecha de entrega: {deliveryDate}</p>
          {file ? (
            file.match(/.(jpg|jpeg|png|gif)$/i) ? (
              <img src={file} className="w-20 h-20 object-cover rounded-full my-2" />
            ) : (
              <p className="text-yellow-500">Para mostrar el archivo, presiona el botón</p>
            )
          ) : null}
          {file && (
            <a 
              href={file} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-4 py-2 rounded block text-center mt-2"
            >
              Ver Archivo
            </a>
          )}
        </div>

        <div>
        {upTasks.length > 0 ? (
            upTasks.map((UpTask) => (
                <tr key={UpTask.id}>
                    <header className="w-52 bg-slate-500 hover:bg-slate-700 rounded-md my-2 p-4">
                        <h1 className="text-2xl font-bold w-full my-2">
                            {UpTask.studentName || 'Sin nombre'}
                        </h1>
                        <p className="text-black font-semibold my-1">Tarea ID: {UpTask.task_id}</p>
                        {UpTask.file ? (
                            UpTask.file.match(/.(jpg|jpeg|png|gif)$/i) ? (
                                <img src={UpTask.file} className="w-20 h-20 object-cover rounded-full my-2" />
                            ) : (
                                <p className="text-yellow-500">Para mostrar el trabajo, presiona el botón</p>
                            )
                        ) : null}
                        {UpTask.file && (
                            <a 
                                href={UpTask.file} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-blue-500 text-white px-4 py-2 rounded block text-center mt-2"
                            >
                                Ver Archivo
                            </a>
                        )}
                        {UpTask.qualification ? (
                            <p className="text-green-500 font-semibold">Calificación: {UpTask.qualification}</p>
                        ) : (
                            <>
                                <input
                                    type="number"
                                    placeholder="Calificación"
                                    className="my-2 p-1 rounded"
                                    onChange={(e) => (UpTask.qualification = e.target.value)}
                                />
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleGrade(UpTask.id, UpTask.qualification)}
                                >
                                    Calificar
                                </button>
                            </>
                        )}
                    </header>
                </tr>
            ))
        ) : (
            <p>No hay tareas enviadas para esta tarea.</p>
        )}
        </div>
      </div>
    );
  };

export default GradingTask;
