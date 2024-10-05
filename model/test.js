import cors from 'cors'
import express from "express";
import { PORT } from "./config.js";


// import indexRoutes from './routes/index.routes.js'
import router from './routes/test.routes.js'
import { db } from './db.js';

const app = express();

//uso de las rutas

app.use(cors());
app.use(express.json())
app.use('/', router);


try {
    await db.authenticate()
    console.log('Conexion exitosa a la base de datos')
} catch (error) {
    console.log(`error en: ${error}`)
}


app.get('/', (req, res) =>{
    res.send('Probando el get de app')
})
// puerto de prueba para ver funcionamiento
app.listen(PORT);
console.log(`server is listening ${PORT}`);
