import express from "express";
import multer from 'multer';


import { createTask, deleteTask, getAllTasks, getTask, getTasksByClassId, updateTask } from "../../controller/task.controller.js";
import { createAnnouncement, getAllAnnouncements, getAnnouncement, updateAnnouncement, deleteAnnouncement, getAnnouncementsByClassId } from "../../controller/announcements.controller.js";
import { createStudent, deleteStudent, getAllStudents, getStudent, updateStudent, getStudentsByClassId, getStudentsByGuardianId } from "../../controller/students.controller.js";
import { createGuardian, deleteGuardian, getAllGuardians, getGuardian, updateGuardian } from "../../controller/guardians.controller.js";
import { createTeacher, deleteTeacher, getAllTeachers, getTeacher, updateTeacher } from "../../controller/teachers.controller.js";
import { createAdmin, deleteAdmin, getAdmin, getAllAdmin, updateAdmin } from "../../controller/administration.controller.js";
import { createClass, updateClass, deleteClass, getAllClass, getClass } from "../../controller/class.controller.js";
import {createUpTask} from "../../controller/upTask.controller.js"

// Configuración de Multer para almacenar archivos en una carpeta "uploads"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const router = express.Router();

const upload = multer({ storage: storage });

//Tareas
router.post('/task', createTask);//C
router.get('/tasks', getAllTasks);//R
router.get('/tasks/class', getTasksByClassId);
router.get('/task/:id', getTask);//R
router.put('/task/:id', updateTask);//U
router.delete('/task/:id', deleteTask);//D

//Anuncios
router.post('/announcement', createAnnouncement);//C
router.get('/announcements', getAllAnnouncements);//R
router.get('/announcements/class', getAnnouncementsByClassId);
router.get('/announcement/:id', getAnnouncement);//R
router.put('/announcement/:id', updateAnnouncement);//U
router.delete('/announcement/:id', deleteAnnouncement);//D

//Estudiantes
router.post('/student', createStudent);//C
router.get('/students', getAllStudents);//R
router.get('/students/class', getStudentsByClassId); // Obtener estudiantes por class_id
router.get('/students/guardian', getStudentsByGuardianId); //Obtener estudiantes por guardian_id
router.get('/student/:id', getStudent);//R
router.put('/student/:id', updateStudent);//U
router.delete('/student/:id', deleteStudent);//D

//Tutores
router.post('/guardian', createGuardian);
router.get('/guardians', getAllGuardians);
router.get('/guardian/:id', getGuardian);
router.put('/guardian/:id', updateGuardian);
router.delete('/guardian/:id', deleteGuardian);

//Profesores
router.post('/teacher', createTeacher);
router.get('/teachers', getAllTeachers);
router.get('/teacher/:id', getTeacher);
router.put('/teacher/:id', updateTeacher);
router.delete('/teacher/:id', deleteTeacher);

//Administracion
router.post('/admin', createAdmin);
router.get('/admins', getAllAdmin);
router.get('/admin/:id', getAdmin);
router.put('/admin/:id', updateAdmin);
router.delete('/admin/:id', deleteAdmin);

//Clases
router.post('/class', createClass);
router.get('/classes', getAllClass);
router.get('/class/:id', getClass);
router.put('/class/:id', updateClass);
router.delete('/class/:id', deleteClass);


// Subir archivo


router.post('/upload', upload.single('file'), createUpTask);



export default router;
