import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const URI_ATTENDANCES = 'http://localhost:4000/attendances';
const URI_STUDENTS = 'http://localhost:4000/student/';

function ShowAttendances() {
  const { id } = useParams(); // ID de la clase
  const [attendances, setAttendances] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [student_id, setStudent_id] = useState('');
  const [name, setName] = useState('')

  useEffect(() => {
    fetchAttendancesByClass();
  }, [id]);

  useEffect(() => {
    getStudentById(student_id);
  }, [student_id]);
  
  const getStudentById = async (student_id) => {

    const res = await axios.get(URI_STUDENTS + student_id);
    setName(res.data.name);
  };

  const fetchAttendancesByClass = async () => {
    try {
      const res = await axios.get(`${URI_ATTENDANCES}/class/${id}`);
      setAttendances(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener asistencias:', err);
      setError('No se pudieron cargar las asistencias.');
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando asistencias...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Asistencias por Clase</h2>
      {Object.keys(attendances).length === 0 ? (
        <p>No hay asistencias registradas para esta clase.</p>
      ) : (
        Object.entries(attendances).map(([date, records]) => (
          <div key={date} className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Fecha: {date}</h3>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Estudiante</th>
                  <th className="border border-gray-300 px-4 py-2">Estatus</th>
                  <th className="border border-gray-300 px-4 py-2">Notas</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td className="border border-gray-300 px-4 py-2">{record.student_name}</td>
                    <td className="border border-gray-300 px-4 py-2">{record.status}</td>
                    <td className="border border-gray-300 px-4 py-2">{record.notes || 'Sin notas'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}

export default ShowAttendances;