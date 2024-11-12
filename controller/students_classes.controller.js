import { where } from 'sequelize'
import {students_classesModel, studentsModel} from '../model/taskModel.js'
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
    body('student_id')
        .notEmpty().withMessage('El id del estudiante es obligatorio')
        .custom(containsReservedWords).withMessage('El título contiene palabras reservadas o caracteres no permitidos'),
    body('class_id')
        .notEmpty().withMessage('El id de la clase es obligatorio')
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



// C
export const createStudentClass = [
    validateTask,
    async (req, res) => {
        try {
            await students_classesModel.create(req.body);
            res.json({ 'message': 'Alumno creado correctamente' });
        } catch (error) {
            console.error('Database Error:', error);
            res.json({ message: error.message });
        }
    }
];

//Mostrar todos R
export const getAllStudentClass = async (req, res) => {
    try {
        const tasks = await students_classesModel.findAll()
        res.json(tasks)
    } catch (error) {
        res.json({message: error.message})
    }
}

//Mostrar uno R
export const getStudentClass = async (req, res) => {
   
    try {
        const task = await students_classesModel.findOne({
          where: { id: req.params.id },
        });
        if (!task) {
          return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json(task);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };

    // Endpoint para obtener estudiantes por clase
    export const getStudentsByClass = async (req, res) => {
      try {
          const classId = req.params.class_id;
          
          // Consulta para obtener estudiantes asociados a una clase específica
          const students = await students_classesModel.findAll({
              where: { class_id: classId },
              include: [
                  {
                      model: studentsModel,
                      attributes: ['id', 'name'], // Traer solo el ID y el nombre del estudiante
                  }
              ],
          });
  
          // Formatea los datos para extraer solo los detalles del estudiante
          const studentDetails = students.map(record => record.student);
  
          res.json(studentDetails);
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error al obtener los estudiantes de la clase' });
      }
  };

//Actualizar U

export const updateStudentClass = [
    validateTask,
    async (req, res) => {
      try {
        const result = await students_classesModel.update(req.body, {
          where: { id: req.params.id },
        });
        if (!result[0]) {
          return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json({ message: 'Registro actualizado con éxito' });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  ];

// D
export const deleteStudentClass = async (req, res) => {
    try {
        await students_classesModel.destroy({
            where: {id: req.params.id}
        })
        res.json({'message': 'Alumno eliminada con exito'})
    } catch (error) {
        res.json({message: error.message})
    }
    
}