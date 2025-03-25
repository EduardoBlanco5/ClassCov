import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


import {Card, CardBody, CardFooter, Image, Button} from "@heroui/react";


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
                <Button className=' my-6 ml-6 bg-primary-600 
                    text-white hover:text-black 
                    rounded-md hover:bg-primary-900 hover:scale-110 
                    duration-500 px-6'>Crear Clase</Button>
            </Link>
        );
    }
    

    return (
        <div className=''>

            <>
                {role === "admin" && (
                    <Link to={'/CreateClass'}>
                        <Button className=' my-6 ml-6 bg-primary-600 
                        text-white hover:text-black 
                        rounded-md hover:bg-primary-900 hover:scale-110 
                        duration-500 px-6'>Crear Clase</Button>
                    </Link>
                )}

                <div className="gap-2 grid auto-cols-auto sm:grid-cols-4 mt-10 mx-12">
                    {/* {getRandomImage()} */}
                    {salons.map((salon) => (
                        <Card key={salon.id} className=' w-full h-full ' isPressable shadow="sm" >
                            
                            <CardBody className="overflow-visible p-0 h-[200px] md:h-[150px]">
                                <Link className=' h-full' to={`/ClassCard/${salon.id}`}>
                                
                                    <header className={`flex flex-col r w-full h-full  bg-[url('./utils/lapices.webp')] bg-cover bg-center `} >
                                        <h1 className=" justify-center text-2xl font-bold w-full my-2 px-4 py-2">
                                            {salon.grade + salon.salon}
                                        </h1>
                                        <div className="w-full px-4 py-2 my-2 flex justify-center">
                                            <p className="text-black font-semibold">{salon.shift}</p>
                                        </div>
                                    </header>
                                
                                </Link>
                            </CardBody>
                            <CardFooter className=' flex justify-end'>

                                    {role === "admin" && (
                                        <Link className='' to={`/UpdateClass/${salon.id}`}>
                                            <Button color='warning' className=" text-white px-2 py-2 ">
                                                Actualizar
                                            </Button>
                                        </Link>
                                    )}
                            </CardFooter>
                            
                        </Card>
                        )
                    )}
                </div>
                
            </>
        </div>
    );
}

export default ShowClass;