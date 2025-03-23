import axios from 'axios'
import { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from '../../components/AuthContext'; // Asegúrate de importar el contexto correcto.

import { Divider, Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    RadioGroup,
    Radio, 
    Button} from '@heroui/react'

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
    <div className='w-full'>
        {/* con algunos estilos */}
        <div className='w-10/12 mx-auto'>
            <h2 className="font-bold text-secondary-200 text-2xl text-center mt-4">Anuncios:</h2>
            <Divider className='mt-5'/>
            <div className='flex flex-col gap-3 w-10/12 mx-auto mt-4'>
                <Table
                    aria-label="tabla alumnos"
                    selectionMode="single"
                    color='secondary'
                    classNames={{
                        wrapper:"bg-white/70 " ,
                        th:"bg-primary-200/90 text-white",
                        td: "hover:bg-primary-200 rounded-lg"
                    }}
                >
                    <TableHeader>
                    <TableColumn>Anuncios</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {announcements.map(announcement => (
                            <TableRow key={announcement.id}>
                                <TableCell>
                                    <Link to={`/AnnouncementCard/${announcement.id}`} > 
                                    <div className=' w-full' key={announcement.id}>
                                    {announcement.title}
                                    </div>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                
            </div>
            {/* <ul className="mt-5 ">
                {announcements.map(announcement => (
                    <Link to={`/AnnouncementCard/${announcement.id}`}>
                        <li key={announcement.id} className="text-center">{announcement.title}</li> 
                    </Link>

                ))}
            </ul> */}

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