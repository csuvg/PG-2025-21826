# 🎛️ Nivel 6 – Creador de Apps con Streamlit

## Lección 0: Instalando y ejecutando Streamlit
```bash
pip install streamlit
```

Luego, para ejecutar una app:
```bash
streamlit run archivo.py
```
📌 Streamlit convierte archivos .py en aplicaciones web interactivas. Asegúrate de tener Python instalado.

## Lección 1: Mostrando texto y datos
```python
import streamlit as st

st.title("Mi primera app")         # Título principal
st.header("Bienvenido/a")          # Encabezado grande
st.subheader("Este es un subtítulo") # Subtítulo
st.write("Esto es texto normal.")  # Muestra texto sencillo
```
🧠 Estas funciones ayudan a organizar y presentar información visualmente. st.write() es muy versátil: muestra texto, números, listas, DataFrames y más.

## Lección 2: Entrada de texto y números
```python
nombre = st.text_input("¿Cómo te llamas?")  # Input de texto
edad = st.number_input("¿Cuál es tu edad?", min_value=0, max_value=120)  # Input numérico con validación

st.write(f"Hola {nombre}, tienes {edad} años.")  # Respuesta dinámica
```
🧠 Estas entradas capturan valores desde la interfaz, permitiendo interactividad. Muy útil para encuestas, formularios o cálculos.

## Lección 3: Sliders y selección de opciones
```python
calificacion = st.slider("Califica esta app del 1 al 10", 1, 10)  # Slider con valores enteros
genero = st.selectbox("Selecciona tu género", ["Masculino", "Femenino", "Otro"])  # Menú desplegable

st.write(f"Calificación: {calificacion}")
st.write(f"Género: {genero}")
```
🧠 Sliders y selectores permiten limitar las opciones disponibles, facilitando el control de entrada.

## Lección 4: Botones e interactividad
```python
if st.button("Mostrar saludo"):
    st.success("¡Hola! Gracias por usar la app.")  # Mensaje en verde si se hace clic
```
🧠 Los botones permiten ejecutar código solo cuando el usuario lo decide. Perfecto para condiciones, cálculos o respuestas personalizadas.

## Lección 5: Agregando imágenes y emojis
```python
st.image("https://streamlit.io/images/brand/streamlit-logo-primary-colormark-darktext.png", width=200)
st.caption("Este es el logo de Streamlit")  # Texto pequeño debajo de la imagen
```
🧠 Puedes usar imágenes desde URLs o rutas locales. Los emojis también funcionan al incluirlos en strings.

## Lección 6: División en secciones
```python
st.header("Sección 1: Entrada de datos")
st.write("Aquí colocamos los inputs.")

st.markdown("---")  # Línea separadora

st.header("Sección 2: Resultados")
st.write("Aquí mostramos los resultados.")
```
🧠 Organizar visualmente tu app mejora la experiencia del usuario. Usa headers y líneas para dividir partes.

## Lección 7: Proyecto guiado – Mini Calculadora
📌 Copia y pega este código en tu editor y ejecútalo para crear una calculadora.

```python
st.title("Calculadora Simple")

num1 = st.number_input("Número 1")
num2 = st.number_input("Número 2")
op = st.selectbox("Operación", ["Sumar", "Restar", "Multiplicar", "Dividir"])

if st.button("Calcular"):
    if op == "Sumar":
        resultado = num1 + num2
    elif op == "Restar":
        resultado = num1 - num2
    elif op == "Multiplicar":
        resultado = num1 * num2
    elif op == "Dividir":
        resultado = num1 / num2 if num2 != 0 else "Error: división entre cero"
    
    st.success(f"Resultado: {resultado}")
```
🧠 La lógica condicional permite usar Streamlit como herramienta para crear apps interactivas útiles, como calculadoras, formularios o asistentes.
