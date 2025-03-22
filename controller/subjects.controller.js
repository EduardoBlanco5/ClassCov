import { where } from 'sequelize'
import {subjectsModel} from '../model/taskModel.js'
import { body, validationResult } from 'express-validator';

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
    body('name')
        .notEmpty().withMessage('El grado es obligatorio')
        .custom(containsReservedWords).withMessage('El Nombre contiene palabras reservadas o caracteres no permitidos'),
    body('description')
        .notEmpty().withMessage('La descripcion es obligatorio')
        .custom(containsReservedWords).withMessage('La descripción contiene palabras reservadas o caracteres no permitidos'),


    
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('Validation Errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateUpdateTask = [
    body('teacher_id')
        .notEmpty().withMessage('El ID del profesor es obligatorio')
        .custom(containsReservedWords).withMessage('El ID contiene palabras reservadas o caracteres no permitidos'),
    // Agregar validaciones para otros campos solo si están presentes en la solicitud
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
export const createSubject = [
    validateTask,
    async (req, res) => {
        try {
            await subjectsModel.create(req.body);
            res.json({ 'message': 'Materia creada correctamente' });
        } catch (error) {
            console.error('Database Error:', error);
            res.json({ message: error.message });
        }
    }
];

//Mostrar todos R
export const getAllSubjects = async (req, res) => {
    try {
        const tasks = await subjectsModel.findAll()
        res.json(tasks)
    } catch (error) {
        res.json({message: error.message})
    }
}

//Mostrar uno R
export const getSubject = async (req, res) => {
   
    try {
        const task = await subjectsModel.findAll({
            where: {id: req.params.id}
        })
        res.json(task[0])
    } catch (error) {
        res.json({message: error.message})
    }
}

//Actualizar U

export const updateSubject = [
    
    async (req, res) => {
        try {
            const result = await subjectsModel.update(req.body, {
                where: { id: req.params.id }
            });
            if (!result[0] === 0) {
                return res.status(404).json({ message: 'Materia no encontrada' });
            }
            res.json({ "message": "Materia Actualizada con éxito" });
        } catch (error) {
            console.error('Database Error:', error);
            res.json({ message: error.message });
        }
    }
];

// D
export const deleteSubject = async (req, res) => {
    try {
        await subjectsModel.destroy({
            where: {id: req.params.id}
        })
        res.json({'message': 'Materia eliminada con exito'})
    } catch (error) {
        res.json({message: error.message})
    }
    
}