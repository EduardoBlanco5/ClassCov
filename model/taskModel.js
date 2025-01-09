import { db } from "./db.js";
import { DataTypes } from "sequelize";
import { Sequelize } from "sequelize";

export const taskModel = db.define("tasks", {
  title: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  deliveryDate: { type: DataTypes.DATE },
  notes: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING },
  class_id: { type: DataTypes.INTEGER },
  teacher_id: { type: DataTypes.INTEGER },
  file: {type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  subject_id: {type: DataTypes.INTEGER},

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
  id: { type: DataTypes.INTEGER, primaryKey: true },
  name: { type: DataTypes.STRING },
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
  qualification: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true, // Permitir que sea NULL
    defaultValue: null, // No asignar un valor por defecto
},
  subject_id: {type: DataTypes.INTEGER},
 
});

export const students_classesModel = db.define('students_classes', {
  student_id: {type: DataTypes.INTEGER},
  class_id: {type: DataTypes.INTEGER},
  overall_average: {type: DataTypes.DECIMAL},
  
})

export const attendancesModel = db.define('attendances', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  student_id: { type: DataTypes.INTEGER },
  class_id: { type: DataTypes.INTEGER },
  attendance_date: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING },
  notes: { type: DataTypes.STRING },
});


  export const subjectsModel = db.define('subjects', 
    {
      name: {type: DataTypes.STRING},
      description: {type: DataTypes.STRING},
      grade: {type:DataTypes.STRING},

    }
  )

  export const students_subjectsModel = db.define('students_subjects', 
    {
      student_id: {type: DataTypes.INTEGER},
      subject_id: {type: DataTypes.INTEGER},
      average_grade: {type: DataTypes.DECIMAL},
    }
  )


students_classesModel.belongsTo(studentsModel, { foreignKey: 'student_id' });
students_classesModel.belongsTo(classModel, { foreignKey: 'class_id' });
studentsModel.hasMany(students_classesModel, { foreignKey: 'student_id' });
classModel.hasMany(students_classesModel, { foreignKey: 'class_id' });
taskModel.hasMany(upTasksModel, { foreignKey: 'task_id', as: 'upTasks' });
upTasksModel.belongsTo(taskModel, { foreignKey: 'task_id', as: 'task' });
studentsModel.hasMany(upTasksModel, { foreignKey: 'student_id', as: 'submissions' });
upTasksModel.belongsTo(studentsModel, { foreignKey: 'student_id', as: 'student' });
studentsModel.hasMany(upTasksModel, { foreignKey: 'student_id', as: 'upTasks' });

students_classesModel.belongsTo(studentsModel, { foreignKey: 'student_id' });
students_classesModel.belongsTo(classModel, { foreignKey: 'class_id' });

studentsModel.hasMany(students_classesModel, { foreignKey: 'student_id' });
classModel.hasMany(students_classesModel, { foreignKey: 'class_id' });

attendancesModel.associate = (models) => {
  attendancesModel.belongsTo(models.studentsModel, { foreignKey: 'student_id', as: 'student' });
};


studentsModel.associate = (models) => {
  studentsModel.hasMany(models.attendancesModel, { foreignKey: 'student_id', as: 'attendances' });
};

studentsModel.associate({ attendancesModel });
attendancesModel.associate({ studentsModel });

