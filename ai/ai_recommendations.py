import mysql.connector
from sklearn.linear_model import LinearRegression
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

# Configuración de conexión a la base de datos
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'classcov'
}

# Inicializar Flask
app = Flask(__name__)
CORS(app)

# Base de datos de recursos educativos
RESOURCES = {
    "Matemáticas 1": [
        "https://www.khanacademy.org/math",
        "https://www.mathsisfun.com/",
        "https://www.symbolab.com/"
    ],
    "Español 2": [
        "https://www.aprendeblog.com/",
        "https://www.gramatica.com/",
        "https://www.rae.es/"
    ],
    "Ciencias 1": [
        "https://www.nationalgeographic.com/science/",
        "https://www.sciencebuddies.org/",
        "https://www.khanacademy.org/science"
    ],
}

def obtener_estudiantes_con_promedio_bajo():
    """Obtiene los estudiantes con promedio menor a 8."""
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

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
        resultados = cursor.fetchall()
        return resultados

    except mysql.connector.Error as e:
        print(f"Error en la base de datos: {e}")
        return []

    finally:
        if connection.is_connected():
            connection.close()

def obtener_asistencias_estudiantes(student_id):
    """Obtiene el porcentaje de asistencia de un estudiante."""
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        query = "SELECT COUNT(*) AS total_classes FROM attendance WHERE student_id = %s;"
        cursor.execute(query, (student_id,))
        total_classes = cursor.fetchone()['total_classes']

        query = "SELECT COUNT(*) AS attended_classes FROM attendance WHERE student_id = %s AND status = 'presente';"
        cursor.execute(query, (student_id,))
        attended_classes = cursor.fetchone()['attended_classes']

        if total_classes == 0:
            return 0

        attendance_percentage = (attended_classes / total_classes) * 100
        return attendance_percentage

    except mysql.connector.Error as e:
        print(f"Error en la base de datos: {e}")
        return 0

    finally:
        if connection.is_connected():
            connection.close()

def predecir_promedio_general(subject_averages, attendance_percentage):
    """Predice el promedio general utilizando regresión lineal."""
    X = np.array([subject_averages + [attendance_percentage]])
    model = LinearRegression()

    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT ss.student_id, ss.average_grade, a.status
            FROM students_subjects ss
            LEFT JOIN attendance a ON ss.student_id = a.student_id
            WHERE ss.average_grade IS NOT NULL;
        """
        cursor.execute(query)
        data = cursor.fetchall()

        X_train = []
        y_train = []

        for row in data:
            student_id = row['student_id']
            attendance_percentage = obtener_asistencias_estudiantes(student_id)
            subject_averages = [row['average_grade']]

            X_train.append(subject_averages + [attendance_percentage])
            y_train.append(row['average_grade'])

        X_train = np.array(X_train)
        y_train = np.array(y_train)

        model.fit(X_train, y_train)
        predicted_average = model.predict(X)

        return predicted_average[0]

    except mysql.connector.Error as e:
        print(f"Error en la base de datos: {e}")
        return 0

    finally:
        if connection.is_connected():
            connection.close()

@app.route('/recommend', methods=['POST'])
def recommend():
    """Recomienda recursos educativos para materias con promedio bajo."""
    data = request.json
    student_id = data.get('student_id')
    subject_averages = data.get('subject_averages', [])

    recommendations = []
    for subject in subject_averages:
        if float(subject['averageGrade']) < 8:
            subject_name = subject['subjectName']
            resources = RESOURCES.get(subject_name, [])
            recommendations.append({
                "subject": subject_name,
                "resources": resources
            })
    
    return jsonify({"recommendations": recommendations})

@app.route('/predict', methods=['POST'])
def predict():
    """Predice el promedio general de un estudiante."""
    data = request.json
    student_id = data.get('student_id')

    subjects = obtener_estudiantes_con_promedio_bajo()
    subject_averages = [subject['average_grade'] for subject in subjects if subject['student_id'] == student_id]

    attendance_percentage = obtener_asistencias_estudiantes(student_id)
    predicted_average = predecir_promedio_general(subject_averages, attendance_percentage)

    return jsonify({
        "student_id": student_id,
        "predicted_average": predicted_average
    })

if __name__ == '__main__':
    print("Iniciando servidor Flask en el puerto 5001...")
    app.run(port=5001)
