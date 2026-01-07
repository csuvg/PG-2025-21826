# 🧩 Nivel 1 – Explorador de Variables

## Lección 1: ¿Qué es una variable?

### Objetivo:
Aprender a declarar variables, nombrarlas correctamente y usarlas para guardar información.

---

### ¿Qué es una variable?
Una variable es como una caja con una etiqueta: puedes guardar datos dentro, como texto, números o valores lógicos. Luego puedes abrir esa caja (leer el valor) o cambiar su contenido.

```python
edad = 18 # "edad" es la etiqueta, 18 es lo que guardamos
```

### Cómo crear variables
Solo escribe un nombre, un signo igual = y el valor que quieras guardar:

```python
nombre = "Lucía"
```

---

### Reglas para nombrar variables
- Deben comenzar con letra o _
- Pueden tener letras, números y guiones bajos (_)
- ❌ No deben empezar con un número
- ❌ No pueden contener espacios o símbolos
- ❌ No uses nombres reservados de Python (como print, if, for)

```python
# Válidos
nombre_usuario = "Ana"
edad2 = 25

# Inválidos
2nombre = "Carlos"        # ❌
nombre usuario = "Luis"   # ❌
print = 10                # ❌
```

## Lección 2: Tipos de datos básicos

### Objetivo: 
Comprender los tipos básicos en Python: int, float, str, bool.

---

En Python, todo dato tiene un tipo. Algunos ejemplos:
```python
entero = 5        # int → número entero
decimal = 3.14    # float → número con decimales
texto = "Hola"    # str → texto o cadena de caracteres
logico = True     # bool → lógico (verdadero o falso)
```

Podemos verificar su tipo con type():
```python
print(type(entero))  # <class 'int'>
```

También podemos convertir entre tipos:
```python
edad = "21"
edad_num = int(edad)   # convierte de str a int
```

## Lección 3: Operaciones aritméticas

### Objetivo: 
Usar operadores matemáticos básicos en Python.

---

Python soporta varias operaciones:
| Operador | Descripción         | Ejemplo        |
|----------|---------------------|----------------|
| `+`      | Suma                | `3 + 2`        |
| `-`      | Resta               | `5 - 1`        |
| `*`      | Multiplicación      | `2 * 3`        |
| `/`      | División flotante   | `5 / 2 = 2.5`  |
| `//`     | División entera     | `5 // 2 = 2`   |
| `%`      | Módulo (residuo)    | `5 % 2 = 1`    |
| `**`     | Potencia            | `2 ** 3 = 8`   |

Ejemplo:
```python
a = 10
b = 3

print(a + b)  # 13
print(a % b)  # 1
```

## Lección 4: Imprimir y mostrar datos

### Objetivo: 
Aprender a mostrar información al usuario con print() y a combinar textos.

---

```python
print("Hola")  # Muestra un mensaje
```

Podemos concatenar textos:
```python
nombre = "Sebastián"
print("Hola " + nombre)
```

También usar f-strings (más recomendado):
```python
edad = 21
print(f"Tienes {edad} años")
```

## Lección 5: Práctica de variables y operaciones

### Objetivo:
Aplicar lo aprendido usando variables, tipos de datos y operaciones con entradas (input) y salidas (print).

---

### ¿Qué es input()?
input() permite al usuario escribir datos cuando el programa está corriendo. El valor ingresado siempre se guarda como texto (str), aunque parezca un número.

```python
nombre = input("¿Cómo te llamas?")  
```

📌 Aquí, el programa mostrará el mensaje y esperará que el usuario escriba algo. Eso se guarda en la variable nombre.

### Usar input con operaciones
Para poder hacer operaciones matemáticas, debemos convertir la entrada a un número con int() o float():

```python
edad = input("¿Qué edad tienes?")
edad = int(edad)  # Convertimos el texto a número entero (int)
print(edad + 1)   # Ahora podemos sumar
```

También se puede convertir directamente en una sola línea:
```python
edad = int(input("¿Qué edad tienes?"))
```

### Ejemplo completo:
```python
nombre = input("¿Cómo te llamas? ")
edad = int(input("¿Cuántos años tienes? "))
nueva_edad = edad + 1
print(f"Hola {nombre}, el próximo año tendrás {nueva_edad} años.")
```

