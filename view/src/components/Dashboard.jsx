import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement);

const Dashboard = () => {
  const { id } = useParams();
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

  const subjectData = {
    labels: dashboardData.subjectAverages.map(subject => subject.subjectName),
    datasets: [
      {
        label: 'Promedio por materia',
        data: dashboardData.subjectAverages.map(subject => subject.averageGrade),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{dashboardData.studentName}</h1>

      {/* Sección con las recomendaciones y el gráfico del promedio */}
      <div className="flex flex-col lg:flex-row mb-8 space-y-4 lg:space-y-0 lg:space-x-6">
        <div className="flex-1">
          <h2 className="bg-gradient-to-r from-green-400 via-yellow-500 to-red-500 text-white p-2 rounded-md w-72 text-center">Recomendaciones Educativas</h2>
          {dashboardData.recommendations && dashboardData.recommendations.length > 0 ? (
            dashboardData.recommendations.map((rec, index) => (
              <div key={index} className="mt-4">
                <h3 className="text-lg font-semibold">{rec.subject}</h3>
                <ul className="list-disc pl-6 mt-2">
                  {rec.resources.map((resource, i) => (
                    <li key={i}><a href={resource} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">{resource}</a></li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No hay recomendaciones disponibles.</p>
          )}
        </div>

        {/* Gráfico del promedio por materia */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Promedio por materia</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Bar data={subjectData} options={{ responsive: true }} />
          </div>
        </div>
      </div>

      {/* Gráfico de progreso de tareas */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Progreso de Tareas</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Pie data={taskData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Gráfico de asistencias */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Asistencias</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Bar data={attendanceData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
