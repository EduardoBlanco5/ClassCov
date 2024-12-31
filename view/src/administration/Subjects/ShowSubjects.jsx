import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const URIS = 'http://localhost:4000/subjects';
const URIT = 'http://localhost:4000/classes/teacher/';
const URISt = 'http://localhost:4000/student/';//obtener clases del estudiante

function ShowSubjects() {
    const [subjects, setSubjects] = useState([]);
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
            const res = await axios.get(URIS);
            if (Array.isArray(res.data)) {
                setSubjects(res.data);
            } else {
                setSubjects([]);
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

    return (
        <>
            {role === "admin" && (
                <Link to={'/CreateSubject'}>
                    <button className='bg-blue-600 text-black font-bold rounded-md hover:bg-blue-800 px-3'>Crear Materia</button>
                </Link>
            )}

            <div className="max-w-md w-full p-10 rounded-md my-2 px-4 py-2">
                {subjects.map((subject) => (
                    <tr key={subject.id}>
                        <Link to={`/SubjectCard/${subject.id}`}>
                            <header className="flex w-full bg-slate-500 hover:bg-slate-700 rounded-md my-2">
                                <h1 className="text-2xl font-bold w-full my-2 px-4 py-2">
                                    {subject.name} 
                                </h1>
                                <div className="w-full px-4 py-2 my-2">
                                    
                                    {role === "admin" && (
                                        <Link to={`/UpdatedSubject/${subject.id}`}>
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

export default ShowSubjects;