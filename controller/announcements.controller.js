import { where } from 'sequelize'
import {announcementsModel, classModel, teachersModel} from '../model/taskModel.js'
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
    body('title').notEmpty().withMessage('El titulo es obligatorio')
        .custom(containsReservedWords).withMessage('La descripción contiene palabras reservadas o caracteres no permitidos'),
    
    body('content').notEmpty().withMessage('El contenido es obligatorio')
        .custom(containsReservedWords).withMessage('La descripción contiene palabras reservadas o caracteres no permitidos'),

    body('teacher_id').notEmpty().withMessage('El id del Profesor es obligatorio')
    .custom(containsReservedWords).withMessage('La descripción contiene palabras reservadas o caracteres no permitidos'),

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
export const createAnnouncement = [
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

            const filePath = req.file ? `/${req.file.filename}` : null;
            const announcementData = {
                ...req.body,
                file: filePath || '',
            };
            await announcementsModel.create(announcementData);
            res.json({ 'message': 'Anuncio creado correctamente' });
        } catch (error) {
            console.error('Database Error:', error);
            res.json({ message: error.message });
        }
    }
];

//Mostrar todos R
export const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await announcementsModel.findAll()
        const announcementsWithImages = announcements.map(announcement => ({
            ...announcement.dataValues,  // Usar dataValues para obtener los datos del modelo
            file: announcement.file ? `${req.protocol}://${req.get('host')}${announcement.file}` : null // URL completa

            
        }));

        res.json(announcementsWithImages);

    } catch (error) {
        res.json({message: error.message})
    }
}

//Mostrar uno R
export const getAnnouncement = async (req, res) => {
   
    try {
        const announcements = await announcementsModel.findAll({
            where: {id: req.params.id}
        })
        const announcementsWithImages = announcements.map(announcement => ({
            ...announcement.dataValues,  // Usar dataValues para obtener los datos del modelo
            file: announcement.file ? `${req.protocol}://${req.get('host')}${announcement.file}` : null // URL completa

            
        }));

        res.json(announcementsWithImages[0])
    } catch (error) {
        res.json({message: error.message})
    }
}

//Actualizar U

export const updateAnnouncement = [
    
    async (req, res) => {
        try {
            const filePath = req.file ? `/${req.file.filename}` : null;
     
            
            const announcementData = {
                ...req.body,
                file: filePath || '',
            };
            const result = await announcementsModel.update(announcementData, {
                where: { id: req.params.id }
            });



            if (result[0] === 0) {
                return res.status(404).json({ message: 'Anuncio no encontrado' });
            }
            res.json({ "message": "Anuncio Actualizado con éxito" });
        } catch (error) {
            console.error('Database Error:', error);
            res.json({ message: error.message });
        }
    }
];

// D
export const deleteAnnouncement = async (req, res) => {
    try {
        await announcementsModel.destroy({
            where: {id: req.params.id}
        })
        res.json({'message': 'Anuncio eliminado con exito'})
    } catch (error) {
        res.json({message: error.message})
    }
    
}

//Busqueda por id
export const getAnnouncementsByClassId = async (req, res) => {
    const classId = req.query.class_id; // Obtener class_id de la query
    try {
        const announcement = await announcementsModel.findAll({
            where: { class_id: classId } // Filtrar estudiantes por class_id
        });
        res.json(announcement);
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ message: error.message });
    }
};