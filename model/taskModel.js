import { db } from "./db.js";
import { DataTypes } from "sequelize";

export const taskModel = db.define("tasks", {
  title: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  qualification: { type: DataTypes.STRING },
  deliveryDate: { type: DataTypes.DATE },
  notes: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING },
  class_id: { type: DataTypes.INTEGER },
  teacher_id: { type: DataTypes.INTEGER },
  file: {type: DataTypes.STRING, allowNull: false, defaultValue: '' },
});

export const announcementsModel = db.define("announcements", {
  title: { type: DataTypes.STRING },
  content: { type: DataTypes.STRING },
  teacher_id: { type: DataTypes.INTEGER },
  class_id: { type: DataTypes.INTEGER },
  date: { type: DataTypes.DATE },
  file: {type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  
});

export const studentsModel = db.define("students", {
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  guardian_id: { type: DataTypes.INTEGER },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.INTEGER },
  phone: { type: DataTypes.STRING },
  date_of_birth: { type: DataTypes.DATE },
  admission: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING },
  file: {type: DataTypes.STRING},
});

export const guardiansModel = db.define("guardians", {
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.INTEGER },
  date_of_birth: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING },
  file: {type: DataTypes.STRING},
});

export const teachersModel = db.define("teachers", {
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  hire_date: { type: DataTypes.DATE },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.INTEGER },
  phone: { type: DataTypes.STRING },
  date_of_birth: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING },
  file: {type: DataTypes.STRING},
});

export const administrationModel = db.define("administrations", {
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING },
  date_of_birth: { type: DataTypes.DATE },
  hire_date: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING },
  file: {type: DataTypes.STRING},
});

export const classModel = db.define("classes", {
  grade: { type: DataTypes.INTEGER },
  salon: { type: DataTypes.STRING },
  shift: { type: DataTypes.STRING },
  teacher_id: { type: DataTypes.INTEGER },
});

export const upTasksModel = db.define('uptasks', {

  file: { type: DataTypes.STRING },
  student_id: { type: DataTypes.INTEGER, allowNull: false },
  task_id: { type: DataTypes.INTEGER, allowNull: false },
 
});

export const students_classesModel = db.define('students_classes', {
  student_id: {type: DataTypes.INTEGER},
  class_id: {type: DataTypes.INTEGER},
  
})

students_classesModel.belongsTo(studentsModel, { foreignKey: 'student_id' });
students_classesModel.belongsTo(classModel, { foreignKey: 'class_id' });
studentsModel.hasMany(students_classesModel, { foreignKey: 'student_id' });
classModel.hasMany(students_classesModel, { foreignKey: 'class_id' });