# 📖 Nivel 9 – Maestro de Diccionarios

## Lección 1: ¿Qué es un diccionario?

```python
persona = {
    "nombre": "Luis",
    "edad": 30,
    "ciudad": "Guatemala"
}

print(persona["nombre"])  # Luis
```
📌 Un diccionario es una colección de pares clave:valor. A diferencia de las listas, donde accedes por posición, aquí accedes usando el nombre de la clave.

🧠 Los diccionarios son ideales para representar objetos o registros, como una persona, un producto o una configuración.

## Lección 2: Acceso y modificación

```python
persona["edad"] = 31                 # Modifica el valor de una clave existente
persona["profesión"] = "Ingeniero"   # Agrega una nueva clave con su valor
```
📌 Puedes modificar el valor de una clave existente o agregar nuevas claves simplemente asignando un valor.

🧠 Las claves deben ser únicas y deben ser de un tipo inmutable como str, int o tuple. Si usas una clave repetida, la más reciente sobrescribe la anterior.

## Lección 3: Métodos útiles

```python
print(persona.get("ciudad"))     # Guatemala
print(persona.keys())            # dict_keys(['nombre', 'edad', 'ciudad', 'profesión'])
print(persona.values())          # dict_values([...])
```
📌 El método get() permite acceder a una clave sin riesgo de error si no existe (a diferencia de persona["clave"], que lanza un error).

🧠 También puedes usar .update() para cambiar varios valores a la vez:

```python
persona.update({"edad": 32, "ciudad": "Antigua"})
```
✔️ Útil para evitar errores y mantener el código limpio cuando trabajas con datos que pueden variar.

## Lección 4: Recorrido de diccionarios

```python
for clave in persona:
    print(clave, ":", persona[clave])  # Forma básica

for clave, valor in persona.items():
    print(f"{clave} → {valor}")       # Forma más clara y ordenada
```
📌 Puedes recorrer las claves directamente, o usar .items() para obtener tanto la clave como su valor al mismo tiempo.

🧠 Esto es muy útil cuando quieres mostrar, modificar o filtrar datos en estructuras más complejas.

## Lección 5: Diccionarios anidados

```python
alumnos = {
    "Ana": {"edad": 20, "nota": 85},
    "Luis": {"edad": 22, "nota": 90}
}

print(alumnos["Luis"]["nota"])  # 90
```
📌 Un diccionario puede contener otros diccionarios como valores. Esto te permite organizar datos más estructurados, como registros por nombre o ID.

🔍 Ideal para trabajar con tablas, formularios, bases de datos o estructuras tipo JSON.

🧠 Accedes con doble índice: primero por la clave externa, luego por la interna.

## 📊 Lección 6: Diccionarios para contar elementos

```python
frutas = ["manzana", "pera", "manzana", "naranja", "pera"]
conteo = {}

for fruta in frutas:
    if fruta in conteo:
        conteo[fruta] += 1
    else:
        conteo[fruta] = 1

print(conteo)  # {'manzana': 2, 'pera': 2, 'naranja': 1}
```
📌 Este es un patrón muy común en programación: usar un diccionario para contar la frecuencia de elementos.

🧠 Sirve para hacer análisis de datos, crear histogramas, buscar repeticiones, o generar resúmenes estadísticos.
