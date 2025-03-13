import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, } from 'chart.js';
import {Card, CardHeader, CardFooter, Image, Button, CardBody, Divider} from "@heroui/react";
import {Link} from "@heroui/react";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const Dashboard = () => {
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

  // Datos para el gráfico de tareas completadas
  const taskData = {
    labels: ['Tareas completadas', 'Tareas pendientes'],
    datasets: [
      {
        label: 'Progreso de tareas',
        data: [dashboardData.taskProgress.completedTasks, dashboardData.taskProgress.totalTasks - dashboardData.taskProgress.completedTasks],
        backgroundColor: ['#36A2EB', '#FF5733'],
      },
    ],
  };

  // Datos para el gráfico de barras de asistencias
  const attendanceData = {
    labels: ['Clases totales', 'Clases asistidas', 'Retardos', 'Faltas'],
    datasets: [
      {
        label: 'Total', 
        data: [dashboardData.attendance.totalClasses, dashboardData.attendance.Present, dashboardData.attendance.Delay, dashboardData.attendance.Fouled],
        backgroundColor: ['#FF8C00', '#4CAF50', '#ffff33', '#ff4633'],
        borderColor: ['#FF8C00', '#4CAF50', '#ffff33', '#ff4633'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className=' w-10/12 mx-auto '>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        
        <div className='w-full '>
          <div className='w-full flex justify-center'>
            <Card className=' w-1/2 text-center mt-3 bg-primary-500 shadow-none  rounded-t-md border-b-0'>
              <h1 className=' text-2xl mt-2 p-1 text-white '>Estadisticas de {dashboardData.studentName}</h1>
              <Divider className='h-1 rounded-full bg-primary-900'/>
            </Card>
          </div>
          <div className='flex flex-col'>

            <div className=' w-full my-4  '>
              <Card className='w-full'>
                <CardHeader className='bg-primary-900'>
                  <h2 className='text-primary-300 text-xl'>Recomendaciones Educativas</h2>
                </CardHeader>
                <CardBody className=' overflow-scroll'>
                  <div className=' grid grid-rows-1 grid-flow-col gap-4'>

                  
                    {dashboardData.recommendations && dashboardData.recommendations.length > 0 ? (
                      dashboardData.recommendations.map((rec, index) => (
                        <Card className='w-[300px]' key={index} >
                          <CardHeader className=' bg-auxColors-500 text-white'>
                            <h3>{rec.subject}</h3>
                          </CardHeader>
                          <CardBody>

                            <ul>
                              {rec.resources.map((resource, i) => (
                                <li key={i}>
                                        <Link isBlock showAnchorIcon color="secondary" target='_blank' href={resource}  >
                                          {resource}
                                        </Link>
                                  {/* <a href={resource} target="_blank" rel="noopener noreferrer">{resource}</a> */}
                                  </li>
                              ))}
                            </ul>
                          </CardBody>
                        </Card>
                      ))
                    ) : (
                      <p>No hay recomendaciones disponibles.</p>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>

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

            {/* progerso de tareas */}
            <div className='w-full flex  gap-2 my-5'>

              <Card className=' max-w-[400px] w-full h-[400px] ml-12 ' >
                <CardHeader className='w-full mx-auto '>
                  <div className='w-full flex justify-center '>
                    <Pie data={taskData} options={{ responsive: true }} />
                  </div>
                </CardHeader>
              </Card>
              <div className=' flex flex-col w-full mr-12 h-[400px] gap-2'>
                <Card className='w-full h-[300px]'>
                  
                  <Bar  data={taskData} options={{ responsive: true }} />
                </Card>
                <Card className=' h-[100px] w-[100%] bg-primary-400'>
                  <CardBody>
                    <div className='flex justify-around items-center h-full'>
                      <div className="flex flex-col justify-center items-center gap-1">
                        <p className="font-semibold text-primary-600 text-medium ">Completadas: </p>
                        <p className=" text-default-700 text-2xl ml-1"> {dashboardData.taskProgress.completedTasks}</p>
                      </div>
                      <div className="flex flex-col justify-center items-center gap-1">
                        <p className="font-semibold text-red-600 text-medium">Sin Completar: </p>
                        <p className="text-default-400 text-2xl ml-1"><span className={dashboardData.taskProgress.completedTasks > 0 ? "text-default-400":"text-red-700"}>
                        {dashboardData.taskProgress.totalTasks - dashboardData.taskProgress.completedTasks}
                          </span></p>
                      </div>
                    </div>
                    
                    
                  </CardBody>
                </Card>
              </div>
            </div>
              
              {/* Asistencias */}
              <div className=' w-full flex items-center gap-2 my-5 '>
                <Card className='w-1/3 h-[300px]'>
                  <CardHeader className='bg-primary-400 '>
                    <h2 className=' text-xl text-center mx-auto text-primary-600'>Asistencias</h2> 
                  </CardHeader>
                  <CardBody className=' overflow-scroll '>
                    {
                      
                      <div className=''>

                          <Card isBlurred radius='sm' className='bg-primary-600/50 border shadow-sm '>
                            <div className=' flex flex-col gap-5 h-full overflow-scroll'>

                              <div className=' flex justify-between gap-2 mx-3 my-2 '>
                                <h4 className='text-primary-600' >Clases totales</h4>
                                <p
                                className="text-secondary-100" 
                                >{dashboardData.attendance.totalClasses}</p>
                              </div>
                              
                            </div>
                            {/* dashboardData.attendance.totalClasses, dashboardData.attendance.Present, dashboardData.attendance.Delay, dashboardData.attendance.Fouled */}
                          </Card>
                          <Card isBlurred radius='sm' className='bg-primary-600/50 border shadow-sm mt-3'>
                            <div className=' flex justify-between gap-2 mx-3 my-2 '>
                              <h4 className='text-primary-600' >Clases Asistidas</h4>
                              <p
                              className="text-secondary-100" 
                              >{dashboardData.attendance.Present}</p>
                            </div>
                          </Card>
                          <Card isBlurred radius='sm' className='bg-primary-600/50 border shadow-sm mt-3 '>

                            <div className=' flex justify-between gap-2 mx-3 my-2 '>
                              <h4 className='text-primary-600' >Retardos</h4>
                              <p
                              className="text-secondary-100" 
                              >{dashboardData.attendance.Delay}</p>
                            </div>
                          </Card>
                        <Card isBlurred radius='sm' className='bg-primary-600/50 border shadow-sm mt-3'>

                          <div className=' flex justify-between gap-2 mx-3 my-2 '>
                            <h4 className='text-primary-600' >Faltas</h4>
                            <p
                            className="text-secondary-100" 
                            >{dashboardData.attendance.Fouled}</p>
                          </div>
                        </Card>

                      </div>
                      
                      
                    }
                    
                  </CardBody>
                </Card>
              <Card className='  w-full h-[300px] flex justify-center bg-primary-400/40 ' >
                  <div className=' w-[70%] h-[99%] mx-auto ' >
                    <Bar  data={attendanceData} options={{ responsive: true }} />
                  </div>
              </Card>
            </div>
            <div className='w-full flex items-center gap-2 my-5'>
      
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;