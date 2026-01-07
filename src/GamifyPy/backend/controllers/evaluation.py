from backend.database import Pregunta, OpcionPregunta
from sqlalchemy.orm import Session
from openai import AsyncOpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def evaluate_multiple_choice(db: Session, pregunta: Pregunta, respuesta: str):
    """ Función para evaluar respuestas de opción múltiple con retroalimentación de IA. """
    opciones = db.query(OpcionPregunta).filter_by(id_preguntas=pregunta.id).all()
    correctas = [opcion.texto_opcion for opcion in opciones if opcion.valor_opcion]
    es_correcto = respuesta in correctas

    prompt = f"""Eres un profesor experto en programación.
    Pregunta: {pregunta.pregunta}
    Opciones: {', '.join([op.texto_opcion for op in opciones])}
    Respuesta del usuario: {respuesta}
    Respuesta correcta: {', '.join(correctas)}

    Evalúa la respuesta del estudiante y genera retroalimentación clara y útil.
    - Si es correcto: di "Resultado: Correcto" y explica brevemente por qué.
    - Si es incorrecto: di "Resultado: Incorrecto", menciona la respuesta correcta y explica por qué es la adecuada.

    Responde SIEMPRE en este formato exacto:
    Resultado: Correcto / Incorrecto
    Retroalimentación:
    [explicación breve y pedagógica]
    """

    completion = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=300,
    )

    feedback_raw = completion.choices[0].message.content.strip()

    resultado_line = next((line for line in feedback_raw.split("\n") if "Resultado:" in line), None)
    if resultado_line:
        resultado = resultado_line.lower().replace("resultado:", "").strip()
        is_correct = resultado == "correcto"
    else:
        is_correct = es_correcto

    feedback_lines = feedback_raw.split("Retroalimentación:", 1)
    feedback = feedback_lines[1].strip() if len(feedback_lines) > 1 else feedback_raw

    return is_correct, feedback

async def evaluate_code(pregunta: Pregunta, respuesta: str):
    """ Función para evaluar respuestas de tipo código utilizando OpenAI. """
    prompt = f""" Eres un experto en Python.

    Pregunta: {pregunta.pregunta}
    Respuesta del usuario: {respuesta}

    Evalúa si la respuesta cumple correctamente. Responde SIEMPRE en este formato exacto:
    Resultado: Correcto / Incorrecto
    Retroalimentación:
    [explicación útil para el estudiante]
    """

    completion = await client.chat.completions.create(
        model = "gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=300,
    )

    feedback_raw = completion.choices[0].message.content.strip()

    resultado_line = next((line for line in feedback_raw.split("\n") if "Resultado:" in line), None)
    if resultado_line:
        resultado = resultado_line.lower().replace("resultado:", "").strip()
        is_correct = resultado == "correcto"
    else:
        is_correct = None

    feedback_lines = feedback_raw.split("Retroalimentación:", 1)
    feedback = feedback_lines[1].strip() if len(feedback_lines) > 1 else feedback_raw

    return is_correct, feedback
