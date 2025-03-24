import spacy
import pymysql
import joblib
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

# Cargar el modelo NLP de spaCy
nlp = spacy.load("es_core_news_sm")

# Cargar el modelo de predicción de ayuda académica
model = joblib.load("student_help_model.pkl")

# Configuración de la conexión a MySQL
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'classcov'
}

# Inicializar Flask
app = Flask(__name__)
CORS(app)

# Mapeo de materias
subject_mapping = {
    2: "Español 2",
    3: "Matemáticas 1",
    4: "Historia",
    5: "Biología",
    6: "Ciencias 1"
}

# Ruta para procesar la ayuda académica basada en NLP
@app.route('/predict_help', methods=['POST'])
def predict_help():
    data = request.get_json()
    user_text = data.get('text', '').lower()
    
    if not user_text:
        return jsonify({'error': 'No se recibió texto'}), 400

    # Procesar el texto con NLP
    doc = nlp(user_text)
    keywords = [token.text for token in doc if token.pos_ in ['NOUN', 'VERB', 'ADJ']]
    
    # Identificar la materia mencionada
    detected_subject = None
    for key, subject in subject_mapping.items():
        if any(word in subject.lower() for word in keywords):
            detected_subject = subject
            break
    
    # Obtener sugerencias desde la BD según la materia
    conn = pymysql.connect(**db_config)
    cursor = conn.cursor()
    
    if detected_subject:
        query = f"SELECT description FROM challenges WHERE subject_id = {key} ORDER BY difficulty DESC LIMIT 3;"
        cursor.execute(query)
        recommendations = [row[0] for row in cursor.fetchall()]
    else:
        recommendations = ["No se encontró una materia específica. Intenta escribir de otra manera."]
    
    cursor.close()
    conn.close()

    return jsonify({
        'message': f'Texto recibido: {user_text}',
        'subject_detected': detected_subject,
        'recommendations': recommendations
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)
