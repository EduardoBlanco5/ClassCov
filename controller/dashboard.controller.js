import { Op } from 'sequelize';
import axios from 'axios';
import { studentsModel, students_subjectsModel, upTasksModel, attendancesModel, subjectsModel, students_classesModel } from '../model/taskModel.js';

export const getDashboardData = async (req, res) => {
    const { student_id } = req.params; // ID del estudiante para el que se quiere el dashboard

    try {
        // Validar que el estudiante existe
        const student = await studentsModel.findByPk(student_id);
        if (!student) {
            return res.status(404).json({ message: 'Estudiante no encontrado.' });
        }

        // Obtener el promedio general del estudiante por materia
        const subjectAverages = await students_subjectsModel.findAll({
            where: { student_id },
            include: [{ model: subjectsModel, as: 'subject', attributes: ['name'] }],
            attributes: ['average_grade'],
        });

        // Obtener el progreso de tareas entregadas
        const taskProgress = await upTasksModel.findAll({
            where: { student_id },
            attributes: ['qualification'],
        });
        // Obtener el progreso de tareas entregadas
        const overallAverage = await students_classesModel.findAll({
            where: { student_id },
            attributes: ['overall_average'],
        });

        const totalTasks = taskProgress.length;
        const completedTasks = taskProgress.filter(task => task.qualification !== null).length;
        

        // Obtener asistencias
        const attendanceData = await attendancesModel.findAll({
            where: { student_id },
            attributes: ['status'], // Asegúrate de que "status" indica presente/ausente
        });

        const totalClasses = attendanceData.length;
        const Present = attendanceData.filter(record => record.status === 'Presente').length;
        const Delay = attendanceData.filter(record => record.status === 'Retardo').length;
        const Fouled = attendanceData.filter(record => record.status === 'Falta').length;

        const attendanceRate =
            totalClasses > 0 ? ((Present / totalClasses) * 100).toFixed(2) : null;

             // Solicitar recomendaciones al servidor Flask
             const flaskResponse = await axios.post('http://127.0.0.1:5001/recommend', {
                student_id,
                subject_averages: subjectAverages.map(subject => ({
                    subjectName: subject.subject.name,
                    averageGrade: subject.average_grade,  // Esta clave debería ser 'averageGrade'
                })),
            });

        // Estructurar los datos para el dashboard
        const dashboardData = {
            studentName: student.name,
            subjectAverages: subjectAverages.map(subject => ({
                subjectName: subject.subject.name,
                averageGrade: subject.average_grade,
            })),
            taskProgress: {
                totalTasks,
                completedTasks,
                overallAverage: overallAverage ? overallAverage.overall_average : null,
            },
            attendance: {
                totalClasses,
                Present,
                Delay,
                Fouled,
                attendanceRate,
            },
            recommendations: flaskResponse.data.recommendations,  // Esta parte debería funcionar bien
        };

        res.json(dashboardData);
    } catch (error) {
        console.error('Error al obtener los datos del dashboard:', error);
        res.status(500).json({ message: 'Error al obtener los datos del dashboard.' });
    }
};