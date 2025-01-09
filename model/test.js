import cors from 'cors';
import express from "express";
import { PORT } from "./config.js";
import path from 'path';
import { fileURLToPath } from 'url';  
import dotenv from 'dotenv';
import router from './routes/test.routes.js';
import { db } from './db.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

dotenv.config();

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Uso de las rutas
app.use(express.static(path.join(__dirname, '../Perfil/Admins')));
app.use(express.static(path.join(__dirname, '../Perfil/Announcements')));
app.use(express.static(path.join(__dirname, '../Perfil/Guardians')));
app.use(express.static(path.join(__dirname, '../Perfil/Students')));
app.use(express.static(path.join(__dirname, '../Perfil/Tasks')));
app.use(express.static(path.join(__dirname, '../Perfil/Teachers')));
app.use(express.static(path.join(__dirname, '../uploads/Announcements')));
app.use(express.static(path.join(__dirname, '../uploads/Tasks')));
app.use(express.static(path.join(__dirname, '../Teachers/Tasks')));

// Configuración de CORS para el backend (API)
app.use(cors());

app.use(express.json());
app.use('/', router);
app.use('/auth', authRoutes);

try {
    await db.authenticate();
    console.log('Conexión exitosa a la base de datos');
} catch (error) {
    console.log(`Error en: ${error}`);
}

app.get('/', (req, res) => {
    res.send('Probando el get de app');
});

// Puerto de prueba para ver funcionamiento
app.listen(PORT, () => {
  console.log(`Servidor de la API en http://localhost:${PORT}`);
});
