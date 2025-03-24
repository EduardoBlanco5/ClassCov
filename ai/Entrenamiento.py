import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import joblib

# Cargar los datos desde el archivo CSV
df = pd.read_csv('data.csv')

# Definir las características (X) y la etiqueta (y)
X = df[['average_grade']]  # Solo usamos el promedio como característica
y = df['needs_help']  # Etiqueta (necesita ayuda o no)

# Dividir los datos en conjuntos de entrenamiento y prueba (80% - 20%)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Crear y entrenar el modelo de regresión logística
model = LogisticRegression()
model.fit(X_train, y_train)

# Hacer predicciones con el conjunto de prueba
y_pred = model.predict(X_test)

# Evaluar el modelo
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy del modelo: {accuracy * 100:.2f}%")

# Guardar el modelo entrenado en un archivo
joblib.dump(model, 'recommendation_model.pkl')
print("Modelo entrenado y guardado como recommendation_model.pkl")
