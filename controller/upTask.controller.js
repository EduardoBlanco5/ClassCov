import { where } from 'sequelize'
import {taskModel, classModel, guardiansModel, students_subjectsModel, upTasksModel, studentsModel} from '../model/taskModel.js'
import { body, validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { sendEmailTask, sendEmail } from '../middleware/emailService.js';
import { Op } from 'sequelize';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista de palabras reservadas y caracteres sospechosos
const reservedWords = ['SELECT', 'INSERT', 'DELETE', 'UPDATE', 'DROP', 'ALTER', 'TRUNCATE'];
const specialCharacters = ['--', ';', '/*', '*/', '"', "'"];

// Función para validar entradas contra palabras reservadas y caracteres especiales
const containsReservedWords = (value) => {

    // Verificar si la entrada contiene alguna de las palabras reservadas
    const wordsMatch = reservedWords.some(word => new RegExp(`\\b${word}\\b`, 'i').test(value));
    // Verificar si la entrada contiene caracteres especiales
    const charsMatch = specialCharacters.some(char => value.includes(char));
    return !(wordsMatch || charsMatch);
};

// Middleware de validación para las tareas



// C
export const createUpTask = async (req, res) => {
    try {
        // Verificar que el archivo y los campos necesarios estén presentes
        if (!req.file) {
            return res.status(400).json({ message: 'No se recibió ningún archivo.' });
        }

        const { task_id, student_id } = req.body;

        if (!task_id || !student_id) {
            return res.status(400).json({ message: 'Faltan datos obligatorios (task_id, student_id).' });
        }

        // Validar si la tarea existe en la base de datos
        const taskExists = await taskModel.findByPk(task_id);
        if (!taskExists) {
            return res.status(400).json({ message: 'La tarea especificada no existe.' });
        }

        // Crear el registro en la base de datos para la tarea subida
        const filePath = req.file ? `/${req.file.filename}` : null;

        const upTaskData = {
            ...req.body,
            file: filePath || '',
        };
        await upTasksModel.create(upTaskData);

        // Obtener el estudiante y su tutor (guardian)
        const student = await studentsModel.findByPk(student_id);
        if (!student) {
            return res.status(400).json({ message: 'El estudiante especificado no existe.' });
        }

        // Obtener el tutor (guardian) del estudiante
        const guardian = await guardiansModel.findByPk(student.guardian_id);
        if (!guardian) {
            return res.status(400).json({ message: 'No se encontró tutor para este estudiante.' });
        }

        // Enviar el correo al tutor
        const subject = `El estudiante ${student.name} ha subido una tarea`;
        const text = `Hola, \n\nEl estudiante ${student.name} ha subido un archivo para la tarea: ${taskExists.title}.\n\nArchivo: ${filePath || 'No se adjuntó ningún archivo'}\n\nSaludos, \nSistema de Tareas`;

        await sendEmailTask(guardian.email, subject, text, 'no-reply@tusistema.com', 'Sistema de Tareas');

        res.status(201).json({ message: 'Archivo subido y correo enviado al tutor correctamente.' });
    } catch (error) {
        console.error('Error en el controlador createUpTask:', error);
        res.status(500).json({ message: 'Error al registrar la tarea.' });
    }
};


//Mostrar todos R
export const getAllUpTasks = async (req, res) => {
    try {
        const tasks = await upTasksModel.findAll({
            include: [
                {
                    model: studentsModel, // Modelo relacionado
                    as: 'student', // Alias definido en las asociaciones
                    attributes: ['name'], // Campos que queremos incluir
                },
            ],
        });

        // Mapear los datos para incluir la URL del archivo
        const tasksWithImages = tasks.map((task) => ({
            ...task.dataValues,
            studentName: task.student?.name || 'Sin nombre', // Obtener el nombre del estudiante o un valor predeterminado
            file: task.file ? `${req.protocol}://${req.get('host')}${task.file}` : null, // URL completa del archivo
        }));

        res.json(tasksWithImages);
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
        res.status(500).json({ message: 'Error al obtener las tareas.' });
    }
};

//Mostrar uno R
export const getUpTask = async (req, res) => {
   
    try {
        const task = await upTasksModel.findAll({
            where: {id: req.params.id}
        })
        res.json(task[0])
    } catch (error) {
        res.json({message: error.message})
    }
}

//Actualizar U

export const updateUpTask = [
    
    async (req, res) => {
        try {
            const result = await upTasksModel.update(req.body, {
                where: { id: req.params.id }
            });
            if (result[0] === 0) {
                return res.status(404).json({ message: 'Tarea no encontrada' });
            }
            res.json({ "message": "Tarea Actualizada con éxito" });
        } catch (error) {
            console.error('Database Error:', error);
            res.json({ message: error.message });
        }
    }
];

// D
export const deleteUpTask = async (req, res) => {
    try {
        await upTasksModel.destroy({
            where: {id: req.params.id}
        })
        res.json({'message': 'Tarea eliminada con exito'})
    } catch (error) {
        res.json({message: error.message})
    }
    
}

//Busqueda por id

export const getUpTaskByStudentAndTask = async (req, res) => {
    try {
        const { task_id, student_id } = req.query; // Obtenemos parámetros de la consulta
        const upTasks = await upTasksModel.findAll({
            where: { task_id, student_id }
        });
        const upTasksWithImages = upTasks.map(upTask => ({
            ...upTask.dataValues,  // Usar dataValues para obtener los datos del modelo
            file: upTask.file ? `${req.protocol}://${req.get('host')}${upTask.file}` : null // URL completa

            
        }));

        res.json(upTasksWithImages[0])
    } catch (error) {
        console.error('Error al obtener la tarea:', error);
        res.status(500).json({ message: 'Error al buscar la tarea.' });
    }
};

export const getPendingTasksByStudent = async (req, res) => {
    const { class_id, student_id } = req.query;

    if (!class_id || !student_id) {
        return res.status(400).json({ error: 'class_id y student_id son requeridos' });
    }

    try {
        const pendingTasks = await tasks.findAll({
            where: { class_id, status: 'pending' },
            include: [
                {
                    model: upTasksModel,
                    where: { student_id },
                },
            ],
        });

        res.json(pendingTasks);
    } catch (error) {
        console.error('Error al obtener tareas pendientes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getTasksAndSubmissions = async (req, res) => {
    const { class_id, teacher_id } = req.query;

    if (!class_id || !teacher_id) {
        return res.status(400).json({ message: 'class_id y teacher_id son obligatorios' });
    }

    try {
        // Obtener las tareas asignadas por el profesor
        const tasks = await taskModel.findAll({
            where: { class_id, teacher_id },
            include: [
                {
                    model: upTasksModel,
                    as: 'upTasks', // Debe coincidir con el alias en la asociación
                    include: [
                    {
                        model: studentsModel,
                        as: 'student', // Debe coincidir con el alias en la asociación
                        attributes: ['id', 'name'], // Obtener solo los campos necesarios
                    },
                ],
            },
        ],
    });

        res.json(tasks);
    } catch (error) {
        console.error('Error al obtener tareas y entregas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const getUpTasksByTaskId = async (req, res) => {
    try {
        const { task_id } = req.params; // Obtener el ID de la tarea desde los parámetros
        const upTasks = await upTasksModel.findAll({
            where: { task_id },
            include: [
                {
                    model: studentsModel,
                    as: 'student',
                    attributes: ['name'], // Traer solo el nombre del estudiante
                },
            ],
        });

        const upTasksWithImages = upTasks.map((task) => ({
            ...task.dataValues,
            studentName: task.student?.name || 'Sin nombre',
            file: task.file ? `${req.protocol}://${req.get('host')}${task.file}` : null,
        }));

        res.json(upTasksWithImages);
    } catch (error) {
        console.error('Error al obtener las tareas enviadas:', error);
        res.status(500).json({ message: 'Error al obtener las tareas enviadas.' });
    }
};

export const gradeUpTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { qualification } = req.body;

        if (!qualification) {
            return res.status(400).json({ message: 'La calificación es obligatoria.' });
        }

        // Actualizar calificación de la tarea
        const task = await upTasksModel.findByPk(id, {
            include: { model: taskModel, as: 'task' },
        });
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada.' });
        }
        

        task.qualification = parseFloat(qualification); // Guardar calificación como número
        await task.save();

        // Obtener el student_id y subject_id de la tarea
        const { student_id, subject_id } = task;
        const title = task.task?.title || 'Sin título'; // Obtener el título de la tarea o usar un valor predeterminado

        console.log(`Student ID: ${student_id}, Subject ID: ${subject_id}`);

        // Obtener las tareas entregadas por el alumno con calificación
        const deliveredTasks = await upTasksModel.findAll({
            where: {
                student_id,
                subject_id,
                qualification: { [Op.ne]: null }, // Filtrar solo las tareas con calificación
            },
        });

        console.log(`Delivered tasks by the student: ${deliveredTasks.length}`);
        console.log('Delivered tasks details:', deliveredTasks);

        if (deliveredTasks.length === 0) {
            return res.status(400).json({ message: 'El estudiante no ha entregado tareas con calificación.' });
        }

        // Sumar las calificaciones de las tareas entregadas
        const totalQualifications = deliveredTasks.reduce((acc, task) => {
            const qual = parseFloat(task.qualification); // Convertir a número
            if (!isNaN(qual)) {
                return acc + qual; // Solo sumar si la calificación es un número válido
            }
            return acc; // Si la calificación no es válida, no sumar
        }, 0);

        console.log(`Total qualifications: ${totalQualifications}`);

        // Calcular el promedio basado solo en las tareas entregadas y calificadas
        const averageGrade = totalQualifications / deliveredTasks.length;

        console.log(`Calculated average grade: ${averageGrade}`);

        // Actualizar o crear el registro en students_subjects
        const [studentSubject] = await students_subjectsModel.findOrCreate({
            where: { student_id, subject_id },
            defaults: { average_grade: averageGrade },
        });

        if (!studentSubject.isNewRecord) {
            studentSubject.average_grade = averageGrade;
            await studentSubject.save();
        }

        const student = await studentsModel.findByPk(student_id);
        if (!student) {
            return res.status(400).json({ message: 'El estudiante especificado no existe.' });
        }

        // Obtener el tutor (guardian) del estudiante
        const guardian = await guardiansModel.findByPk(student.guardian_id);
        if (!guardian) {
            return res.status(400).json({ message: 'No se encontró tutor para este estudiante.' });
        }

        // Crear un array de destinatarios
        const recipients = [student.email, guardian.email].filter(email => email); // Excluir valores nulos o vacíos

        // Enviar el correo al tutor y al estudiante
        const subject = `Tarea ${title} ha sido calificada`;
        const text = `Hola, \n\nLa calificación de la tarea ${title} es: ${qualification}\n\nSaludos, \nSistema de Tareas`;

        await sendEmail(recipients.join(','), subject, text, 'no-reply@tusistema.com', 'Sistema de Tareas');

        res.status(200).json({ message: 'Calificación y promedio actualizados correctamente.' });
    } catch (error) {
        console.error('Error al calificar la tarea:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};