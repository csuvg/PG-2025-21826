# 🧨 Nivel 10 – Invocador de Errores

## Lección 1: ¿Qué es una excepción?

```python
print(10 / 0)  # ZeroDivisionError
```
📌 Una excepción es un error que ocurre durante la ejecución del programa. Si no la controlas, el programa se detiene.

🔍 Algunos errores comunes son: dividir entre cero, acceder a índices inexistentes, convertir tipos incorrectos, etc.

🧠 Las excepciones no siempre significan que tu código está mal, pero necesitas saber cómo reaccionar cuando ocurren.

## Lección 2: Uso básico de try y except

```python
try:
    numero = int(input("Ingresa un número: "))
    print(10 / numero)
except ZeroDivisionError:
    print("No puedes dividir entre cero.")
except ValueError:
    print("Eso no es un número válido.")
```
📌 El bloque try contiene el código que puede fallar. Si ocurre un error, el programa salta al bloque except correspondiente.

✔️ Si no hay error, el bloque except se omite y el código continúa normalmente.

🧠 Puedes manejar diferentes tipos de error con diferentes bloques except, y así evitar que el programa se cierre de forma inesperada.

## Lección 3: Múltiples excepciones

```python
try:
    lista = [1, 2, 3]
    print(lista[5])
except IndexError:
    print("¡Índice fuera del rango!")
```
📌 Puedes capturar errores como IndexError si intentas acceder a un índice inexistente en una lista.

También puedes agrupar varias excepciones:

```python
except (ValueError, TypeError):
    print("Hubo un error de tipo o valor.")
```
🧠 Esto es útil cuando el mismo manejo aplica para varios tipos de error.

✔️ Evita que tu programa se detenga por errores predecibles.

## Lección 4: else y finally

```python
try:
    n = int(input("Número: "))
except ValueError:
    print("Error")
else:
    print("Todo salió bien")
finally:
    print("Fin del intento.")
```
📌 El bloque else se ejecuta solo si no hubo errores en el try.

📌 El bloque finally siempre se ejecuta, haya o no error. Es ideal para liberar recursos o mostrar mensajes finales.

🧠 Esta estructura te da más control sobre el flujo del programa y te permite actuar según el resultado.

## Lección 5: Excepciones comunes
| Excepción           | Cuándo ocurre                                          |
|---------------------|--------------------------------------------------------|
| ZeroDivisionError   | Al dividir entre cero                                  |
| ValueError          | Al convertir datos mal (ej: `int("a")`)                |
| IndexError          | Al acceder a un índice fuera del rango de una lista    |
| KeyError            | Al usar una clave que no existe en un diccionario      |
| TypeError           | Al hacer operaciones entre tipos incompatibles         |

📌 Conocer estas excepciones te permite anticiparte a los errores y hacer programas más robustos.

Recomendaciones finales
- Usa try/except solo donde hay riesgo real de error.
- No uses except: sin especificar el tipo de error, porque podrías ocultar errores importantes.
- Siempre prueba tu código con valores incorrectos a propósito para asegurarte de que tu manejo de errores funciona bien.
