# 🧙 Nivel 7 – Mago de Módulos

## Lección 1: ¿Qué es un módulo?
Un módulo es como un cofre lleno de herramientas que puedes usar en tu programa sin tener que construirlas desde cero.

```python
import math
print(math.sqrt(25))  # imprime 5.0
```
math es un módulo que ya viene con Python. Nos da funciones matemáticas listas para usar.

Beneficios:
- Reutilizas código sin escribirlo tú
- Organizas mejor tus proyectos

## Lección 2: Jugando con el azar (random)
El módulo random te permite trabajar con aleatoriedad.

```python
import random
print(random.randint(1, 10))  # número aleatorio del 1 al 10

colores = ["rojo", "verde", "azul"]
print(random.choice(colores))  # elige un color al azar
```

## Lección 3: Matemagia con math
math ofrece funciones matemáticas avanzadas.

```python
import math
print(math.sqrt(49))     # raíz cuadrada
print(math.pow(2, 3))     # 2 elevado a 3
print(math.pi)            # constante π
```

También puedes usar:
- math.floor(x) → redondea hacia abajo
- math.ceil(x) → redondea hacia arriba
- math.sin(x) → seno de un ángulo

Importa solo lo que necesitas:
```python
from math import sqrt, pi
print(sqrt(36))
print(pi)
```

## Lección 4: Creando mi propio módulo
Tú también puedes crear tus propios módulos

Un módulo es solo un archivo .py con funciones que luego puedes importar.

1.	Crea un archivo llamado saludos.py:

```python
# saludos.py
def saludo_mago(nombre):
    return f"Bienvenido, {nombre}, al reino de Python"

def despedida_mago(nombre):
    return f"Hasta luego, {nombre}. Que el código te acompañe."
```

2.	Luego lo usas desde otro archivo:

```python
import saludos

nombre = input("¿Cuál es tu nombre, aprendiz? ")
print(saludos.saludo_mago(nombre))
print(saludos.despedida_mago(nombre))
```

🧠 Puedes organizar tu código por módulos y reutilizarlo.

Buenas prácticas al crear módulos:
- Nómbralos con minúsculas (utilidades.py, juego.py)
- Agrupa funciones que tienen un propósito común
- Usa import para reutilizar funciones donde quieras

## Lección 5: Proyecto mágico
Juego: Generador de hechizos aleatorios

```python
import random

nombres = ["Lux", "Umbra", "Ignis", "Glacies", "Aeris"]
efectos = ["invisibilidad", "fuerza", "curación", "velocidad", "teletransportación"]
elementos = ["fuego", "agua", "viento", "tierra", "rayo"]

def generar_hechizo():
    nombre = random.choice(nombres)
    efecto = random.choice(efectos)
    elemento = random.choice(elementos)
    return f"Hechizo: {nombre} — otorga {efecto} de {elemento}."

# Ejecutamos el hechizo aleatorio
print(generar_hechizo())
```

Salida posible:
```python
Hechizo: Ignis — otorga velocidad de rayo.
```

Aquí aplicamos:
- Funciones
- Aleatoriedad
- Modularidad

Python tiene miles de módulos útiles: datetime, time, os, json, turtle, etc.

Puedes explorarlos e incluso instalarlos con pip.
```bash
pip install nombre_del_modulo
```
