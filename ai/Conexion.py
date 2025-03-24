import mysql.connector
import pandas as pd

# Conectar a la base de datos
db_connection = mysql.connector.connect(
    host="localhost",
    user="root",  # Cambia esto por tu usuario
    password="",  # Cambia esto por tu contraseña
    database="classcov"  # Cambia esto por el nombre de tu base de datos
)

# Consulta SQL para obtener los datos necesarios sin la tasa de asistencia
query = """
SELECT 
    ss.student_id,
    ss.subject_id,
    ss.average_grade,
    CASE 
        WHEN ss.average_grade < 8 THEN 1
        ELSE 0
    END AS needs_help
FROM students_subjects ss
"""

# Ejecutar la consulta y cargar los resultados en un DataFrame de Pandas
df = pd.read_sql(query, db_connection)

# Guardar los datos en un archivo CSV
df.to_csv('data.csv', index=False)

# Cerrar la conexión a la base de datos
db_connection.close()

print("Datos guardados en data.csv")
