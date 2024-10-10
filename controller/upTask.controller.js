import { connDB } from "../model/routes/index.routes.js";

export const createUpTask = async (req, res) => {

    if (!req.file) {
        return res.status(400).send('No se subió ningún archivo');
      }
    
      // Ruta del archivo en el servidor
      const file = `/uploads/${req.file.filename}`;
      const student_id = req.body.student_id
      
      // Obtener el task_id del cuerpo de la solicitud
      const taskId = req.body.task_id;
    
      // Guardar la ruta en la base de datos
      const query = 'INSERT INTO uptasks (file, task_id, student_id, createdAt) VALUES (?, ?, ?, NOW())';
      connDB.query(query, [file, taskId, student_id], (err, result) => {
        if (err) {
          console.log('Error al guardar la ruta en la base de datos:', err);
          return res.status(500).send('Error al guardar en la base de datos');
        }
        res.status(200).send('Archivo subido y ruta guardada correctamente');
      });
};

