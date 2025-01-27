import { where } from 'sequelize'
import {guardiansModel} from '../model/taskModel.js'
import { body, validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import xlsx from 'xlsx';
import { Op } from 'sequelize';

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
export const createGuardian = [
    validateTask,
    async (req, res) => {
        try {
            const filePath = req.file ? `/${req.file.filename}` : null;
            // Encriptar la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);  // Encriptar la contraseña

            const guardianData = {
                ...req.body,
                password: hashedPassword,  // Reemplazar con la contraseña encriptada
                file: filePath 
            };
            await guardiansModel.create(guardianData);
            res.json({ 'message': 'Tutor creado correctamente' });
        } catch (error) {
            console.error('Database Error:', error);
            res.json({ message: error.message });
        }
    }
];

//Mostrar todos R
export const getAllGuardians = async (req, res) => {
    try {


        const guardians = await guardiansModel.findAll();

        // Modificar la respuesta para incluir la URL completa de la imagen
        const guardiansWithImages = guardians.map(guardian => ({
            ...guardian.dataValues,  // Usar dataValues para obtener los datos del modelo
            file: guardian.file ? `${req.protocol}://${req.get('host')}${guardian.file}` : null // URL completa

            
        }));

        res.json(guardiansWithImages)
    } catch (error) {
        res.json({message: error.message})
    }
}

//Mostrar uno R
export const getGuardian = async (req, res) => {
   
    try {
        const guardians = await guardiansModel.findAll({
            where: {id: req.params.id}
        })
        const guardiansWithImages = guardians.map(guardian => ({
            ...guardian.dataValues,  // Usar dataValues para obtener los datos del modelo
            file: guardian.file ? `${req.protocol}://${req.get('host')}${guardian.file}` : null // URL completa

            
        }));

        res.json(guardiansWithImages[0])
    } catch (error) {
        res.json({message: error.message})
    }
}

//Actualizar U

export const updateGuardian = [
    
    async (req, res) => {
        try {
            // Obtener el registro existente para verificar la foto actual
                                const guardian = await guardiansModel.findOne({ where: { id: req.params.id } });
                          
                                if (!guardian) {
                                  return res.status(404).json({ message: "Tutor no encontrado" });
                                }
                          
                                // Si hay un archivo nuevo, usarlo; de lo contrario, conservar el actual
                                const filePath = req.file ? `/${req.file.filename}` : guardian.file;
            // Encriptar la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);  // Encriptar la contraseña
            
            const guardianData = {
                ...req.body,
                password: hashedPassword,  // Reemplazar con la contraseña encriptada
                file: filePath 
            };
            const result = await guardiansModel.update(guardianData, {
                where: { id: req.params.id }
            });



            if (result[0] === 0) {
                return res.status(404).json({ message: 'Tutor no encontrado' });
            }
            res.json({ "message": "Tutor Actualizado con éxito" });
        } catch (error) {
            console.error('Database Error:', error);
            res.json({ message: error.message });
        }
    }
];

// D
export const deleteGuardian = async (req, res) => {
    try {
        await guardiansModel.destroy({
            where: {id: req.params.id}
        })
        res.json({'message': 'Tutor eliminado con exito'})
    } catch (error) {
        res.json({message: error.message})
    }
    
}
// Subir archivo Excel
export const uploadExcel = async (req, res) => {
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
        for (let tutor of data) {
            console.log('Datos del tutor:', tutor);
             // Verificar que el teléfono no esté vacío o undefined
            let phoneNumber = tutor.phone;

            if (!phoneNumber) {
                throw new Error('El número de teléfono es obligatorio');
            }

              // Limpiar el número de teléfono (eliminar caracteres no numéricos)
              phoneNumber = String(tutor.phone).replace(/[^\d]/g, ''); // Elimina todo lo que no sea un número
             
            if (!phoneNumber || phoneNumber.length < 10) {
                throw new Error('El número de teléfono no es válido');
            }

            // Formatear la fecha de nacimiento
            let dateOfBirth = tutor.date_of_birth;

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


            // Encriptar la contraseña (si la columna 'password' existe en el Excel)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(phoneNumber, salt);

            const guardianData = {
                name: tutor.name,
                email: tutor.email,
                phone: tutor.phone,
                date_of_birth: formattedDateOfBirth,
                role: 'guardian',
                status: 'activo',
                password: hashedPassword,
                file: req.file ? `/${req.file.filename}` : null,  // Ruta al archivo subido
            };

            // Guardar en la base de datos
            await guardiansModel.create(guardianData);
        }

        // Eliminar el archivo después de procesarlo
        await fs.remove(filePath);

        res.json({ message: 'Tutores importados correctamente' });
    } catch (error) {
        console.error('Error al procesar el archivo Excel:', error);
        res.status(500).json({ message: 'Error al procesar el archivo' });
    }
};

// Buscar tutores por nombre o correo
export const searchGuardians = async (req, res) => {
    try {
        const { search } = req.query; // Obtener el término de búsqueda desde los parámetros de consulta
        const guardians = await guardiansModel.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } }, // Buscar coincidencias en el nombre
                    { email: { [Op.like]: `%${search}%` } } // Buscar coincidencias en el correo
                ]
            }
        });

        const guardiansWithImages = guardians.map(guardian => ({
            ...guardian.dataValues, // Usar dataValues para obtener los datos del modelo
            file: guardian.file ? `${req.protocol}://${req.get('host')}${guardian.file}` : null // URL completa
        }));

        res.json(guardiansWithImages);
    } catch (error) {
        console.error('Error al buscar tutores:', error);
        res.status(500).json({ message: 'Error al buscar tutores' });
    }
};