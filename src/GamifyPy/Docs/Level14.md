# 🎮 Nivel 14 – Maestro de Juegos

### Lección 1: Movimiento con teclas
```python
personaje_x = 100
personaje_y = 300

for evento in pygame.event.get():
    if evento.type == pygame.KEYDOWN:
        if evento.key == pygame.K_LEFT:
            personaje_x -= 10
        elif evento.key == pygame.K_RIGHT:
            personaje_x += 10
```

📌 Se deben redibujar todos los objetos y el fondo en cada fotograma.

## Lección 2: Movimiento suave (FPS)
```python
clock = pygame.time.Clock()

while corriendo:
    clock.tick(60)  # 60 fotogramas por segundo
    keys = pygame.key.get_pressed()

    if keys[pygame.K_LEFT]:
        personaje_x -= 5
```

📌 Esto permite que el personaje se mueva mientras la tecla esté presionada.

## Lección 3: Detección de colisiones
```python
jugador = pygame.Rect(personaje_x, personaje_y, 50, 50)
enemigo = pygame.Rect(300, 300, 50, 50)

if jugador.colliderect(enemigo):
    print("¡Colisión!")
```

📌 Rect permite representar áreas para detectar colisiones fácilmente.

## Lección 4: Lógica de juego básica
```python
vidas = 3
puntos = 0

if jugador.colliderect(enemigo):
    vidas -= 1
    personaje_x, personaje_y = 100, 300
    if vidas == 0:
        print("Juego terminado")
```

📌 Puedes mostrar la puntuación con pygame.font.Font.

## Lección 5: Juego simple completo
Objetivo:
Construir un juego básico donde el jugador debe moverse y esquivar meteoritos que caen. Si logra 10 puntos, gana. Si pierde todas sus vidas, pierde.

Instrucciones paso a paso:
1. Crea la ventana del juego
   - Inicializa Pygame.
   - Define una ventana de 600x400 píxeles y un título.

2. Dibuja al jugador
   - Representa al jugador como un rectángulo azul.
   - Colócalo en la parte inferior de la pantalla.

3. Agrega enemigos
   - Usa rectángulos rojos que caen desde arriba.
   - Genera su posición inicial aleatoria.

4. Controla al jugador
   - Usa las flechas izquierda y derecha para moverlo.
   - Evita que se salga de la pantalla.

5. Haz que los enemigos caigan
   - Cada frame bajan un poco.
   - Si salen de la pantalla, reaparecen arriba.
   - Cada vez que uno pasa, suma 1 punto.

6. Detecta colisiones
   - Si un enemigo toca al jugador, pierde una vida.
   - El enemigo reaparece arriba.

7. Muestra el puntaje y vidas
   - Usa texto en pantalla para mostrar ambos.

8. Condiciones de fin del juego
   - Si llega a 10 puntos: gana.
   - Si llega a 0 vidas: pierde.
   - Llama a pygame.quit() al final.

Consejo:
Este es tu primer juego completo. Puede parecer complicado, pero en realidad estás reutilizando muchas piezas que ya conoces: bucles, condiciones, colisiones, texto en pantalla, teclado, etc. ¡Es solo cuestión de ensamblarlo como un rompecabezas!
