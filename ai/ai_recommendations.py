from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)
# Base de datos de recursos educativos
RESOURCES = {
    "Matemáticas": [
        "https://www.khanacademy.org/math",
        "https://www.mathsisfun.com/",
        "https://www.symbolab.com/"
    ],
    "Español": [
        "https://www.aprendeblog.com/",
        "https://www.gramatica.com/",
        "https://www.rae.es/"
    ],
    "Ciencias": [
        "https://www.nationalgeographic.com/science/",
        "https://www.sciencebuddies.org/",
        "https://www.khanacademy.org/science"
    ],
}

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    student_id = data.get('student_id')
    subject_averages = data.get('subject_averages', [])

    # Recolectar recomendaciones para promedios < 8
    recommendations = []
    if(len(subject_averages)>0):
        for subject in subject_averages:
            print(subject)
            if float(subject['averageGrade']) < 8:  # Aquí cambiamos 'average_grade' por 'averageGrade'
                subject_name = subject['subjectName']
                resources = RESOURCES.get(subject_name, [])
                recommendations.append({
                    "subject": subject_name,
                    "resources": resources
                })
    
    return jsonify({"recommendations": recommendations})

if __name__ == '__main__':
    print("Iniciando servidor Flask en el puerto 5001...")
    app.run(port=5001)