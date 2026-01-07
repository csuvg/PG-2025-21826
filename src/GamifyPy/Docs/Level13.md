# 🎮 Nivel 13 – Iniciador de Juegos 

## Lección 0: Instalando Pygame

### ¿Qué es Pygame?
Es una biblioteca de Python que permite crear videojuegos de forma sencilla. Nos permite trabajar con gráficos, sonidos, imágenes y eventos de teclado o mouse.

Instalación
```bash
pip install pygame
```

Para verificar que se instaló correctamente, puedes ejecutar:
```python
import pygame
print(pygame.__version__)
```

## Lección 1: Creando una ventana de juego
```python
import pygame

pygame.init()
ventana = pygame.display.set_mode((640, 480))
pygame.display.set_caption("Mi primer juego")
```

📌 Esto crea una ventana básica de 640x480 píxeles.

## Lección 2: Dibujando fondo y color
```python
ventana.fill((135, 206, 250))  # Color celeste (RGB)
pygame.display.update()
```

📌 Los colores en Pygame se definen como tuplas RGB: (Rojo, Verde, Azul)

## Lección 3: Cargar y mostrar una imagen
```python
imagen = pygame.image.load("personaje.png")
ventana.blit(imagen, (100, 100))
pygame.display.update()
```

## Lección 4: Eventos de teclado
```python
for evento in pygame.event.get():
    if evento.type == pygame.KEYDOWN:
        if evento.key == pygame.K_LEFT:
            print("Flecha izquierda presionada")
```

📌 Podemos detectar teclas como K_LEFT, K_RIGHT, K_UP, K_DOWN, K_SPACE, etc.

## Lección 5: Bucle principal del juego
```python
corriendo = True
while corriendo:
    for evento in pygame.event.get():
        if evento.type == pygame.QUIT:
            corriendo = False
    pygame.display.update()

pygame.quit()
```

📌 Este bucle se repite mientras el juego está activo. Detecta eventos como cerrar la ventana.
