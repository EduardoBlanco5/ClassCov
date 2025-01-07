import { where } from 'sequelize'
import {classModel, attendancesModel, studentsModel} from '../model/taskModel.js'
import { body, validationResult } from 'express-validator';
import moment from 'moment';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';


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
  
    try {
      const attendances = await attendancesModel.findAll({
        where: {
          attendance_date: selectedDate
        }
      });
  
      // Transformar para devolver solo `dataValues`
      const formattedAttendances = attendances.map(attendance => attendance.get({ plain: true }));
  
      if (selectedDate.isBefore(today)) {
        return res.json({ attendances: formattedAttendances, canModify: false });
      } else if (selectedDate.isSame(today)) {
        return res.json({ attendances: formattedAttendances, canModify: true });
      } else {
        return res.json({ message: "No se puede registrar asistencia para una fecha futura", canModify: false });
      }
    } catch (error) {
      console.error('Error al obtener asistencias:', error);
      return res.status(500).json({ message: error.message });
    }
  };

  export const checkAttendanceForToday = async (req, res) => {
    const { class_id } = req.params;

    // Obtener la fecha de hoy sin la parte de la hora
    const today = moment().format('YYYY-MM-DD'); // Solo fecha, sin hora
    console.log(`Hoy: ${today}`); // Verifica la fecha

    try {
        // Buscar asistencia para la clase de hoy, filtrando por class_id y por la fecha
        const attendance = await attendancesModel.findOne({
            where: {
                class_id: class_id, // Filtra por la clase específica
                // Usamos DATE() para asegurar que solo se compara la fecha sin la hora
                attendance_date: Sequelize.where(Sequelize.fn('DATE', Sequelize.col('attendance_date')), '=', today)
            },
        });

        console.log("Asistencia encontrada:", attendance); // Verifica si hay asistencia

        if (attendance) {
            return res.json({ exists: true, message: 'Ya se tomó asistencia para esta clase hoy.' });
        }

        res.json({ exists: false });
    } catch (error) {
        console.error('Error al verificar asistencia:', error);
        res.status(500).json({ message: 'Error al verificar asistencia.' });
    }
};

export const getAttendancesByClass = async (req, res) => {
    const { class_id } = req.params;

    try {
        // Incluir la relación con el modelo 'studentsModel' usando 'include'
        const attendances = await attendancesModel.findAll({
            where: { class_id: class_id },
            include: [
                {
                    model: studentsModel,
                    as: 'student', // Asegúrate de usar el alias correcto
                    attributes: ['id', 'name'], // Solo obtenemos el 'id' y 'name' del estudiante
                }
            ],
            order: [['attendance_date', 'DESC']],
        });

        // Agrupar por fecha
        const groupedAttendances = attendances.reduce((acc, attendance) => {
            const date = moment(attendance.attendance_date).format('YYYY-MM-DD');
            if (!acc[date]) acc[date] = [];
            
            // Reemplazar el 'student_id' por 'name' en los registros
            const attendanceData = attendance.get({ plain: true });
            attendanceData.student_name = attendanceData.student.name; // Agregar el nombre del estudiante
            delete attendanceData.student; // Eliminar el objeto 'student' para no enviarlo de forma redundante

            acc[date].push(attendanceData); // Solo los datos relevantes
            return acc;
        }, {});

        res.json(groupedAttendances);
    } catch (error) {
        console.error('Error al obtener asistencias por clase:', error);
        res.status(500).json({ message: error.message });
    }
};