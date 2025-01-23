import { where } from 'sequelize'
import {taskModel, classModel, teachersModel, upTasksModel, studentsModel, guardiansModel, students_classesModel} from '../model/taskModel.js'
import { body, validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { sendEmail } from '../middleware/emailService.js';

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
const validateTask = [
    body('title')
        .notEmpty().withMessage('El título es obligatorio')
        .custom(containsReservedWords).withMessage('El título contiene palabras reservadas o caracteres no permitidos'),
    body('description')
        .notEmpty().withMessage('La descripción es obligatoria')
        .custom(containsReservedWords).withMessage('La descripción contiene palabras reservadas o caracteres no permitidos'),
    body('deliveryDate')
        .isISO8601().withMessage('La fecha de entrega debe ser una fecha válida'),
    body('class_id')
        .notEmpty().withMessage('El ID de la clase es obligatorio')
        .isInt().withMessage('El ID de la clase debe ser un número'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('Validation Errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];



// C
export const createTask = [
    validateTask,
    async (req, res) => {
        try {
            const { title, description, class_id, teacher_id } = req.body;

            // Verificar que la clase y el profesor existan
            const classExists = await classModel.findByPk(class_id);
            if (!classExists) {
                return res.status(400).json({ message: 'La clase especificada no existe.' });
            }

            const teacher = await teachersModel.findByPk(teacher_id);
            if (!teacher) {
                return res.status(400).json({ message: 'El profesor especificado no existe.' });
            }

            // Crear la tarea
            const filePath = req.file ? `/${req.file.filename}` : '';
            const taskData = {
                ...req.body,
                file: filePath || '',
            };

            const task = await taskModel.create(taskData);

            const { grade, salon } = classExists;

         

            // Obtener correos electrónicos de estudiantes y tutores de la clase
            const students = await students_classesModel.findAll({
                where: { class_id },
                include: [
                    {
                        model: studentsModel,
                        as: 'student',
                        attributes: ['email', 'guardian_id'],
                    },
                ],
            });

            const guardianIds = students.map((s) => s.student.guardian_id);
            const guardians = await guardiansModel.findAll({
                where: { id: guardianIds },
                attributes: ['email'],
            });



            const studentEmails = students.map((s) => s.student.email);
            const guardianEmails = guardians.map((g) => g.email);
            
            const recipients = [...studentEmails, ...guardianEmails]; // Combinar los correos

            // Enviar correos
            const subject = `Nueva Tarea: ${title}`;
            const text = `Hola, se ha publicado una nueva tarea para la clase ${grade} ${salon}.\n\nTítulo: ${title}\nDescripción: ${description}\nFecha de entrega: ${req.body.deliveryDate}`;
            const emailPromises = recipients.map((email) =>
                sendEmail(email, subject, text, teacher.email, teacher.name) // Pasar nombre y correo del profesor
            );

            await Promise.all(emailPromises);

            res.json({ message: 'Tarea creada y correos enviados' });
        } catch (error) {
            console.error('Error al crear tarea:', error);
            res.status(500).json({ message: 'Error al crear tarea', error });
        }
    },
];


//Mostrar todos R
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await taskModel.findAll()
        const tasksWithImages = tasks.map(task => ({
            ...task.dataValues,  // Usar dataValues para obtener los datos del modelo
            file: task.file ? `${req.protocol}://${req.get('host')}${task.file}` : null // URL completa

            
        }));
        res.json(tasksWithImages)
    } catch (error) {
        res.json({message: error.message})
    }
}

//Mostrar uno R
export const getTask = async (req, res) => {
   
    try {
        const tasks = await taskModel.findAll({
            where: {id: req.params.id}
        })
        const tasksWithImages = tasks.map(task => ({
            ...task.dataValues,  // Usar dataValues para obtener los datos del modelo
            file: task.file ? `${req.protocol}://${req.get('host')}${task.file}` : null // URL completa

            
        }));

        res.json(tasksWithImages[0])
    } catch (error) {
        res.json({message: error.message})
    }
}

//Actualizar U

export const updateTask = [
    
    async (req, res) => {
        try {
            const result = await taskModel.update(req.body, {
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
export const deleteTask = async (req, res) => {
    try {
        await taskModel.destroy({
            where: {id: req.params.id}
        })
        res.json({'message': 'Tarea eliminada con exito'})
    } catch (error) {
        res.json({message: error.message})
    }
    
}

//Busqueda por id
export const getTasksByClassId = async (req, res) => {
    const { class_id, student_id } = req.query;

    console.log("Parámetros recibidos:", { class_id, student_id });

    if (!class_id || !student_id) {
        return res.status(400).json({ message: "class_id y student_id son obligatorios" });
    }

    try {
        const tasks = await taskModel.findAll({ where: { class_id } });
        const upTasks = await upTasksModel.findAll({ where: { student_id } });
        const deliveredTaskIds = upTasks.map((task) => task.task_id);

        const tasksWithStatus = tasks.map((task) => ({
            ...task.dataValues,
            isDelivered: deliveredTaskIds.includes(task.id),
        }));

        res.json(tasksWithStatus);
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

//Busqueda por id
export const getTasksByClassIdAdmin = async (req, res) => {
    const { class_id } = req.query;

    console.log("Parámetros recibidos:", { class_id });

    if (!class_id) {
        return res.status(400).json({ message: "class_id es obligatorio" });
    }

    try {
        // Obtener todas las tareas asociadas a la clase
        const tasks = await taskModel.findAll({ where: { class_id } });

        // Añadir URL completa para los archivos si existen
        const tasksWithImages = tasks.map(task => ({
            ...task.dataValues,  // Usar dataValues para extraer los datos
            file: task.file ? `${req.protocol}://${req.get('host')}${task.file}` : null,
        }));

        // Devolver todas las tareas
        res.json(tasksWithImages);
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener tareas por subject_id
export const getTasksBySubjectId = async (req, res) => {
    const { subject_id } = req.query;

    if (!subject_id) {
        return res.status(400).json({ message: "El subject_id es obligatorio." });
    }

    try {
        const tasks = await taskModel.findAll({
            where: { subject_id },
            attributes: ['id', 'title', 'description', 'deliveryDate', 'file'],
        });

        const tasksWithFiles = tasks.map(task => ({
            ...task.dataValues,
            file: task.file ? `${req.protocol}://${req.get('host')}${task.file}` : null, // Construir la URL del archivo
        }));

        res.json(tasksWithFiles);
    } catch (error) {
        console.error("Error al obtener tareas:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};