import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../components/AuthContext';


const URI = 'http://localhost:4000/task/';
const UP_URI = 'http://localhost:4000/ShowUpTasks';

function GradingTask() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [file, setFile] = useState(null);

    const [upTasks, setUpTasks] = useState([]);
    
    const { user } = useContext(AuthContext);
    const student_id = localStorage.getItem('student_id');
    const role = user?.role || localStorage.getItem('role');
  
    useEffect(() => {
        getTaskById();

        getUpTask();
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

    const getUpTask = async () => {
        const res = await axios.get(UP_URI)
        if (Array.isArray(res.data)) {
            setUpTasks(res.data);
        } else {
            setUpTasks([]);
        }
    }
  

  
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
              
        </div>

        <div>
        {upTasks.map ((UpTask) => (
            
        
            <tr  key={UpTask.id} >
                  <header className="flex w-full bg-slate-500 hover:bg-slate-700 rounded-md my-2">
                        <h1 className="text-2xl font-bold w-full my-2 px-4 py-2">{UpTask.student_id}</h1>
                        <p className="text-black font-semibold my-1"> {UpTask.task_id}</p>
                        
                    </header>

                

                    
        
            </tr>
            
        ))}
        </div>
      </div>

    );
  };

export default GradingTask