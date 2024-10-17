import { where } from 'sequelize'
import {studentsModel} from '../model/taskModel.js'
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

    body('guardian_id').isInt().withMessage('El codigo debe de contener solamente numeros'),

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
export const createStudent = [
    validateTask,
    async (req, res) => {
        try {
            const filePath = req.file ? `/${req.file.filename}` : null;
            // Encriptar la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);  // Encriptar la contraseña

            const studentsData = {
                ...req.body,
                password: hashedPassword,  // Reemplazar con la contraseña encriptada
                file: filePath 
            };
            await studentsModel.create(studentsData);
            res.json({ 'message': 'Alumno creado correctamente' });
        } catch (error) {
            console.error('Database Error:', error);
            res.json({ message: error.message });
        }
    }
];

//Mostrar todos R
export const getAllStudents = async (req, res) => {
    try {
        const students = await studentsModel.findAll()

        const studentsWithImages = students.map(student => ({
            ...student.dataValues,  // Usar dataValues para obtener los datos del modelo
            file: student.file ? `${req.protocol}://${req.get('host')}${student.file}` : null // URL completa

            
        }));

        res.json(studentsWithImages)
    } catch (error) {
        res.json({message: error.message})
    }
}

//Mostrar uno R
export const getStudent = async (req, res) => {
   
    try {
        const task = await studentsModel.findAll({
            where: {id: req.params.id}
        })
        res.json(task[0])
    } catch (error) {
        res.json({message: error.message})
    }
}

//Actualizar U

export const updateStudent = [
    
    async (req, res) => {
        try {
            const result = await studentsModel.update(req.body, {
                where: { id: req.params.id }
            });
            if (result[0] === 0) {
                return res.status(404).json({ message: 'Alumno no encontrado' });
            }
            res.json({ "message": "Alumno Actualizado con éxito" });
        } catch (error) {
            console.error('Database Error:', error);
            res.json({ message: error.message });
        }
    }
];

// D
export const deleteStudent = async (req, res) => {
    try {
        await studentsModel.destroy({
            where: {id: req.params.id}
        })
        res.json({'message': 'Alumno eliminado con exito'})
    } catch (error) {
        res.json({message: error.message})
    }
    
}

//Busqueda por id
export const getStudentsByClassId = async (req, res) => {
    const classId = req.query.class_id; // Obtener class_id de la query
    try {
        const students = await studentsModel.findAll({
            where: { class_id: classId } // Filtrar estudiantes por class_id
        });
        res.json(students);
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ message: error.message });
    }
};

//Busqueda por guardian_id
export const getStudentsByGuardianId = async (req, res) => {
    const guardianId = req.query.guardian_id; // Obtener class_id de la query
    try {
        const students = await studentsModel.findAll({
            where: { guardian_id: guardianId } // Filtrar estudiantes por class_id
        });
        res.json(students);
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ message: error.message });
    }
};