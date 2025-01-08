import { challengesModel, studentChallengesModel } from "../model/taskModel.js";  // Importar el modelo de student_challenge
// Crear un nuevo desafío
export const createChallenge = async (req, res) => {
    try {
      const { title, description, difficulty, reward, subject_id } = req.body;
      const challenge = await challengesModel.create({
        title,
        description,
        difficulty,
        reward,
        subject_id,
      });
      res.status(201).json({ message: 'Desafío creado exitosamente', challenge });
    } catch (error) {
      console.error('Error al crear el desafío:', error);
      res.status(500).json({ message: 'Error al crear el desafío' });
    }
  };
  
  // Asignar un desafío a un estudiante
  export const assignChallenge = async (req, res) => {
    try {
      const { student_id, challenge_id } = req.body;
  
      const studentExists = await studentsModel.findByPk(student_id);
      if (!studentExists) {
        return res.status(404).json({ message: 'Estudiante no encontrado' });
      }
  
      const challengeExists = await challengesModel.findByPk(challenge_id);
      if (!challengeExists) {
        return res.status(404).json({ message: 'Desafío no encontrado' });
      }
  
      const existingChallenge = await studentChallengesModel.findOne({
        where: { student_id, challenge_id },
      });
  
      if (existingChallenge) {
        return res.status(400).json({ message: 'El desafío ya está asignado a este estudiante' });
      }
  
      const challenge = await studentChallengesModel.create({
        student_id,
        challenge_id,
        status: 'assigned',
        progress: 0.0,
      });
  
      // Emitir notificación a los clientes (esto ocurre desde el archivo principal)
      // io.emit('newChallenge', {
      //   student_id,
      //   challenge_id,
      //   title: challengeExists.title,
      //   description: challengeExists.description,
      // });
  
      res.status(201).json({ message: 'Desafío asignado exitosamente', challenge });
    } catch (error) {
      console.error('Error al asignar el desafío:', error);
      res.status(500).json({ message: 'Error al asignar el desafío' });
    }
  };
  
  // Actualizar progreso de un estudiante en un desafío
  export const updateChallengeProgress = async (req, res) => {
    try {
      const { student_id, challenge_id, progress } = req.body;
  
      // Buscar el desafío asignado
      const studentChallenge = await studentChallengesModel.findOne({
        where: { student_id, challenge_id },
      });
  
      if (!studentChallenge) {
        return res.status(404).json({ message: 'Desafío no encontrado para este estudiante' });
      }
  
      // Actualizar el progreso
      studentChallenge.progress = progress;
  
      if (progress === 100) {
        studentChallenge.status = 'completed';  // Cambiar el estado a completado si el progreso es 100%
        studentChallenge.completed_at = new Date();
      }
  
      await studentChallenge.save();
      res.status(200).json({ message: 'Progreso actualizado exitosamente', studentChallenge });
    } catch (error) {
      console.error('Error al actualizar el progreso del desafío:', error);
      res.status(500).json({ message: 'Error al actualizar el progreso' });
    }
  };
  
  // Obtener desafíos asignados a un estudiante
  export const getAssignedChallenges = async (req, res) => {
    try {
      const { student_id } = req.params;
  
      // Obtener todos los desafíos asignados al estudiante
      const challenges = await studentChallengesModel.findAll({
        where: { student_id, status: 'assigned' },
        include: [
          { model: challengesModel, as: 'challenge' } // Incluye detalles del desafío
        ]
      });
  
      if (challenges.length === 0) {
        return res.status(404).json({ message: 'No hay desafíos asignados para este estudiante' });
      }
  
      res.status(200).json(challenges);
    } catch (error) {
      console.error('Error al obtener los desafíos asignados:', error);
      res.status(500).json({ message: 'Error al obtener los desafíos' });
    }
  };