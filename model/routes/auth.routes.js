import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { administrationModel, guardiansModel, studentsModel, teachersModel } from '../taskModel.js';


const router = Router();

// Función para buscar al usuario en cada tabla
async function findUser(email) {
  let user = await administrationModel.findOne({ where: { email } });
  if (user) return { user, role: 'admin' };

  user = await teachersModel.findOne({ where: { email } });
  if (user) return { user, role: 'teacher' };

  user = await studentsModel.findOne({ where: { email } });
  if (user) return { user, role: 'student' };

  user = await guardiansModel.findOne({ where: { email } });
  if (user) return { user, role: 'guardian' };

  return null; // No se encontró usuario
}

// Ruta de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Datos de login:', req.body); 
  
  try {
      // Buscar al usuario en las tablas
      const result = await findUser(email);

    if (!result) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }


    const { user, role,} = result;
     
    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('¿Contraseña coincide?', isMatch);
    if (!isMatch) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: user.id, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.json({ token, role, name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;
