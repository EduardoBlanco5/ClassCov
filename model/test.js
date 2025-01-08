import cors from 'cors';
import express from "express";
import { PORT } from "./config.js";
import path from 'path';
import { fileURLToPath } from 'url';  
import http from 'http';  // Necesario para crear un servidor HTTP
import { Server } from 'socket.io';  // Para crear el servidor de WebSockets
import dotenv from 'dotenv';
import router from './routes/test.routes.js';
import { db } from './db.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

dotenv.config();

// Crear el servidor HTTP
const server = http.createServer(app);

// Crear el servidor Socket.IO usando el servidor HTTP
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',  // Permitir conexiones desde el frontend (puerto 5173)
    methods: ['GET', 'POST'],
  }
});

// Configurar los eventos de Socket.IO
io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');
    
    socket.on('assignChallenge', (data) => {
      io.emit('newChallenge', data);  // Enviar la notificación a todos los clientes
    });
  
    socket.on('disconnect', () => {
      console.log('Un cliente se ha desconectado');
    });
});

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
app.use(cors({
  origin: 'http://localhost:5173',  // Permitir solicitudes desde el frontend (puerto 5173)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

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

// Iniciar el servidor HTTP para Socket.IO en el puerto 7000
server.listen(7000, () => {
    console.log('Servidor de WebSockets corriendo en http://localhost:7000');
});