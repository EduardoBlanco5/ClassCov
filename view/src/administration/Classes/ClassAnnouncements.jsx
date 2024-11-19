import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from "react-router-dom"

const URIA = 'http://localhost:4000/announcements/'
function ClassAnnouncements() {

    const [announcements, setAnnouncemets] = useState([])
    const {id} = useParams()

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
    </div>
  )
}

export default ClassAnnouncements