# 🎨 Nivel 12 – Arquitecto Visual

## Lección 1: Funciones para modular dibujo
📌 Organizar código gráfico en funciones claras, con parámetros personalizables, para dibujar múltiples versiones o estructuras similares.

```python
def cuadrado(tortuga, lado, color):
    tortuga.fillcolor(color)
    tortuga.begin_fill()
    for _ in range(4):
        tortuga.forward(lado)
        tortuga.right(90)
    tortuga.end_fill()

def torre(tortuga, base=100):
    # Dibuja dos cuadrados apilados
    for i in range(2):
        cuadrado(tortuga, base, "gray")
        tortuga.left(90)
        tortuga.forward(base)
        tortuga.right(90)
```

## Lección 2: Geometría avanzada
📌 Se puede ir más allá de cuadrados y triángulos, se pueden crear estrellas, flores, espirales, polígonos con lados configurables.

```python
def estrella(tortuga, tamaño, puntas=5, color="gold"):
    tortuga.fillcolor(color)
    tortuga.begin_fill()
    for _ in range(puntas):
        tortuga.forward(tamaño)
        tortuga.right(180 - (180 / puntas))
    tortuga.end_fill()
```

🧠 Puedes anidar bucles para generar figuras aún más complejas:
```python
for _ in range(6):
    estrella(t, 100, 5)
    t.right(60)
```

## Lección 3: Relleno, color y estilo
```python
def hexagono_decorado(tortuga, lado, color_trazo, color_relleno):
    tortuga.pencolor(color_trazo)
    tortuga.fillcolor(color_relleno)
    tortuga.pensize(4)
    tortuga.begin_fill()
    for _ in range(6):
        tortuga.forward(lado)
        tortuga.right(60)
    tortuga.end_fill()
```

- t.pencolor() para el borde
- t.fillcolor() para el interior
- t.bgcolor() si quieres cambiar el fondo de toda la ventana
- pensize() para darle peso al trazo

Sugerencia: Usa una paleta con colores complementarios o armoniosos.

## Lección 4: Mandalas y simetría creativa
📌 Se puede usar rotaciones y funciones reutilizables para crear arte visual simétrico, circular o radial.

```python
def petalo(tortuga, largo):
    for _ in range(2):
        tortuga.circle(largo, 60)
        tortuga.left(120)

def flor(tortuga, repeticiones, largo):
    for _ in range(repeticiones):
        petalo(tortuga, largo)
        tortuga.right(360 / repeticiones)
```

- Ideal para crear mandalas, flores, soles, patrones visuales
- Cada figura se dibuja desde el centro girando un ángulo

Mejora visual:
```python
t.speed("fastest")
turtle.bgcolor("black")
t.pencolor("yellow")
```

## Lección 5: Proyecto Visual Guiado
Este sol tendrá un círculo en el centro y rayos triangulares que lo rodean, usando funciones propias y aprovechando los bucles y rotaciones.

📌 Copia y pega este código en tu editor y ejecútalo para ver cómo se dibuja la casa simple.

### Paso 1: Función para dibujar el círculo central
```python
import turtle as t

# Función para dibujar un círculo (centro del sol)
def dibujar_circulo(tamano, color):
    t.fillcolor(color)
    t.begin_fill()
    t.circle(tamano)
    t.end_fill()
```

### Paso 2: Función para dibujar un rayo
```python
# Función para dibujar un rayo triangular
def dibujar_rayo(tamano, color):
    t.fillcolor(color)
    t.begin_fill()
    for _ in range(3):
        t.forward(tamano)
        t.left(120)  # Ángulo de un triángulo equilátero
    t.end_fill()
```

### Paso 3: Función principal para dibujar el sol
```python
# Función principal para dibujar el sol con rayos
def sol():
    # Dibujo del círculo central (el sol)
    t.penup()
    t.goto(0, -100)
    t.pendown()
    dibujar_circulo(100, "yellow")
    
    # Dibujar los rayos (12 rayos)
    for _ in range(12):
        t.penup()
        t.goto(0, 0)  # Regresamos al centro del sol
        t.pendown()
        t.forward(100)  # Avanzamos hasta el borde del círculo
        dibujar_rayo(50, "orange")  # Dibujamos el rayo
        t.backward(100)  # Regresamos al centro
        t.left(30)  # Rotamos para distribuir los rayos de manera uniforme
    
# Configuración inicial
t.speed(10)
sol()
t.done()
```
