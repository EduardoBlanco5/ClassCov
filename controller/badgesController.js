import { badgesModel, studentBadgesModel } from "../model/taskModel.js";  // Importar el modelo de student_badges

// Crear una nueva insignia
export const createBadge = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    const badge = await badgesModel.create({
      name,
      description,
      icon,
    });
    res.status(201).json({ message: 'Insignia creada exitosamente', badge });
  } catch (error) {
    console.error('Error al crear la insignia:', error);
    res.status(500).json({ message: 'Error al crear la insignia' });
  }
};

// Asignar una insignia a un estudiante
export const awardBadge = async (req, res) => {
  try {
    const { student_id, badge_id } = req.body;

    // Verificar si el estudiante ya tiene esta insignia
    const existingBadge = await studentBadgesModel.findOne({
      where: { student_id, badge_id },
    });

    if (existingBadge) {
      return res.status(400).json({ message: 'El estudiante ya tiene esta insignia' });
    }

    const badge = await studentBadgesModel.create({
      student_id,
      badge_id,
    });

    res.status(201).json({ message: 'Insignia otorgada exitosamente', badge });
  } catch (error) {
    console.error('Error al otorgar la insignia:', error);
    res.status(500).json({ message: 'Error al otorgar la insignia' });
  }
};

// Obtener todas las insignias de un estudiante
export const getStudentBadges = async (req, res) => {
  try {
    const { student_id } = req.params;
    const badges = await studentBadgesModel.findAll({
      where: { student_id },
      include: [{ model: badgesModel, as: 'badge' }],
    });
    res.status(200).json(badges);
  } catch (error) {
    console.error('Error al obtener las insignias del estudiante:', error);
    res.status(500).json({ message: 'Error al obtener las insignias' });
  }
};