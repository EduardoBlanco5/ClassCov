import { where } from 'sequelize'
import {taskModel, classModel, teachersModel, upTasksModel, students_classesModel} from '../model/taskModel.js'
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



// C
export const createUpTask = async (req, res) => {
    try {
      // Verificar que el archivo y los campos necesarios estén presentes
      if (!req.file) {
        return res.status(400).json({ message: 'No se recibió ningún archivo.' });
      }
  
      const { task_id, student_id} = req.body;
  
      if (!task_id || !student_id) {
        return res.status(400).json({ message: 'Faltan datos obligatorios (task_id, student_id o class_id).' });
      }
  
      // Validar si la tarea existe en la base de datos
      const taskExists = await taskModel.findByPk(task_id);
      if (!taskExists) {
        return res.status(400).json({ message: 'La tarea especificada no existe.' });
      }
  
  
      // Crear el registro en la base de datos
      const filePath = req.file ? `/${req.file.filename}` : null;


      const upTaskData = {
                ...req.body,
                file: filePath || '',
            };
            await upTasksModel.create(upTaskData);
  
      res.status(201).json({ message: 'Archivo subido y tarea registrada correctamente.', filePath });
    } catch (error) {
      console.error('Error en el controlador createUpTask:', error);
      res.status(500).json({ message: 'Error al registrar la tarea.' });
    }
  };


//Mostrar todos R
export const getAllUpTasks = async (req, res) => {
    try {
        const tasks = await upTasksModel.findAll()
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
export const getUpTasksByClassId = async (req, res) => {
    const classId = req.query.class_id; // Obtener class_id de la query
    try {
        const tasks = await upTasksModel.findAll({
            where: { class_id: classId } // Filtrar Tareas por class_id
        });
        res.json(tasks);
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getUpTaskByStudentAndTask = async (req, res) => {
    try {
        const { task_id, student_id } = req.query; // Obtenemos parámetros de la consulta
        const task = await upTasksModel.findOne({
            where: { task_id, student_id }
        });
        if (!task) {
            return res.status(404).json({ message: 'No se encontró la tarea enviada.' });
        }
        res.json(task);
    } catch (error) {
        console.error('Error al obtener la tarea:', error);
        res.status(500).json({ message: 'Error al buscar la tarea.' });
    }
};