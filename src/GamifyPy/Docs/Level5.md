# 🏗️ Nivel 5 – Arquitecto de Funciones

## Lección 1: ¿Qué es una función?
📌 Una función en Python siempre comienza con la palabra clave def, seguida del nombre que le das y unos paréntesis ().

```python
def saludar():
    print("¡Hola, programador!")

saludar()  # Llamamos a la función para que se ejecute
```
🧠 Una función es una porción de código que tiene un nombre y puedes usarla muchas veces sin repetir el mismo código. Si no la llamas, no se ejecuta.

## Lección 2: Mi primera función

```python
def sumar_dos_numeros():
    resultado = 5 + 3
    print("La suma es:", resultado)

sumar_dos_numeros()
```
📌 Las funciones ayudan a organizar mejor tu código y a evitar repetir instrucciones.

🧠 Cada vez que llamas sumar_dos_numeros(), se ejecuta el bloque de código que definiste dentro.

## Lección 3: Funciones con parámetros
📌 Los parámetros permiten que tus funciones sean más flexibles y puedas controlar su comportamiento desde afuera.

```python
def sumar(a, b):
    resultado = a + b
    print(f"La suma de {a} y {b} es {resultado}")

sumar(5, 8)  # Llamamos a la función con argumentos
```
📌 Aquí, a y b son parámetros. Cuando llamas a la función, les das un valor (eso se llama argumento).

🧠 Puedes hacer funciones que usen parámetros para procesar información variable.

```python
def repetir_texto(texto, veces):
    for _ in range(veces):
        print(texto)

repetir_texto("Python es genial", 3)
```
📌 Esto te permite reutilizar una misma función pero con resultados diferentes. ¡Muy poderoso!

### Extra: ¿Qué es return?
📌 Algunas funciones devuelven un resultado con la palabra return. Sirve cuando necesitas usar el valor después.

```python
def sumar(a, b):
    return a + b

resultado = sumar(5, 3)
print("La suma es:", resultado)
```
🧠 Usar return es importante cuando la función debe entregar un valor para usarlo luego.

## Lección 4: Modularidad en acción
📌 Puedes combinar funciones más pequeñas para crear cosas más complejas. Eso se llama modularidad.

```python
def obtener_doble(numero):
    return numero * 2

def imprimir_doble(numero):
    doble = obtener_doble(numero)
    print(f"El doble de {numero} es {doble}")

imprimir_doble(10)
```
🧠 Cada función hace una sola cosa. Al juntarlas, podemos construir procesos más completos.

## Lección 5: Mini proyecto guiado – Calculadora simple

📌 Copia y pega este código en tu editor y ejecútalo para ver cómo funciona la calculadora.

```python
def sumar(a, b):
    return a + b

def restar(a, b):
    return a - b

def calculadora():
    x = 10
    y = 5
    print("Suma:", sumar(x, y))
    print("Resta:", restar(x, y))

calculadora()
```
📌 Usamos funciones con parámetros y funciones que devuelven valores (return).

🧠 Aquí aplicamos:
- Funciones reutilizables
- Parámetros de entrada
- Retorno de valores
- Organización del código

### Bonus Lección: Buenas prácticas con funciones
Reglas y consejos al usar funciones:
- Usa nombres descriptivos (por ejemplo, sumar, no f1)
- No te olvides de llamar a la función o no pasará nada
- Usa return si necesitas que la función devuelva un valor
- Divide problemas grandes en funciones pequeñas (modularidad)
