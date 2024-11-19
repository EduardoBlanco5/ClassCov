import { where } from 'sequelize'
import {taskModel, classModel, teachersModel} from '../model/taskModel.js'
import { body, validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

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
    body('qualification')
        .isInt({ min: 0, max: 10 }).withMessage('La calificación debe ser un número entre 0 y 10'),
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

             // Verificar si el teacher_id existe
             const teacherExists = await teachersModel.findByPk(req.body.teacher_id);
             if (!teacherExists) {
                 return res.status(400).json({ message: 'El profesor especificado no existe.' });
             }

            const classExists = await classModel.findByPk(req.body.class_id);
            if (!classExists) {
                return res.status(400).json({ message: 'La clase especificada no existe.' });
            }
            
            const filePath = req.file ? `/${req.file.filename}` : '';

            const taskData = {
                ...req.body,
                file: filePath || '',
            };

            await taskModel.create(taskData);
            res.json({ 'message': 'Tarea creada correctamente' });
        } catch (error) {
            console.error('Database Error:', error);
            res.json({ message: error.message });
        }
    }
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
        const task = await taskModel.findAll({
            where: {id: req.params.id}
        })
        res.json(task[0])
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
    const classId = req.query.class_id; // Obtener class_id de la query
    try {
        const tasks = await taskModel.findAll({
            where: { class_id: classId } // Filtrar estudiantes por class_id
        });
        res.json(tasks);
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ message: error.message });
    }
};