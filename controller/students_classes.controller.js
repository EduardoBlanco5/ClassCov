import { where } from 'sequelize'
import {students_classesModel, studentsModel, classModel} from '../model/taskModel.js'
import { body, validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import xlsx from 'xlsx';


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


  //Para obtener las clases de los estudiantes
  export const getClassesByStudent = async (req, res) => {
    try {
        const studentId = req.params.student_id;
        
        // Consulta para obtener las clases asociadas a un estudiante específico
        const studentClasses = await students_classesModel.findAll({
            where: { student_id: studentId },
            include: [
                {
                    model: classModel, // Asegúrate de que `ClassModel` esté definido y sea el modelo de la clase
                    attributes: ['id', 'grade', 'salon', 'shift'], // Ajusta estos atributos según los que necesites mostrar
                }
            ],
        });

        // Formatea los datos para extraer solo los detalles de la clase
        const classDetails = studentClasses.map(record => record.class);

        res.json(classDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las clases del estudiante' });
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

// Subir archivo Excel
export const uploadStudentClassExcel = async (req, res) => {
    try {
        // Verificar si se subió un archivo
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ningún archivo' });
        }

        // Leer el archivo Excel
        const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];  // Usar la primera hoja del Excel
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);  // Convertir a JSON

        // Recorrer los datos y guardar cada tutor en la base de datos
        for (let studentClass of data) {
            console.log('Datos del studentClass:', studentClass);

             // Buscar el tutor en la base de datos
            const student = await studentsModel.findOne({ where: { email: studentClass.student_email } });

            if (!student) {
                console.error(`El correo del estudiante ${student.studentClass_email} no está registrado.`);
                continue;
            }
            

            const studentClassData = {
                student_id: student.id,
                class_id: studentClass.class_id,
            };

            // Guardar en la base de datos
            await students_classesModel.create(studentClassData);
        }

        // Eliminar el archivo después de procesarlo
        await fs.remove(filePath);

        res.json({ message: 'Alumnos importados a la clase correctamente' });
    } catch (error) {
        console.error('Error al procesar el archivo Excel:', error);
        res.status(500).json({ message: 'Error al procesar el archivo' });
    }
};