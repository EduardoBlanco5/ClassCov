from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Cargar el modelo entrenado
model = joblib.load('student_help_model.pkl')

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

@app.route('/predict_help', methods=['POST'])
def predict_help():
    data = request.json
    student_id = data.get('student_id')
    subject_averages = data.get('subject_averages', [])

    if not subject_averages:
        return jsonify({"error": "No se enviaron calificaciones"}), 400

    recommendations = []
    for subject in subject_averages:
        subject_name = subject['subjectName']
        average_grade = float(subject['averageGrade'])

        # Realizar predicción con el modelo
        prediction = model.predict(np.array([[average_grade]]))[0]  # 1 = necesita ayuda, 0 = no necesita

        if prediction == 1:
            resources = RESOURCES.get(subject_name, [])
            recommendations.append({
                "subject": subject_name,
                "resources": resources
            })

    return jsonify({"student_id": student_id, "recommendations": recommendations})

if __name__ == '__main__':
    print("Iniciando servidor Flask en el puerto 5001...")
    app.run(port=5001)
