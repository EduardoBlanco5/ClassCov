import { where } from 'sequelize'
import {teachersModel} from '../model/taskModel.js'
import { body, validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

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
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio')
        .custom(containsReservedWords).withMessage('El título contiene palabras reservadas o caracteres no permitidos'),
    body('email')
        .notEmpty().withMessage('El email es obligatorio')
        .custom(containsReservedWords).withMessage('La descripción contiene palabras reservadas o caracteres no permitidos'),
    body('hire_date')
        .isISO8601().withMessage('La fecha de contrato debe ser una fecha válida'),

    body('phone').isInt().withMessage('El telefono debe de contener solamente 10 numeros'),

    body('date_of_birth')
        .isISO8601().withMessage('La fecha de nacimiento debe ser una fecha válida'),
    
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
export const createTeacher = [
    validateTask,
    async (req, res) => {
        try {
            const filePath = req.file ? `/${req.file.filename}` : null;
            const salt = await bcrypt.genSalt(10);
             const hashedPassword = await bcrypt.hash(req.body.password, salt);  // Encriptar la contraseña

            const teacherData = {
                ...req.body,
                password: hashedPassword, 
                file: filePath 
            };
            await teachersModel.create(teacherData);
            res.json({ 'message': 'Profesor creado correctamente' });
        } catch (error) {
            console.error('Database Error:', error);
            res.json({ message: error.message });
        }
    }
];

//Mostrar todos R
export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await teachersModel.findAll()
        const teachersWithImages = teachers.map(teacher => ({
            ...teacher.dataValues,  // Usar dataValues para obtener los datos del modelo
            file: teacher.file ? `${req.protocol}://${req.get('host')}${teacher.file}` : null // URL completa

            
        }));
        res.json(teachersWithImages)
    } catch (error) {
        res.json({message: error.message})
    }
}

//Mostrar uno R
export const getTeacher = async (req, res) => {
   
    try {
        const teachers = await teachersModel.findAll({
            where: {id: req.params.id}
        })
        const teachersWithImages = teachers.map(teacher => ({
            ...teacher.dataValues,  // Usar dataValues para obtener los datos del modelo
            file: teacher.file ? `${req.protocol}://${req.get('host')}${teacher.file}` : null // URL completa

            
        }));
        res.json(teachersWithImages[0])
    } catch (error) {
        res.json({message: error.message})
    }
}

//Actualizar U

export const updateTeacher = [
    
    async (req, res) => {
        try {
            const filePath = req.file ? `/${req.file.filename}` : null;
            // Encriptar la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);  // Encriptar la contraseña
            
            const teacherData = {
                ...req.body,
                password: hashedPassword,  // Reemplazar con la contraseña encriptada
                file: filePath 
            };
            const result = await teachersModel.update(teacherData, {
                where: { id: req.params.id }
            });



            if (result[0] === 0) {
                return res.status(404).json({ message: 'Profesor no encontrado' });
            }
            res.json({ "message": "Profesor Actualizado con éxito" });
        } catch (error) {
            console.error('Database Error:', error);
            res.json({ message: error.message });
        }
    }
];

// D
export const deleteTeacher = async (req, res) => {
    try {
        await teachersModel.destroy({
            where: {id: req.params.id}
        })
        res.json({'message': 'Profesor eliminado con exito'})
    } catch (error) {
        res.json({message: error.message})
    }
    
}