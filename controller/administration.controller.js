import { where } from 'sequelize'
import {administrationModel} from '../model/taskModel.js'
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
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
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio')
        .custom(containsReservedWords).withMessage('El título contiene palabras reservadas o caracteres no permitidos'),
    body('email')
        .notEmpty().withMessage('El email es obligatorio')
        .custom(containsReservedWords).withMessage('La descripción contiene palabras reservadas o caracteres no permitidos'),

    body('phone').isInt().withMessage('El telefono debe de contener solamente 10 numeros'),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .custom(containsReservedWords).withMessage('El título contiene palabras reservadas o caracteres no permitidos'),

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
export const createAdmin = [
    validateTask,
    async (req, res) => {
        try {
            const filePath = req.file ? `/${req.file.filename}` : null;
             // Encriptar la contraseña
             const salt = await bcrypt.genSalt(10);
             const hashedPassword = await bcrypt.hash(req.body.password, salt);  // Encriptar la contraseña

             
            const adminData = {
                ...req.body,
                password: hashedPassword,  // Reemplazar con la contraseña encriptada
                file: filePath 
            };
            await administrationModel.create(adminData);
            res.json({ 'message': 'Administrador creado correctamente' });
        } catch (error) {
            console.error('Database Error:', error);
            res.json({ message: error.message });
        }
    }
    ];
    
//Mostrar todos R
export const getAllAdmin = async (req, res) => {
    try {
        const admins = await administrationModel.findAll();

        // Modificar la respuesta para incluir la URL completa de la imagen
        const adminsWithImages = admins.map(admin => ({
            ...admin.dataValues,  // Usar dataValues para obtener los datos del modelo
            file: admin.file ? `${req.protocol}://${req.get('host')}${admin.file}` : null // URL completa

            
        }));

        res.json(adminsWithImages);

    } catch (error) {
        res.json({ message: error.message });
    }
}

//Mostrar uno R
export const getAdmin = async (req, res) => {
   
    try {
        const admins = await administrationModel.findAll({
            where: {id: req.params.id}
        })
        const adminsWithImages = admins.map(admin => ({
            ...admin.dataValues,  // Usar dataValues para obtener los datos del modelo
            file: admin.file ? `${req.protocol}://${req.get('host')}${admin.file}` : null // URL completa

            
        }));

        res.json(adminsWithImages[0])
    } catch (error) {
        res.json({message: error.message})
    }
}

//Actualizar U

export const updateAdmin = [
    
    async (req, res) => {
        try {
            // Obtener el registro existente para verificar la foto actual
             const admin = await guardiansModel.findOne({ where: { id: req.params.id } });
             if (!admin) {
                 return res.status(404).json({ message: "Admin no encontrado" });
             }
             // Si hay un archivo nuevo, usarlo; de lo contrario, conservar el actual
             const filePath = req.file ? `/${req.file.filename}` : admin.file;
             
            // Encriptar la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);  // Encriptar la contraseña
            
            const adminData = {
                ...req.body,
                password: hashedPassword,  // Reemplazar con la contraseña encriptada
                file: filePath 
            };
            const result = await administrationModel.update(adminData, {
                where: { id: req.params.id }
            });



            if (result[0] === 0) {
                return res.status(404).json({ message: 'Administrador no encontrado' });
            }
            res.json({ "message": "Admin Actualizado con éxito" });
        } catch (error) {
            console.error('Database Error:', error);
            res.json({ message: error.message });
        }
    }
];

// D
export const deleteAdmin = async (req, res) => {
    try {
        await administrationModel.destroy({
            where: {id: req.params.id}
        })
        res.json({'message': 'Administrador eliminado con exito'})
    } catch (error) {
        res.json({message: error.message})
    }
    
}
