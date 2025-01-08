import mysql.connector

# Configuración de conexión a la base de datos
db_config = {
    'host': 'localhost',
    'user': 'root',         # Reemplaza con tu usuario de MySQL
    'password': '',  # Reemplaza con tu contraseña de MySQL
    'database': 'classcov'        # Reemplaza con el nombre de tu base de datos
}

def obtener_estudiantes_con_promedio_bajo():
    """Obtiene los estudiantes con promedio menor a 8."""
    try:
        # Conexión a la base de datos
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        # Consulta SQL para detectar promedios bajos
        query = """
            SELECT 
                ss.student_id, 
                ss.subject_id, 
                ss.average_grade,
                s.name AS subject_name
            FROM students_subjects ss
            INNER JOIN subjects s ON ss.subject_id = s.id
            WHERE ss.average_grade < 8;
        """
        cursor.execute(query)

        # Obtener resultados
        resultados = cursor.fetchall()
        return resultados

    except mysql.connector.Error as e:
        print(f"Error al conectar con la base de datos: {e}")
        return []

    finally:
        if connection.is_connected():
            connection.close()

# Prueba del script
if __name__ == "__main__":
    estudiantes = obtener_estudiantes_con_promedio_bajo()
    if estudiantes:
        print("Estudiantes con promedio bajo:")
        for estudiante in estudiantes:
            print(f"ID Estudiante: {estudiante['student_id']}, "
                  f"Materia: {estudiante['subject_name']}, "
                  f"Promedio: {estudiante['average_grade']}")
    else:
        print("No hay estudiantes con promedio menor a 8.")