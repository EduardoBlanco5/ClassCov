import { where } from 'sequelize'
import {students_subjectsModel, upTasksModel} from '../model/taskModel.js'

export const gradeTask = async (req, res) => {
    const { taskId } = req.params;
    const { qualification } = req.body;

    try {
        // Actualizar la calificación de la tarea
        const task = await upTasksModel.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Tarea no encontrada.' });
        }

        task.qualification = qualification;
        await task.save();

        // Obtener student_id y subject_id de la tarea
        const { student_id, subject_id } = task;

        // Calcular el promedio actual
        const tasks = await upTasksModel.findAll({
            where: { student_id, subject_id },
        });

        const totalQualifications = tasks.reduce(
            (acc, task) => acc + (task.qualification || 0),
            0
        );
        const averageGrade = totalQualifications / tasks.length;

        // Actualizar o crear el registro en students_subjects
        const [studentSubject] = await students_subjectsModel.findOrCreate({
            where: { student_id, subject_id },
            defaults: { average_grade: averageGrade },
        });

        if (!studentSubject.isNewRecord) {
            studentSubject.average_grade = averageGrade;
            await studentSubject.save();
        }

        res.status(200).json({ message: 'Calificación y promedio actualizados.' });
    } catch (error) {
        console.error('Error al calificar tarea:', error);
        res.status(500).json({ error: 'Error al calificar tarea.' });
    }
};