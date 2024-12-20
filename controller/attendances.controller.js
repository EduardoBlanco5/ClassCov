import { where } from 'sequelize'
import {classModel, attendancesModel, studentsModel} from '../model/taskModel.js'
import { body, validationResult } from 'express-validator';
import moment from 'moment';

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
    body('status')
        .notEmpty().withMessage('El estatus es obligatorio')
        .custom(containsReservedWords).withMessage('El título contiene palabras reservadas o caracteres no permitidos'),
    body('student_id')
        .notEmpty().withMessage('El estudiante es obligatorio')
        .custom(containsReservedWords).withMessage('El título contiene palabras reservadas o caracteres no permitidos'),
    body('class_id')
        .notEmpty().withMessage('El salon es obligatorio')
        .custom(containsReservedWords).withMessage('La descripción contiene palabras reservadas o caracteres no permitidos'),

    body('attendance_date')
        .notEmpty().withMessage('La fecha es obligatoria')
        .custom(containsReservedWords).withMessage('El título contiene palabras reservadas o caracteres no permitidos'),

    
    
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
export const createAttendance = [
    validateTask,
    async (req, res) => {
        try {
            await attendancesModel.create(req.body);
            res.json({ 'message': 'Asistencia creada correctamente' });
        } catch (error) {
            console.error('Database Error:', error);
            res.json({ message: error.message });
        }
    }
];

//Mostrar todos R
export const getAllAttendances = async (req, res) => {
    try {
        const tasks = await attendancesModel.findAll()
        res.json(tasks)
    } catch (error) {
        res.json({message: error.message})
    }
}

//Mostrar uno R
export const getAttendance = async (req, res) => {
   
    try {
        const task = await attendancesModel.findAll({
            where: {id: req.params.id}
        })
        res.json(task[0])
    } catch (error) {
        res.json({message: error.message})
    }
}


//Actualizar U

export const updateAttendance = [
    
    async (req, res) => {
        try {
            const result = await attendancesModel.update(req.body, {
                where: { id: req.params.id }
            });
            if (!result[0] === 0) {
                return res.status(404).json({ message: 'Asistencia no encontrada' });
            }
            res.json({ "message": "Clase Actualizada con éxito" });
        } catch (error) {
            console.error('Database Error:', error);
            res.json({ message: error.message });
        }
    }
];

// D
export const deleteAttendance = async (req, res) => {
    try {
        await attendancesModel.destroy({
            where: {id: req.params.id}
        })
        res.json({'message': 'Asistencia eliminada con exito'})
    } catch (error) {
        res.json({message: error.message})
    }
    
}

export const getAttendanceByDate = async (req, res) => {
    const { date } = req.params;
    const today = moment().startOf('day');
    const selectedDate = moment(date).startOf('day'); // Fecha seleccionada
    
    if (selectedDate.isBefore(today)) {
      // Si la fecha es pasada, solo mostrar asistencias sin permitir modificaciones
      try {
        const attendances = await attendancesModel.findAll({
          where: {
            attendance_date: selectedDate
          }
        });
        res.json({ attendances, canModify: false });
      } catch (error) {
        res.json({ message: error.message });
      }
    } else if (selectedDate.isSame(today)) {
      // Si la fecha es hoy, permitir marcar asistencia
      try {
        const attendances = await attendancesModel.findAll({
          where: {
            attendance_date: selectedDate
          }
        });
        res.json({ attendances, canModify: true });
      } catch (error) {
        res.json({ message: error.message });
      }
    } else {
      // Si la fecha es futura, no permitir agregar o modificar asistencia
      res.json({ message: "No se puede registrar asistencia para una fecha futura", canModify: false });
    }
  };
