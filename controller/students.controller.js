import { where } from 'sequelize'
import {studentsModel,guardiansModel} from '../model/taskModel.js'
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
        const students = await studentsModel.findAll({
            where: {id: req.params.id}
        })
        const studentsWithImages = students.map(student => ({
            ...student.dataValues,  // Usar dataValues para obtener los datos del modelo
            file: student.file ? `${req.protocol}://${req.get('host')}${student.file}` : null // URL completa

            
        }));

        res.json(studentsWithImages[0])
    } catch (error) {
        res.json({message: error.message})
    }
}

//Actualizar U

export const updateStudent = [
    
    async (req, res) => {
        try {
            const filePath = req.file ? `/${req.file.filename}` : null;
            // Encriptar la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);  // Encriptar la contraseña
            
            const studentData = {
                ...req.body,
                password: hashedPassword,  // Reemplazar con la contraseña encriptada
                file: filePath 
            };
            const result = await studentsModel.update(studentData, {
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

export const uploadStudentsExcel = async (req, res) => {
    try {
        // Verificar si se subió un archivo
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ningún archivo' });
        }

        // Leer el archivo Excel
        const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Primera hoja del Excel
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet); // Convertir a JSON

        // Procesar cada estudiante
        for (let student of data) {
            console.log('Datos del tutor:', student);
            // Verificar que el teléfono no esté vacío o undefined
            let phoneNumber = student.phone;
            if (!phoneNumber) {
                throw new Error('El número de teléfono es obligatorio');
            }

              // Limpiar el número de teléfono (eliminar caracteres no numéricos)
              phoneNumber = String(student.phone).replace(/[^\d]/g, ''); // Elimina todo lo que no sea un número
             
            if (!phoneNumber || phoneNumber.length < 10) {
                throw new Error('El número de teléfono no es válido');
            }

            // Formatear la fecha de nacimiento
            let dateOfBirth = student.date_of_birth;

            // Si la fecha está en formato numérico (como en algunos archivos Excel), conviértelo
            if (typeof dateOfBirth === 'number') {
                // Convertir el número serial de Excel a una fecha
                dateOfBirth = new Date((dateOfBirth - 25569) * 86400 * 1000); // Convierte a fecha
            }

            // Asegurarse de que la fecha esté en formato 'YYYY-MM-DD'
            let day = String(dateOfBirth.getDate()).padStart(2, '0');
            let month = String(dateOfBirth.getMonth() + 1).padStart(2, '0');
            let year = dateOfBirth.getFullYear();

            let formattedDateOfBirth = `${year}-${month}-${day}`;

            // Formatear la fecha de Admision
            let admission = student.admission;

            // Si la fecha está en formato numérico (como en algunos archivos Excel), conviértelo
            if (typeof admission === 'number') {
                // Convertir el número serial de Excel a una fecha
                admission = new Date((admission - 25569) * 86400 * 1000); // Convierte a fecha
            }

            // Asegurarse de que la fecha esté en formato 'YYYY-MM-DD'
            let dayAdd = String(dateOfBirth.getDate()).padStart(2, '0');
            let monthAdd = String(dateOfBirth.getMonth() + 1).padStart(2, '0');
            let yearAdd = dateOfBirth.getFullYear();

            let formattedAdmission = `${yearAdd}-${monthAdd}-${dayAdd}`;

            // Verificar que el correo del tutor esté presente
            if (!student.guardian_email) {
                console.error(`El estudiante ${student.name} no tiene correo de tutor.`);
                continue;
            }

            // Buscar el tutor en la base de datos
            const guardian = await guardiansModel.findOne({ where: { email: student.guardian_email } });

            if (!guardian) {
                console.error(`El correo del tutor ${student.guardian_email} no está registrado.`);
                continue;
            }

            // Encriptar la contraseña del estudiante (puede ser el teléfono u otra lógica)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(student.phone.toString(), salt);

            // Preparar datos del estudiante
            const studentData = {
                name: student.name,
                email: student.email,
                guardian_id: guardian.id, // ID del tutor relacionado
                password: hashedPassword,
                date_of_birth: formattedDateOfBirth, // Asegurarse de que el formato esté correcto
                admission: formattedAdmission,
                status: 'activo',
                phone: student.phone,
                role: 'student',
                file: req.file ? `/${req.file.filename}` : null, // Ruta al archivo subido
            };

            // Guardar el estudiante en la base de datos
            await studentsModel.create(studentData);
        }

        // Eliminar el archivo después de procesarlo
        await fs.remove(filePath);

        res.json({ message: 'Estudiantes importados correctamente' });
    } catch (error) {
        console.error('Error al procesar el archivo Excel:', error);
        res.status(500).json({ message: 'Error al procesar el archivo' });
    }
};