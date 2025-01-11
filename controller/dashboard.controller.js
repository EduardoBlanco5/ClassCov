import { Op } from 'sequelize';
import { studentsModel, students_subjectsModel, upTasksModel, attendancesModel, subjectsModel } from '../model/taskModel.js';

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

        const totalTasks = taskProgress.length;
        const completedTasks = taskProgress.filter(task => task.qualification !== null).length;
        const averageGrade =
            totalTasks > 0
                ? (
                      taskProgress.reduce((sum, task) => sum + (task.qualification || 0), 0) /
                      completedTasks
                  ).toFixed(2)
                : null;

        // Obtener asistencias
        const attendanceData = await attendancesModel.findAll({
            where: { student_id },
            attributes: ['status'], // Asegúrate de que "status" indica presente/ausente
        });

        const totalClasses = attendanceData.length;
        const attendedClasses = attendanceData.filter(record => record.status === 'present').length;
        const attendanceRate =
            totalClasses > 0 ? ((attendedClasses / totalClasses) * 100).toFixed(2) : null;

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
                averageGrade,
            },
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