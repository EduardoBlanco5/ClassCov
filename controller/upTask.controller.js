import mysql from 'mysql2'

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Asegúrate de usar la contraseña correcta
    database: 'classcov' // Cambia por el nombre de tu base de datos
  });

  db.connect((err) => {
    if (err) {
      console.log('Error al conectar a la base de datos:', err);
      return;
    }
    console.log('Conexión a la base de datos exitosa');
  });

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
      const query = 'INSERT INTO uptasks (task_id, file, student_id, createdAt) VALUES (?, ?, ?, NOW())';
      db.query(query, [taskId, file, student_id], (err, result) => {
        if (err) {
          console.log('Error al guardar la ruta en la base de datos:', err);
          return res.status(500).send('Error al guardar en la base de datos');
        }
        res.status(200).send('Archivo subido y ruta guardada correctamente');
      });
};

