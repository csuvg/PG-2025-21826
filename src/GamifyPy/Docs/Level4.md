# 🔁 Nivel 4 – Domador de Bucles

## Lección 1: Repeticiones controladas con for

### Idea clave:
El ciclo for se usa para repetir una acción un número determinado de veces o sobre elementos de una colección.

---

```python
for i in range(5):
    print("Hola", i)
```
📌 range(5) genera los números del 0 al 4. Se repite 5 veces.

También funciona con listas:

```python
nombres = ["Ana", "Luis", "Pedro"]
for nombre in nombres:
    print("Hola", nombre)
```
📌 Recorre elemento por elemento de la lista nombres e imprime un saludo para cada uno.

## Lección 2: Repeticiones condicionales con while

### Idea clave:
El ciclo while se repite mientras una condición sea verdadera.

---

```python
x = 0
while x < 5:
    print(x)
    x += 1
```
📌 Ojo con actualizar la variable dentro del ciclo para evitar bucles infinitos.

Cuándo usar while:
- Cuando no sabes cuántas veces se repetirá.
- Por ejemplo, repetir hasta que el usuario escriba algo correcto.

## Lección 3: Rompiendo ciclos con break

### Idea clave:
break detiene el ciclo, aunque la condición siga siendo verdadera.

---

```python
while True:
    entrada = input("Escribe 'salir' para terminar: ")
    if entrada == "salir":
        break
```
📌 Se usa para terminar bucles desde dentro, especialmente en while True.

## Lección 4: Saltar iteraciones con continue

### Idea clave:
continue salta la iteración actual y pasa a la siguiente.

---

```python
for i in range(5):
    if i == 2:
        continue
    print(i)
```
📌 En este ejemplo se imprime 0, 1, 3, 4 (el 2 se salta).

## Lección 5: Combinar bucles y control

### Idea clave:
Se pueden mezclar for, while, break, continue según el problema.

---

### Uso práctico
Adivinar un número en pocos intentos.

```python
numero_secreto = 7
for intento in range(3):
    guess = int(input("Adivina: "))
    if guess == numero_secreto:
        print("¡Correcto!")
        break
    else:
        print("Intenta otra vez")
```
📌 Permite al usuario adivinar el número secreto con hasta 3 intentos, deteniéndose si lo adivina correctamente.

## Lección 6: Errores comunes en bucles

### Errores frecuentes:
- Bucles infinitos: while True sin break
- Condiciones que nunca se cumplen
- Índices fuera de rango en listas
- No modificar la variable que controla el ciclo

```python
i = 0
while i < 5:
    print(i)
    # Falta i += 1 → bucle infinito
```
