import { Op } from 'sequelize';
import axios from 'axios';
import { 
    studentsModel, students_subjectsModel, upTasksModel, attendancesModel, 
    subjectsModel, students_classesModel 
} from '../model/taskModel.js';
import express from 'express';

const router = express.Router();

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

        const overallAverageData = await students_classesModel.findOne({
            where: { student_id },
            attributes: ['overall_average'],
        });

        const totalTasks = taskProgress.length;
        const completedTasks = taskProgress.filter(task => task.qualification !== null).length;
        const overallAverage = overallAverageData ? overallAverageData.overall_average : null;

        // Obtener asistencias
        const attendanceData = await attendancesModel.findAll({
            where: { student_id },
            attributes: ['status'],
        });

        const totalClasses = attendanceData.length;
        const Present = attendanceData.filter(record => record.status === 'Presente').length;
        const Delay = attendanceData.filter(record => record.status === 'Retardo').length;
        const Fouled = attendanceData.filter(record => record.status === 'Falta').length;

        const attendanceRate = totalClasses > 0 ? ((Present / totalClasses) * 100).toFixed(2) : null;

        

        // Estructurar los datos para el dashboard
        const dashboardData = {
            studentName: student.name,
            subjectAverages: formattedSubjects,
            taskProgress: {
                totalTasks,
                completedTasks,
                overallAverage,
            },
            attendance: {
                totalClasses,
                Present,
                Delay,
                Fouled,
                attendanceRate,
            },
            
        };

        res.json(dashboardData);
    } catch (error) {
        console.error('Error al obtener los datos del dashboard:', error);
        res.status(500).json({ message: 'Error al obtener los datos del dashboard.' });
    }
};

// Nueva ruta para analizar texto con NLP
router.post('/analyze-text', async (req, res) => {
    try {
        const { text } = req.body;
        const response = await axios.post('http://127.0.0.1:5001/predict_help', { text });

        res.json(response.data);
    } catch (error) {
        console.error('Error en la solicitud a Flask:', error);
        res.status(500).json({ error: 'Error al procesar el texto' });
    }
});

export default router;
