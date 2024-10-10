import {Router} from "express";

import mysql from 'mysql2'

export const connDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Asegúrate de usar la contraseña correcta
    database: 'classcov' // Cambia por el nombre de tu base de datos
  });

  connDB.connect((err) => {
    if (err) {
      console.log('Error al conectar a la base de datos:', err);
      return;
    }
    console.log('Conexión a la base de datos exitosa');
  });
  
const router = Router();


export default router;