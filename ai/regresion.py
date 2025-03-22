import pymysql
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Configuración de la conexión a MySQL
db_config = {
    'host': 'localhost',
    'user': 'root',  # Reemplaza con tu usuario de MySQL
    'password': '',  # Reemplaza con tu contraseña de MySQL
    'database': 'classcov'
}

# Conectar a MySQL
conn = pymysql.connect(**db_config)
cursor = conn.cursor()

# Consulta SQL para obtener los datos de students_subjects
query = """
SELECT student_id, subject_id, average_grade FROM students_subjects;
"""
cursor.execute(query)

# Obtener los datos y convertirlos en un DataFrame
data = cursor.fetchall()
df = pd.DataFrame(data, columns=["student_id", "subject_id", "average_grade"])

# Mapeo de subject_id a nombres de materias
subject_mapping = {
    2: "Español 2",
    3: "Matemáticas 1",
    4: "Historia",
    5: "Biología",
    6: "Ciencias 1"
}

# Reemplazar subject_id por nombres de materias
df["subject"] = df["subject_id"].map(subject_mapping)

# Eliminar la columna subject_id porque ya tenemos los nombres
df.drop(columns=["subject_id"], inplace=True)

# Asumimos que una calificación menor a 8 requiere ayuda
df['needs_help'] = df['average_grade'].apply(lambda x: 1 if x < 8 else 0)

# Preparamos los datos para entrenar el modelo
X = df[['average_grade']]  # Características: calificación
y = df['needs_help']  # Etiqueta: si necesita ayuda o no

# Dividimos los datos en entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Entrenamos el modelo
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Hacemos predicciones y evaluamos el modelo
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Precisión del modelo: {accuracy * 100:.2f}%")

# Guardamos el modelo entrenado
import joblib
joblib.dump(model, 'student_help_model.pkl')

# Mostrar el DataFrame actualizado
print(df.head())

# Cerrar la conexión con la base de datos
cursor.close()
conn.close()
