import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import moment from 'moment';
import 'react-toastify/dist/ReactToastify.css';
import {CircleCheckBig, CircleOff, NotepadText} from 'lucide-react'
import { Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Input} from '@heroui/react'


const URI_CLASSES = 'http://localhost:4000/class';
const URI_ATTENDANCES = 'http://localhost:4000/attendances';

function CreateAttendance() {
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const { id } = useParams(); // El id de la clase
    const navigate = useNavigate();

    const [isAttendanceTaken, setIsAttendanceTaken] = useState(false);

    useEffect(() => {
        getStudentsByClassId(id);
        checkAttendanceForToday();
        toast.info("Component Loaded!");
    }, [id]);

    const getStudentsByClassId = async (classId) => {
        try {
            const res = await axios.get(`${URI_CLASSES}/${classId}/students`);
            setStudents(res.data);
            // Inicializar la asistencia para cada estudiante como vacío
            const initialAttendance = {};
            res.data.forEach(student => {
                initialAttendance[student.id] = { status: '', notes: '' };
            });
            setAttendance(initialAttendance);
        } catch (error) {
            console.error('Error al obtener estudiantes:', error);
        }
    };

    const handleStatusChange = (studentId, status) => {
        setAttendance({
            ...attendance,
            [studentId]: {
                ...attendance[studentId],
                status
            }
        });
    };

    const handleNotesChange = (studentId, notes) => {
        setAttendance({
            ...attendance,
            [studentId]: {
                ...attendance[studentId],
                notes
            }
        });
    };
    const [loading, setLoading] = useState(false);

    const checkAttendanceForToday = async () => {
        try {
            const res = await axios.get(`${URI_ATTENDANCES}/check/${id}`);  // `id` es el class_id
            console.log("Respuesta de verificación de asistencia:", res.data); // Verifica lo que está devolviendo
            
            if (res.data.exists) {
                toast.error(res.data.message); // Muestra el mensaje de error en el frontend
                setIsAttendanceTaken(true);  // Asistencia ya tomada
                return false;
            }
            setIsAttendanceTaken(false); // No se ha tomado la asistencia
            return true;
        } catch (error) {
            console.error('Error al verificar asistencia:', error);
            toast.error('Hubo un problema al verificar la asistencia.');
            setIsAttendanceTaken(false); // Asistencia no tomada
            return false;
        }
    };
    
    const saveAttendance = async () => {
        setLoading(true);
    console.log("Estado de loading:", loading);  // Verifica que loading sea true cuando empieza
    
    const canProceed = await checkAttendanceForToday();  // Verificación de la asistencia de hoy
    
    console.log("¿Se puede proceder?", canProceed);  // Verifica si la asistencia se puede registrar
    
    if (!canProceed) {
        toast.error('No se puede registrar la asistencia, ya fue tomada hoy.');
        setLoading(false);  // Asegúrate de deshabilitar loading
        console.log("Estado de loading después de error:", loading);
        return;
    }
        
        // Continuar con la lógica de guardar...
        const attendanceData = Object.entries(attendance).map(([studentId, data]) => ({
            student_id: studentId,
            class_id: id,
            attendance_date: moment().format('YYYY-MM-DD'), // Solo fecha, sin hora
            status: data.status,
            notes: data.notes,
        }));
        
        try {
            console.log("Guardando asistencia...", attendanceData); // Verifica los datos a guardar
            for (const record of attendanceData) {
                await axios.post(URI_ATTENDANCES, record);
            }
            toast.success('Asistencia guardada correctamente');
            navigate(`/ClassCard/${id}`);
        } catch (error) {
            console.error('Error al guardar asistencia:', error);
            toast.error('Ocurrió un error al guardar la asistencia.');
        } finally {
            setLoading(false); // Asegúrate de desactivar el estado loading
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl text-secondary-800 border-b border-secondary-800 font-bold mb-4">Registrar asistencia</h2>
                {/* Mensaje dependiendo del estado de la asistencia */}
            <div>
                {isAttendanceTaken ? (
                    <div className="flex items-center bg-red-700/30 text-red-700 rounded-t-lg border-b border-primary-700 p-2 mb-5">
                        <CircleOff className="text-red-700 ml-5" />
                        <p className='mx-4'>
                            La asistencia ya fue tomada para hoy.
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center bg-primary-900/35 rounded-t-lg border-b border-primary-700 text-primary-700 p-2 mb-5">
                        <CircleCheckBig  className="text-green-700 ml-5" />
                        <p className='mx-4'>
                            Puedes tomar asistencia.
                        </p>
                    </div>
                )}
            </div>
            <div className='mb-4'>
                <Link to={`/ShowAttendances/${id}`}> 
                    <Button variant='bordered' color='secondary' className=' mx-2 px-1 hover:bg-auxColors-500 '>Ver asistencias</Button>
                </Link>
            </div>
            <Table 
            isHeaderSticky
            // selectionMode="single"
            
            classNames={{
                td:'hover:bg-primary-50 hover:duration-500 ',
                
            }}
            
            // 'base' | 'table' | 'thead' | 'tbody' | 'tfoot' | 'emptyWrapper' 
            // | 'loadingWrapper' | 'wrapper' | 'tr' | 'th' | 'td' | 'sortIcon', string
            className="table-auto w-full mb-6 hover:duration-500 rounded-3xl ">
                <TableHeader className='hover:duration-500'>
                    <TableColumn className='bg-primary-900'>Nombre del Estudiante</TableColumn>
                    <TableColumn className='bg-primary-900'>Presente</TableColumn>
                    <TableColumn className='bg-primary-900'>Retardo</TableColumn>
                    <TableColumn className='bg-primary-900'>Falta</TableColumn>
                    <TableColumn className='bg-primary-900'>Notas</TableColumn>

                </TableHeader>
                <TableBody>
                    {students.map(student => (
                        <TableRow key={student.id} className='hover:bg-primary-50 '>
                            <TableCell >{student.name}</TableCell>
                            <TableCell>
                                <Input variant='faded' color='success' type='radio' 
                                className=' '
                                name={`status-${student.id}`}
                                value="Presente"
                                onChange={() => handleStatusChange(student.id, 'Presente')}
                                />
                            </TableCell>
                            <TableCell>
                                <Input variant='faded' color='warning' type='radio'
                                name={`status-${student.id}`}
                                value="Retardo"
                                onChange={() => handleStatusChange(student.id, 'Retardo')}
                                />
                            </TableCell>
                            <TableCell>
                                <Input variant='faded' color='danger' type='radio'
                                name={`status-${student.id}`}
                                value="Falta"
                                onChange={() => handleStatusChange(student.id, 'Falta')}
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                className=' z-20'
                                isClearable
                                classNames={{
                                label: "text-black/50 ",
                                input: [
                                    "bg-transparent",
                                    "text-black/90 ",
                                    "placeholder:text-default-700/50 ",
                                ],
                                innerWrapper: "bg-transparent",
                                inputWrapper: [
                                    "shadow-xl",
                                    "bg-default-200/50",
                                    "backdrop-blur-xl",
                                    "backdrop-saturate-200",
                                    "hover:bg-default-200/70",
                                    "group-data-[focus=true]:bg-default-200/50",
                                    "!cursor-text",
                                ],
                                }}
                                label="Notas"
                                placeholder="Escribe tus notas"
                                radius="lg"
                                startContent={
                                <NotepadText className="text-black/50  dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                                }
                                
                            
                                onChange={(e) => handleNotesChange(student.id, e.target.value)}
                                />
                            </TableCell>
                            
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* Botón para guardar asistencia */}
            <button
            onClick={saveAttendance}
            disabled={loading || isAttendanceTaken} // Deshabilitar si ya se tomó asistencia o está cargando
            className={`w-full px-4 py-2 rounded-md text-white font-semibold ${
                isAttendanceTaken
                    ? 'bg-red-500 hover:bg-red-700 cursor-not-allowed '
                    : 'bg-green-500 hover:bg-green-700'
                }`}
            >
                {isAttendanceTaken ? 'Asistencia guardada' : 'Guardar asistencia'}
            </button>

        </div>
    );
}

export default CreateAttendance;