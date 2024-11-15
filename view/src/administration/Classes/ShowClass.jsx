import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const URIC = 'http://localhost:4000/classes';
const URIT = 'http://localhost:4000/classes/teacher/';
const URIS = 'http://localhost:4000/student/';//obtener clases del estudiante

function ShowClass() {
    const [salons, setSalon] = useState([]);
    const teacherId = localStorage.getItem('teacher_id');
    const studentId = localStorage.getItem('student_id'); // Obtener `student_id` del localStorage
    const role = localStorage.getItem("role");

    useEffect(() => {
        if (role === "teacher" && teacherId) {
            getClassesByTeacher(teacherId);
        } else if (role === "admin") {
            getClassesAdmins();
        } else if (role === "student" && studentId) {
            getClassesByStudent(studentId); // Llamada para estudiantes
        } else {
            console.error("No se encontró un role válido o ID en localStorage.");
        }
    }, [teacherId, studentId, role]);

    const getClassesAdmins = async () => {
        try {
            const res = await axios.get(URIC);
            if (Array.isArray(res.data)) {
                setSalon(res.data);
            } else {
                setSalon([]);
            }
        } catch (error) {
            console.error("Error al obtener todas las clases:", error);
        }
    };

    const getClassesByTeacher = async (teacherId) => {
        try {
            const res = await axios.get(`${URIT}${teacherId}`);
            if (Array.isArray(res.data)) {
                setSalon(res.data);
            } else {
                setSalon([]);
            }
        } catch (error) {
            console.error("Error al obtener las clases del profesor:", error);
        }
    };

    const getClassesByStudent = async (studentId) => {
        try {
            const res = await axios.get(`${URIS}${studentId}/classes`);
            if (Array.isArray(res.data)) {
                setSalon(res.data);
            } else {
                setSalon([]);
            }
        } catch (error) {
            console.error("Error al obtener las clases del estudiante:", error);
        }
    };

    if (salons.length === 0) {
        return (
            <Link to={'/CreateClass'}>
                <h1>No hay clases asignadas</h1>
                <button className='bg-blue-600 text-black font-bold rounded-md hover:bg-blue-800 px-3'>Crear Clase</button>
            </Link>
        );
    }

    return (
        <>
            {role === "admin" && (
                <Link to={'/CreateClass'}>
                    <button className='bg-blue-600 text-black font-bold rounded-md hover:bg-blue-800 px-3'>Crear Clase</button>
                </Link>
            )}

            <div className="max-w-md w-full p-10 rounded-md my-2 px-4 py-2">
                {salons.map((salon) => (
                    <tr key={salon.id}>
                        <Link to={`/ClassCard/${salon.id}`}>
                            <header className="flex w-full bg-slate-500 hover:bg-slate-700 rounded-md my-2">
                                <h1 className="text-2xl font-bold w-full my-2 px-4 py-2">
                                    {salon.grade} {salon.salon}
                                </h1>
                                <div className="w-full px-4 py-2 my-2">
                                    <p className="text-black font-semibold">{salon.shift}</p>
                                    {role === "admin" && (
                                        <Link to={`/UpdateClass/${salon.id}`}>
                                            <button className="bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded-md">
                                                Actualizar
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </header>
                        </Link>
                    </tr>
                ))}
            </div>
        </>
    );
}

export default ShowClass;