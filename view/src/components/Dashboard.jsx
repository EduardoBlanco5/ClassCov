import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, } from 'chart.js';

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
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color de las barras
        borderColor: 'rgba(75, 192, 192, 1)', // Color del borde
        borderWidth: 1,
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
    <div>
      {loading ? (
  <p>Cargando...</p>
) : error ? (
  <p>{error}</p>
) : (
  <>
    <h1>Dashboard de {dashboardData.studentName}</h1>

    <h2>Promedio por materia</h2>
    <Bar data={subjectData} options={{ responsive: true }} />

    <h2>Progreso de Tareas</h2>
    <Pie data={taskData} options={{ responsive: true }} />

    <h2>Asistencias</h2>
    <Bar data={attendanceData} options={{ responsive: true }} />

    <h2>Recomendaciones Educativas</h2>
    {dashboardData.recommendations && dashboardData.recommendations.length > 0 ? (
      dashboardData.recommendations.map((rec, index) => (
        <div key={index}>
          <h3>{rec.subject}</h3>
          <ul>
            {rec.resources.map((resource, i) => (
              <li key={i}><a href={resource} target="_blank" rel="noopener noreferrer">{resource}</a></li>
            ))}
          </ul>
        </div>
      ))
    ) : (
      <p>No hay recomendaciones disponibles.</p>
    )}
  </>
)}
    </div>
  );
};

export default Dashboard;