import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import moment from 'moment';
import 'react-toastify/dist/ReactToastify.css';

const URI_CLASSES = 'http://localhost:4000/class';
const URI_ATTENDANCES = 'http://localhost:4000/attendances';

function CreateAttendance() {
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const { id } = useParams(); // El id de la clase
    const navigate = useNavigate();

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
                toast.error(res.data.message); // Muestra el mensaje de error
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error al verificar asistencia:', error);
            toast.error('Hubo un problema al verificar la asistencia.');
            return false;
        }
    };
    
    const saveAttendance = async () => {
        setLoading(true);
        const canProceed = await checkAttendanceForToday();  // Verificación de la asistencia de hoy
        
        console.log("¿Se puede proceder?", canProceed); // Verifica si la asistencia se puede registrar
        
        if (!canProceed) {
            toast.error('No se puede registrar la asistencia, ya fue tomada hoy.');
            setLoading(false);
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
            <h2 className="text-2xl font-bold mb-4">Registrar asistencia</h2>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Nombre del Estudiante</th>
                        <th className="border border-gray-300 px-4 py-2">Presente</th>
                        <th className="border border-gray-300 px-4 py-2">Retardo</th>
                        <th className="border border-gray-300 px-4 py-2">Falta</th>
                        <th className="border border-gray-300 px-4 py-2">Notas</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.id}>
                            <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                                <input
                                    type="radio"
                                    name={`status-${student.id}`}
                                    value="Presente"
                                    onChange={() => handleStatusChange(student.id, 'Presente')}
                                />
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                                <input
                                    type="radio"
                                    name={`status-${student.id}`}
                                    value="Retardo"
                                    onChange={() => handleStatusChange(student.id, 'Retardo')}
                                />
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                                <input
                                    type="radio"
                                    name={`status-${student.id}`}
                                    value="Falta"
                                    onChange={() => handleStatusChange(student.id, 'Falta')}
                                />
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <input
                                    type="text"
                                    placeholder="Notas"
                                    className="w-full border border-gray-300 px-2 py-1"
                                    onChange={(e) => handleNotesChange(student.id, e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                className="bg-indigo-500 text-white px-4 py-2 mt-4 rounded hover:bg-indigo-600"
                onClick={saveAttendance}
                disabled={loading}
            >
                {loading ? 'Guardando...' : 'Guardar Asistencia'}
            </button>
        </div>
    );
}

export default CreateAttendance;