import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {Button,
    Card, CardBody, Image, Slider, Form,
    CardHeader, Select, SelectItem,
    Divider, Avatar,
    CardFooter} from "@heroui/react";

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
    const images = [
        './utils/brand.jpg',
        './utils/cuaderno.jpg',
        './utils/lapices.jpg'
    
    ]
       // Estado para manejar la imagen seleccionada
    const [selectedImage, setSelectedImage] = useState('');

    // Función para seleccionar una imagen aleatoriamente
    const getRandomImage = () => {
        const randomIndex = Math.floor(Math.random() * images.length); // Genera un índice aleatorio
        setSelectedImage(images[randomIndex]); // Establece la imagen aleatoria
        
    };

    return (
        <>
            {role === "admin" && (
                <Link to={'/CreateSubject'}>
                    
                    <Button
                    variant='bordered'
                    className=" border-primary-600 bg-primary-600/70 text-white 
                    hover:bg-primary-600 hover:duration-500 hover:scale-110 mt-3 ml-5
                    ">
                        Crear Materia
                    </Button>
                </Link>
            )}

            <div className="  w-full p-10 rounded-md my-2 px-4 py-2">
                <div className="w-11/12  mx-auto grid grid-flow-row grid-cols-3 gap-3 ">
                
                    {subjects.map((subject) => (
                        <Card key={subject.id} >

                            <Link to={`/SubjectCard/${subject.id}`}>
                            <CardHeader className=' bg-primary-900'>
                                <h1 className="text-2xl font-bold w-full my-2 px-4 py-2">
                                    {subject.name} 
                                </h1>
                            </CardHeader>
                            <CardFooter className=' bg-primary-300'>
                                <div className="w-full px-4 py-2 my-2">
                                    
                                    {role === "admin" && (
                                        <Link to={`/UpdatedSubject/${subject.id}`}>
                                            <Button variant='bordered' 
                                            className=" border-auxColors-350 text-auxColors-350 
                                            hover:duration-500 hover:bg-auxColors-350/70 hover:text-white ">
                                                Actualizar
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </CardFooter>

                            </Link>

                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}

export default ShowSubjects;