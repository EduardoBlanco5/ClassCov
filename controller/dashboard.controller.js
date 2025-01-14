import { Op } from 'sequelize';
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
        const attendedClasses = attendanceData.filter(record => record.status === 'Presente').length;
        const attendanceRate =
            totalClasses > 0 ? ((attendedClasses / totalClasses) * 100).toFixed(2) : null;

        // Estructurar los datos para el dashboard
        const dashboardData = {
            studentName: student.name,
            subjectAverages: subjectAverages.map(subject => ({
                subjectName: subject.subject.name,
                averageGrade: subject.average_grade,
            })),
            //Hay que cambiar un poco esto para obtener todas las tareas y separar promedios
            taskProgress: {
                totalTasks,
                completedTasks,
                overallAverage,
            },
            //Aquí dividió las clases y saco un promedio, hay que modificar el promedio de asistencias
            attendance: {
                totalClasses,
                attendedClasses,
                attendanceRate,
            },
        };

        res.json(dashboardData);
    } catch (error) {
        console.error('Error al obtener los datos del dashboard:', error);
        res.status(500).json({ message: 'Error al obtener los datos del dashboard.' });
    }
};