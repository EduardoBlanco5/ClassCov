import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, } from 'chart.js';
import {Card, CardHeader, CardFooter, Image, Button, CardBody, Divider} from "@heroui/react";
import {Link} from "@heroui/react";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

function dashProfile() {
    const { id } = useParams(); // Obtener el ID del estudiante de la URL
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/dashboard/${id}`);
            setDashboardData(response.data);
            setLoading(false);
        } catch (err) {
            setError('No se encontraron datos para este estudiante');
            setLoading(false);
        }
        };

        fetchDashboardData();
        console.log(id)
    }, [id]);

    if (loading) return <p>Cargando...</p>;

    if (error) return <p>{error}</p>;

    // Datos para el gráfico de barras de promedios por materia
    const subjectData = {
        labels: dashboardData.subjectAverages.map(subject => subject.subjectName),
        datasets: [
        {
            label: 'Promedio por materia',
            data: dashboardData.subjectAverages.map(subject => subject.averageGrade),
            backgroundColor: '#437118af', // Color de las barras
            borderColor: '#437118', // Color del borde
            
            borderWidth: 2,
        },
        ],
    };




    return (
        <div>
            {
                loading ? (<p>Cargando...</p>) :
                error ? (<p>{error}</p>) :
                (
                    <div>
                        <div className=' w-full flex items-center gap-2 my-5 '>
                            <Card className='w-1/3 h-[300px]'>
                                <CardHeader className='bg-primary-400 '>
                                <h2 className=' text-xl text-center mx-auto text-primary-600'>Promedio por materia</h2> 
                                </CardHeader>
                                <CardBody className='  overflow-scroll'>
                                <div>
                                {
                                dashboardData.subjectAverages.map((subjectItem,index) => {
                                    // console.log(subjectItem.subjectName + " " + subjectItem.averageGrade)
                                    return(
                                    

                                        <Card isBlurred radius='sm' className='bg-primary-600/50 border shadow-sm mt-2 '>
                                        <div className=' flex justify-between gap-2 mx-3 my-2 '>
                                            <h4 className='text-primary-600' key={index}>{subjectItem.subjectName}</h4>
                                            <p
                                            className={subjectItem.averageGrade < 6 ? "text-red-600":"text-secondary-100" }
                                            >{subjectItem.averageGrade}</p>
                                        </div>
                                        </Card>
                                        
                                    
                                    
                                    )
                                })
                                }
                                </div>
                                </CardBody>
                            </Card>
                            <Card className='  w-full h-[300px] flex justify-center bg-primary-400/40 ' >
                                <div className=' w-[70%] h-[99%] mx-auto ' >
                                    <Bar  data={subjectData} options={{ responsive: true }} />
                                </div>
                            </Card>
                            </div>
                    </div>
                )
            }
        </div>
    )
}

export default dashProfile