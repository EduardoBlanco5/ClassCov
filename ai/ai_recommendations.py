from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import mysql.connector
import pandas as pd  # Asegúrate de importar pandas

app = Flask(__name__)
CORS(app)

# Cargar el modelo entrenado
model = joblib.load("recommendation_model.pkl")

# Conexión a la base de datos (ajusta las credenciales según tu configuración)
db = mysql.connector.connect(
    host="localhost",  # o la IP del servidor
    user="root",
    password="",
    database="classcov"
)

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
    "Biología" : [
        "https://es.khanacademy.org/science/biology",
        "https://www.biomania.com/",
    ],
    "Historia ": [
        "https://www.educaciontrespuntocero.com/",
        "https://www.biografiasyvidas.com/",
        "https://es.khanacademy.org/science"
    ],
}

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    student_id = data.get('student_id')
    subject_averages = data.get('subject_averages', [])

    recommendations = []
    
    for subject in subject_averages:
        subject_name = subject['subjectName']
        avg_grade = float(subject['averageGrade'])
        
        print(f"Materia: {subject_name}")  # Agrega esta línea para depurar

        # Convertir los datos de entrada en un DataFrame
        input_data = pd.DataFrame([[avg_grade]], columns=['average_grade'])
        
        # Realizar predicción con el modelo
        try:
            prediction = model.predict(input_data)[0]
        except Exception as e:
            print(f"Error en la predicción: {e}")
            return jsonify({"error": "Hubo un problema al realizar la predicción."}), 500

        if prediction == 1:  # Si el modelo decide que necesita ayuda
            resources = RESOURCES.get(subject_name, [])
            recommendations.append({
                "subject": subject_name,
                "resources": resources
            })

    return jsonify({"recommendations": recommendations})

if __name__ == '__main__':
    print("Iniciando servidor Flask con IA en el puerto 5001...")
    app.run(port=5001)
