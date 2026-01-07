# 🛡️ Nivel 8 – Guardián de Listas y Cadenas

## Lección 1: Introducción a listas y mutabilidad

```python
mi_lista = [1, 2, 3, "hola", True]
print(mi_lista[0])      # Accede al primer elemento: 1
mi_lista[1] = 99        # Modifica el segundo elemento
```
📌 Las listas son estructuras de datos que pueden almacenar múltiples valores, incluso de distintos tipos. Son mutables, es decir, pueden cambiar después de ser creadas.

```python
# Mutabilidad y referencias
otra_lista = mi_lista
otra_lista.append(42)
print(mi_lista)  # También cambia porque apuntan al mismo lugar en memoria
```
🧠 Si asignas una lista a otra variable, ambas apuntan al mismo objeto, no se crea una copia. Esto es clave para evitar errores inesperados.

## Lección 2: Métodos importantes de listas

```python
colores = ["rojo", "verde"]
colores.append("azul")             # Agrega al final
colores.insert(1, "amarillo")      # Inserta en la posición 1
colores.remove("rojo")             # Elimina el primer "rojo" encontrado
print(len(colores))                # Muestra cuántos elementos tiene la lista
```
📌 Las listas tienen muchos métodos útiles que modifican su contenido directamente, sin necesidad de crear una nueva lista.

🧠 Practicar con métodos como append(), insert(), remove() o len() te prepara para manejar datos dinámicamente.

## Lección 3: Operaciones y slicing con listas

```python
numeros = [10, 20, 30, 40, 50]
print(numeros[1:4])      # Elementos desde el índice 1 hasta el 3: [20, 30, 40]
print(numeros[::-1])     # Invierte la lista
```
📌 Slicing te permite acceder a subconjuntos de una lista con gran flexibilidad. También puedes invertirla o copiarla con facilidad.

🧠 La sintaxis general es: lista[inicio:fin:paso]. ¡Una herramienta poderosa para procesar datos!

## Lección 4: Cadenas como listas de caracteres

```python
texto = "Python"
print(texto[0])    # 'P'
print(texto[-1])   # 'n'
print(len(texto))  # 6
```
📌 Las cadenas de texto también se comportan como secuencias: puedes acceder a sus caracteres por índice.

🎯 Esta propiedad permite aplicar bucles, slicing y muchas técnicas similares a las de las listas.

🧠 Pero atención: las cadenas son inmutables. No puedes cambiar un carácter directamente como sí puedes con listas.

## Lección 5: Métodos útiles de cadenas

```python
mensaje = " Hola Mundo "
print(mensaje.lower())         # " hola mundo "
print(mensaje.strip())         # "Hola Mundo"
print(mensaje.replace("Hola", "Adiós"))  # " Adiós Mundo "
```
📌 Las cadenas tienen métodos que no modifican la original, sino que devuelven una nueva versión modificada.

💡 Métodos como lower(), strip() y replace() son útiles para limpieza de texto en tareas como validación de datos o análisis de lenguaje.

🧠 Si trabajas con entradas de usuario o textos variables, dominar estos métodos te ahorra muchos problemas.

## Lección 6: De cadenas a listas y viceversa

```python
texto = "rojo,verde,azul"
lista_colores = texto.split(",")      # ['rojo', 'verde', 'azul']
print("-".join(lista_colores))        # 'rojo-verde-azul'
```
📌 split() convierte una cadena en lista usando un separador. join() hace lo opuesto: convierte una lista en una cadena.

🧠 Muy útil para procesamiento de texto, CSVs, y manipulación de datos que vienen en forma de texto plano.

## Lección 7: Bucles con listas y cadenas

```python
palabras = ["python", "código", "lista"]
for p in palabras:
    print(p.upper())  # Imprime cada palabra en mayúsculas
```
📌 Puedes recorrer listas o cadenas con for, y aplicarles operaciones a cada elemento.

```python
letras = [letra for letra in "python"]
print(letras)  # ['p', 'y', 't', 'h', 'o', 'n']
```
🔍 List comprehensions son una forma compacta de crear listas nuevas. Son ideales para tareas repetitivas o filtrados simples.

🧠 Este estilo de programación es más limpio, más rápido y muy utilizado en el mundo real.
