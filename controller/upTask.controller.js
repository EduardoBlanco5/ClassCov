import { where } from "sequelize";
import { taskModel, upTasksModel } from "../model/taskModel.js";
import { body, validationResult } from "express-validator";

// Lista de palabras reservadas y caracteres sospechosos
const reservedWords = [
  "SELECT",
  "INSERT",
  "DELETE",
  "UPDATE",
  "DROP",
  "ALTER",
  "TRUNCATE",
];
const specialCharacters = ["--", ";", "/*", "*/", '"', "'"];

// Función para validar entradas contra palabras reservadas y caracteres especiales
const containsReservedWords = (value) => {
  // Verificar si la entrada contiene alguna de las palabras reservadas
  const wordsMatch = reservedWords.some((word) =>
    new RegExp(`\\b${word}\\b`, "i").test(value)
  );
  // Verificar si la entrada contiene caracteres especiales
  const charsMatch = specialCharacters.some((char) => value.includes(char));
  return !(wordsMatch || charsMatch);
};

// Middleware de validación para las tareas
const validateTask = [
  body("title")
    .notEmpty()
    .withMessage("El título es obligatorio")
    .custom(containsReservedWords)
    .withMessage(
      "El título contiene palabras reservadas o caracteres no permitidos"
    ),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation Errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// C
export const createUpTask = [
  validateTask,
  async (req, res) => {
    try {
      await upTasksModel.create(req.body);
      res.json({ message: "Tarea creada correctamente" });
    } catch (error) {
      console.error("Database Error:", error);
      res.json({ message: error.message });
    }
  },
];

//Mostrar todos R
export const getAllUpTasks = async (req, res) => {
  try {
    const tasks = await upTasksModel.findAll();
    res.json(tasks);
  } catch (error) {
    res.json({ message: error.message });
  }
};

//Mostrar uno R
export const getUpTask = async (req, res) => {
  try {
    const task = await upTasksModel.findAll({
      where: { id: req.params.id },
    });
    res.json(task[0]);
  } catch (error) {
    res.json({ message: error.message });
  }
};

//Actualizar U

export const updateUpTask = [
  async (req, res) => {
    try {
      const result = await upTasksModel.update(req.body, {
        where: { id: req.params.id },
      });
      if (result[0] === 0) {
        return res.status(404).json({ message: "Tarea no encontrada" });
      }
      res.json({ message: "Tarea Actualizada con éxito" });
    } catch (error) {
      console.error("Database Error:", error);
      res.json({ message: error.message });
    }
  },
];

// D
export const deleteUpTask = async (req, res) => {
  try {
    await upTasksModel.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: "Tarea eliminada con exito" });
  } catch (error) {
    res.json({ message: error.message });
  }
};


