import axios from 'axios'
import { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from '../../components/AuthContext'; // Asegúrate de importar el contexto correcto.

const URIA = 'http://localhost:4000/announcements/'
function ClassAnnouncements() {

    const [announcements, setAnnouncemets] = useState([])
    const {id} = useParams()

    // Recuperar rol del usuario desde AuthContext o localStorage
    const { user } = useContext(AuthContext); // Si usas AuthContext
    const role = user?.role || localStorage.getItem('role'); // O usa localStorage como respaldo

    useEffect( () => {
        
        getAnnouncementsByClassId(id);
        
    },[id])

    const getAnnouncementsByClassId = async (classId) => {
        const res = await axios.get(`${URIA}class?class_id=${classId}`);
        setAnnouncemets(res.data); // Establecer solo los estudiantes de la clase actual
    };

  return (
    <div>
        <div className='bg-slate-500'>
            <h2 className="font-bold text-white text-2xl text-center mt-4">Anuncios:</h2>
            <ul className="mt-5 ">
                {announcements.map(announcement => (
                    <Link to={`/AnnouncementCard/${announcement.id}`}>
                        <li key={announcement.id} className="text-center">{announcement.title}</li> 
                    </Link>

                ))}
            </ul>

        </div>

        {/* Mostrar el botón solo si el rol es "Profesor" */}
        {role === 'teacher' && (
                <div className="text-center mt-4">
                    <Link to={`/CreateAnnouncements/${id}`}>
                        <button className="bg-green-700 rounded-md px-4 py-2 text-white">
                            Crear Anuncio
                        </button>
                    </Link>
                </div>
            )}
    </div>
  )
}

export default ClassAnnouncements