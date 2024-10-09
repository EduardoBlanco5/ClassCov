import { db } from "../model/db.js";  // Asegúrate de que tienes la conexión a la base de datos

export const createUpTask = async (req, res) => {
  try {
      const { taskId } = req.body;  // Datos adicionales (por ejemplo, ID de tarea)
      const filePath = req.file.path;  // Ruta del archivo subido

      console.log("taskId:", taskId);
      console.log("filePath:", filePath);

      // Consulta para insertar en la base de datos
      const [result] = await db.query(
          "INSERT INTO uptasks (task_id, file_path) VALUES (?, ?)", 
          [taskId, filePath]
      );

      res.status(200).json({ 
          message: "Archivo subido y guardado en la base de datos correctamente", 
          data: result 
      });
  } catch (error) {
      res.status(500).json({ 
          message: "Error al guardar el archivo en la base de datos", 
          error 
      });
  }
};

