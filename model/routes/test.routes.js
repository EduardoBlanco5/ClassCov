import express from "express";
import multer from 'multer';

import { createTask, deleteTask, getAllTasks, getTask, getTasksByClassId, updateTask } from "../../controller/task.controller.js";
import { createAnnouncement, getAllAnnouncements, getAnnouncement, updateAnnouncement, deleteAnnouncement, getAnnouncementsByClassId } from "../../controller/announcements.controller.js";
import { createStudent, deleteStudent, getAllStudents, getStudent, updateStudent, getStudentsByClassId, getStudentsByGuardianId } from "../../controller/students.controller.js";
import { createGuardian, deleteGuardian, getAllGuardians, getGuardian, updateGuardian } from "../../controller/guardians.controller.js";
import { createTeacher, deleteTeacher, getAllTeachers, getTeacher, updateTeacher } from "../../controller/teachers.controller.js";
import { createAdmin, deleteAdmin, getAdmin, getAllAdmin, updateAdmin } from "../../controller/administration.controller.js";
import { createClass, updateClass, deleteClass, getAllClass, getClass, getClassesByTeacherId } from "../../controller/class.controller.js";
import {createUpTask, getPendingTasksByStudent, getUpTaskByStudentAndTask} from "../../controller/upTask.controller.js"
import { createStudentClass, deleteStudentClass, getAllStudentClass, getClassesByStudent, getStudentClass, getStudentsByClass, updateStudentClass } from "../../controller/students_classes.controller.js";


const router = express.Router();

//Tareas
const ImageTasks = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'Teachers/Tasks');
  },
  filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const TeachersTasks = multer({ storage: ImageTasks })

router.post('/task', TeachersTasks.single('file'), createTask);//C
router.get('/tasks', getAllTasks);//R
router.get('/tasks/class', getTasksByClassId);
router.get('/task/:id', getTask);//R
router.put('/task/:id', TeachersTasks.single('file'), updateTask);//U
router.delete('/task/:id', deleteTask);//D

//Anuncios
const ImageAnnouncements = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/Announcements');
  },
  filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const announcementsfiles = multer({ storage: ImageAnnouncements })

router.post('/announcement', announcementsfiles.single('file'), createAnnouncement);//C
router.get('/announcements', getAllAnnouncements);//R
router.get('/announcements/class', getAnnouncementsByClassId);
router.get('/announcement/:id', getAnnouncement);//R
router.put('/announcement/:id', announcementsfiles.single('file'), updateAnnouncement);//U
router.delete('/announcement/:id', deleteAnnouncement);//D

//Estudiantes
const ImageStudent = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'Perfil/Students');
  },
  filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const PerfilStudents = multer({ storage: ImageStudent })

router.post('/student', PerfilStudents.single('file'), createStudent);//C
router.get('/students', getAllStudents);//R
router.get('/students/class', getStudentsByClassId); // Obtener estudiantes por class_id
router.get('/students/guardian', getStudentsByGuardianId); //Obtener estudiantes por guardian_id
router.get('/student/:id', getStudent);//R
router.put('/student/:id', PerfilStudents.single('file'), updateStudent);//U
router.delete('/student/:id', deleteStudent);//D

//Tutores
const ImageGuardian = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'Perfil/Guardians');
  },
  filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const PerfilGuardian = multer({ storage: ImageGuardian })

router.post('/guardian',  PerfilGuardian.single('file'), createGuardian);
router.get('/guardians', getAllGuardians);
router.get('/guardian/:id', getGuardian);
router.put('/guardian/:id', PerfilGuardian.single('file'), updateGuardian);
router.delete('/guardian/:id', deleteGuardian);

//Profesores
const ImageTeacher = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'Perfil/Teachers');
  },
  filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const PerfilTeacher = multer({ storage: ImageTeacher })

router.post('/teacher', PerfilTeacher.single('file'), createTeacher);
router.get('/teachers', getAllTeachers);
router.get('/teacher/:id', getTeacher);
router.put('/teacher/:id', PerfilTeacher.single('file'), updateTeacher);
router.delete('/teacher/:id', deleteTeacher);


//Administracion
const ImageAdmin = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'Perfil/Admins');
  },
  filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const PerfilAdmin = multer({ storage: ImageAdmin })

router.post('/admin', PerfilAdmin.single('file'), createAdmin);
router.get('/admins', getAllAdmin);
router.get('/admin/:id', getAdmin);
router.put('/admin/:id', PerfilAdmin.single('file'), updateAdmin);
router.delete('/admin/:id', deleteAdmin);

//Clases
router.post('/class', createClass);
router.get('/classes', getAllClass);
router.get('/class/:id', getClass);
router.get('/classes/teacher/:teacher_id', getClassesByTeacherId);
router.put('/class/:id', updateClass);
router.delete('/class/:id', deleteClass);

//StudentsClasses
router.post('/studentClass', createStudentClass);
router.get('/StudentsClasses', getAllStudentClass);
router.get('/StudentClass/:id', getStudentClass);
router.get('/class/:class_id/students', getStudentsByClass);
router.get('/student/:student_id/classes', getClassesByStudent);
router.put('/StudentClass/:id', updateStudentClass);
router.delete('/StudentClass/:id', deleteStudentClass);

// Subir archivo
const ImageUpTask = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/Tasks'); // Continua con la ruta de destino
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`); // Generar un nombre único para el archivo
    }
  });


const uploadT = multer({ storage: ImageUpTask })


router.post('/uploadTask', uploadT.single('file'), (req, res, next) => {
  console.log('Archivo recibido:', req.file);
  console.log('Datos recibidos:', req.body);
  const { task_id, student_id } = req.body;

  // Imprimir los datos recibidos para confirmar
  console.log('Datos enviados:', { task_id, student_id, file: req.file });
  next();
}, createUpTask);

router.get('/uptask', getUpTaskByStudentAndTask);
router.get('/tasks/pending', getPendingTasksByStudent);

//router.post('/upload/Task', uploadA.single('file'), createUpTask); 




export default router;
