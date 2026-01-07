# 🛠️ Nivel 3 – Maestro de Decisiones

## Lección 1: Tomando decisiones con if

### Idea clave:
Usamos if para hacer algo solo si se cumple una condición.

---

📌 if evalúa si la condición es True. Si no, el bloque se omite.

```python
edad = 20
if edad >= 18:
    print("Eres mayor de edad")
```

- Si la condición edad >= 18 es True, se ejecuta el bloque dentro del if.
- Si es False, no pasa nada (por ahora).

## Lección 2: ¿Y si no se cumple? else

### Idea clave:
else sirve para dar una respuesta alternativa cuando el if no se cumple.

---

```python
if edad >= 18:
    print("Eres mayor de edad")
else:
    print("Eres menor de edad")
```
📌 Solo uno de los dos bloques se ejecuta.

## Lección 3: Más caminos con elif

### Idea clave:
Usa elif cuando hay más de dos opciones.

---

```python
nota = 85
if nota >= 90:
    print("Excelente")
elif nota >= 70:
    print("Bien")
else:
    print("Necesitas mejorar")
```
📌 Python evalúa las condiciones de arriba hacia abajo. Cuando encuentra una verdadera, se detiene.

Consejos:
- Puedes tener varios elif, pero solo un else.
- Si ninguna condición se cumple, se ejecuta el else.

## Lección 4: Condicionales anidadas

### Idea clave:
Puedes poner un if dentro de otro para evaluar condiciones más complejas.

---

```python
edad = 18
tiene_id = True

if edad >= 18:
    if tiene_id:
        print("Puedes entrar")
    else:
        print("Trae tu identificación")
```
📌 La sangría (espacios) te muestra qué condición está dentro de cuál.

## Lección 5: Buenas prácticas

### Consejos clave:
- Usa sangría correcta (4 espacios).
- Evita anidaciones profundas innecesarias.
- Pon las condiciones más probables primero.
- Comenta si la lógica es complicada.

---

```python
if usuario == "admin":
    print("Acceso total")
elif usuario == "invitado":
    print("Acceso limitado")
else:
    print("Acceso denegado")
```

## Lección 6: Errores comunes y depuración

### Errores frecuentes:
❌ Olvidar los dos puntos : en el if

❌ No usar sangría

❌ Condiciones imposibles (ej: if x > 10 and x < 5)

❌ Orden incorrecto de if y elif

---

```python
x = 5
if x > 10:
    print("Muy grande")
elif x > 3:
    print("Tamaño medio")
else:
    print("Pequeño")
```
