# GamifyPy

## Descripción
GamifyPy es una plataforma educativa gamificada diseñada para enseñar programación en Python a estudiantes universitarios de primer año que ingresan sin experiencia previa. La plataforma enfrenta el problema de la baja motivación y dificultad inicial al aprender a programar, ofreciendo un ambiente interactivo basado en niveles progresivos, lecciones, ejercicios prácticos, puntos e insignias. A través de esta estrategia, la plataforma busca mejorar la comprensión, el compromiso y motivación en el aprendizaje de Python.

## Tecnologías Utilizadas
- **Python 3.11**: lógica del backend
- **FastAPI**: servidor API REST
- **PostgreSQL**: base de datos relacional
- **React 19 + Vite**: frontend SPA
- **Node.js 20 / npm**: herramientas de frontend
- **Docker / Nginx**: contenedores y despliegue (Dockerfiles incluidos)

> **Nota Importante:**  
> Para ejecutar los servicios en contenedores se requiere un archivo **`docker-compose.yml`** donde se definan volúmenes, variables de entorno, dependencias entre servicios y configuración completa del backend, frontend y base de datos.  
> El repositorio contiene la estructura base y los Dockerfiles necesarios, pero **el `docker-compose` debe configurarse externamente según el entorno de despliegue**.

## Requisitos Previos
Asegúrate de contar con las siguientes herramientas:

- `Python 3.11+`
- `Node.js v20+` (incluye `npm`)
- `PostgreSQL 14+` (u otra versión compatible)
- `Docker`
- `git`

## Instalación

1. Clonar el repositorio:
	 ```bash
	 git clone https://github.com/Sebas021210/GamifyPy.git
	 ```

2. Backend (API - FastAPI):

	 - Entrar en la carpeta del backend e instalar dependencias:
		 ```bash
		 cd backend
		 python -m venv venv
		 pip install -r requirements.txt
		 ```

	 - Configurar variables de entorno:
		 - Crear el archivo `.env` a partir del ejemplo:
         ```bash
         cp .env.example .env
         ```
		 - Editar las variables según tu entorno (base de datos, claves, etc.).

	 - Ejecutar la API (desarrollo):
		 ```bash
		 uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
		 ```

3. Frontend (React + Vite):

	 - Instalar dependencias y arrancar en modo desarrollo:
		 ```bash
		 cd frontend/gamifipy
		 npm install
		 npm run dev
		 ```

## Demo
El video demostrativo se encuentra en [/demo/demo.mp4](demo/demo.mp4)

## Documentación
El informe final del proyecto está disponible en [/docs/informe_final.pdf](docs/informe_final.pdf)

## Autores
- Sebastián José Solorzano Pérez - 21826
