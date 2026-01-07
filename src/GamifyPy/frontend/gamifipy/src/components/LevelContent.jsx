import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Play, BookOpen, Code, CheckCircle, Lock } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import LessonsDialog from './LessonsDialog';
import ExerciseDialog from './ExcerciseDialog';
import './LevelContent.css';

const LevelContent = ({ id_nivel }) => {
    const [leccionesExpanded, setLeccionesExpanded] = useState(false);
    const [ejerciciosExpanded, setEjerciciosExpanded] = useState(false);
    const [openLessonsDialog, setOpenLessonsDialog] = useState(false);
    const [leccionSeleccionada, setLeccionSeleccionada] = useState(null);
    const [openExcerciseDialog, setOpenExcerciseDialog] = useState(false);
    const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null);
    const [lecciones, setLecciones] = useState([]);
    const [lessonsContent, setLessonsContent] = useState('');
    const [ejercicios, setEjercicios] = useState([]);
    const [openInsigniaDialog, setOpenInsigniaDialog] = useState(false);
    const [nuevasInsignias, setNuevasInsignias] = useState([]);

    {/* Funciones para el manejo de Dialog */ }
    const handleOpenLessonsDialog = async (leccion) => {
        try {
            const response = await fetch(`https://gamifypy.online/api/lessons/${leccion.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            if (!response.ok) {
                throw new Error('Error fetching lesson content');
            }
            const data = await response.json();
            setLessonsContent(data);
            setOpenLessonsDialog(true);
        } catch (error) {
            console.error('Error fetching lesson content:', error);
        }
    }

    const handleCloseLessonsDialog = () => {
        setOpenLessonsDialog(false);
        setLeccionSeleccionada(null);
        setLessonsContent('');
    }

    const handleOpenExcerciseDialog = () => {
        setOpenExcerciseDialog(true);
    }

    const handleCloseExcerciseDialog = () => {
        setOpenExcerciseDialog(false);
    }

    const handleCloseInsigniaDialog = () => {
        setOpenInsigniaDialog(false);
        setNuevasInsignias([]);
    }

    {/* Funciones para el manejo de Insignias */ }
    const checkInsignias = async () => {
        try {
            const res = await fetch(`https://gamifypy.online/api/insignias/assign`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                if (data.nuevas_insignias && data.nuevas_insignias.length > 0) {
                    setNuevasInsignias(data.nuevas_insignias);
                    setOpenInsigniaDialog(true);
                }
            }
        } catch (error) {
            console.error("Error al verificar insignias:", error);
        }
    };

    {/* Funciones para logica de Lecciones */ }
    useEffect(() => {
        const getLecciones = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("No token found");
                }

                const response = await fetch(`https://gamifypy.online/api/category-level/${id_nivel}/lecciones`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (!response.ok) {
                    throw new Error('Error fetching lessons data');
                }
                const data = await response.json();
                setLecciones(data.lecciones);
            } catch (error) {
                console.error('Error fetching lessons data:', error);
            }
        }
        getLecciones();
    }, [id_nivel]);

    const updateLecciones = (leccionId) => {
        setLecciones((prevLecciones) => {
            const updatedLecciones = prevLecciones.map((leccion) => {
                if (leccion.id === leccionId) {
                    return { ...leccion, completada: true };
                }
                if (leccion.id === leccionId + 1) {
                    return { ...leccion, bloqueada: false };
                }
                return leccion;
            });

            if (leccionSeleccionada && leccionSeleccionada.id === leccionId) {
                setLeccionSeleccionada(prev => ({ ...prev, completada: true }));
            }

            checkInsignias();
            return updatedLecciones;
        });
    };

    const handleNextLesson = async () => {
        const currentIndex = lecciones.findIndex(l => l.id === leccionSeleccionada.id);
        const nextIndex = currentIndex + 1;

        if (nextIndex < lecciones.length) {
            const nextLesson = lecciones[nextIndex];
            if (!nextLesson.bloqueada) {
                try {
                    const response = await fetch(`https://gamifypy.online/api/lessons/${nextLesson.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Error fetching lesson content');
                    }
                    const data = await response.json();
                    setLessonsContent(data);
                    setLeccionSeleccionada(nextLesson);
                } catch (error) {
                    console.error('Error fetching next lesson content:', error);
                }
            }
        }
    };

    const hasNextLesson = () => {
        if (!leccionSeleccionada) return false;
        const currentIndex = lecciones.findIndex(l => l.id === leccionSeleccionada.id);
        const nextIndex = currentIndex + 1;
        return nextIndex < lecciones.length && !lecciones[nextIndex]?.bloqueada;
    };

    {/* Funciones para logica de Ejercicios */ }
    const agruparEjercicios = (ejercicios) => {
        const ejerciciosCodigo = ejercicios.filter(ej => ej.tipo === 'codigo');
        const ejerciciosOpcionMultiple = ejercicios.filter(ej => ej.tipo === 'opcion_multiple');

        const gruposOpcionMultiple = [];
        for (let i = 0; i < ejerciciosOpcionMultiple.length; i += 5) {
            const grupo = ejerciciosOpcionMultiple.slice(i, i + 5);
            const grupoId = `grupo_opcion_multiple_${Math.floor(i / 5) + 1}`;
            const todasCompletadas = grupo.every(ej => ej.intento_realizado);
            const algunaEmpezada = grupo.some(ej => ej.intento_realizado);

            gruposOpcionMultiple.push({
                id: grupoId,
                tipo: 'grupo_opcion_multiple',
                preguntas: grupo,
                nombre: `Preguntas ${i + 1}-${Math.min(i + 5, ejerciciosOpcionMultiple.length)}`,
                intento_realizado: todasCompletadas,
                progreso_parcial: algunaEmpezada && !todasCompletadas,
                puntos: grupo.reduce((sum, ej) => sum + (ej.puntos || 0), 0)
            });
        }

        return [...ejerciciosCodigo, ...gruposOpcionMultiple];
    };

    useEffect(() => {
        const getEjercicios = async () => {
            const [resOpciones, resCodigo] = await Promise.all([
                fetch(`https://gamifypy.online/api/questions/${id_nivel}/preguntas/opcion-multiple`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }),
                fetch(`https://gamifypy.online/api/questions/${id_nivel}/preguntas/codigo`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }),
            ]);

            const [dataOpciones, dataCodigo] = await Promise.all([
                resOpciones.json(),
                resCodigo.json()
            ]);
            const todosEjercicios = [...dataOpciones.preguntas, ...dataCodigo.preguntas];
            const ejerciciosAgrup = agruparEjercicios(todosEjercicios);
            setEjercicios(ejerciciosAgrup);
        }
        getEjercicios();
    }, [id_nivel]);

    const updateEjercicios = (ejercicioId, completedAnswers = null) => {
        setEjercicios((prevEjercicios) => {
            const updatedEjercicios = prevEjercicios.map((ej) => {
                if (ej.id === ejercicioId) {
                    const updatedEjercicio = { ...ej };

                    if (ej.tipo === 'grupo_opcion_multiple' && completedAnswers) {
                        updatedEjercicio.preguntas = ej.preguntas.map(pregunta => {
                            const answer = completedAnswers.find(ans => ans.questionId === pregunta.id);
                            if (answer) {
                                return {
                                    ...pregunta,
                                    intento_realizado: true,
                                    respuesta_enviada: answer.selectedOption,
                                    correcto: answer.isCorrect,
                                    retroalimentacion: answer.feedback
                                };
                            }
                            return pregunta;
                        });

                        const todasCompletadas = updatedEjercicio.preguntas.every(p => p.intento_realizado);
                        const algunaEmpezada = updatedEjercicio.preguntas.some(p => p.intento_realizado);
                        updatedEjercicio.intento_realizado = todasCompletadas;
                        updatedEjercicio.progreso_parcial = algunaEmpezada && !todasCompletadas;
                    } else if (ej.tipo === 'codigo') {
                        updatedEjercicio.intento_realizado = true;
                    }

                    return updatedEjercicio;
                }
                return ej;
            });

            if (ejercicioSeleccionado && ejercicioSeleccionado.id === ejercicioId) {
                const updatedSelected = { ...ejercicioSeleccionado };

                if (ejercicioSeleccionado.tipo === 'grupo_opcion_multiple' && completedAnswers) {
                    updatedSelected.preguntas = ejercicioSeleccionado.preguntas.map(pregunta => {
                        const answer = completedAnswers.find(ans => ans.questionId === pregunta.id);
                        if (answer) {
                            return {
                                ...pregunta,
                                intento_realizado: true,
                                respuesta_enviada: answer.selectedOption,
                                correcto: answer.isCorrect,
                                retroalimentacion: answer.feedback
                            };
                        }
                        return pregunta;
                    });

                    const todasCompletadas = updatedSelected.preguntas.every(p => p.intento_realizado);
                    const algunaEmpezada = updatedSelected.preguntas.some(p => p.intento_realizado);

                    updatedSelected.intento_realizado = todasCompletadas;
                    updatedSelected.progreso_parcial = algunaEmpezada && !todasCompletadas;
                } else if (ejercicioSeleccionado.tipo === 'codigo') {
                    updatedSelected.intento_realizado = true;
                }

                setEjercicioSeleccionado(updatedSelected);
            }

            return updatedEjercicios;
        });
        checkInsignias();
    };

    const tipoLabels = {
        "codigo": "Ejercicio de Código",
        "opcion_multiple": "Ejercicio de Opción Múltiple",
    };

    const calculateLessonsProgress = (items) => {
        const completedItems = items.filter(item => item.completada).length;
        return Math.round((completedItems / items.length) * 100);
    };

    const leccionesProgress = calculateLessonsProgress(lecciones);
    const ejerciciosCompletados = ejercicios.filter(ej => ej.intento_realizado).length;
    const ejerciciosProgress = ejercicios.length > 0
        ? Math.round((ejerciciosCompletados / ejercicios.length) * 100)
        : 0;
    const ejerciciosEnabled = leccionesProgress === 100;

    return (
        <div className="level-container">
            <div className="level-max-width">

                {/* Sección de Lecciones */}
                <div className="level-section-container">
                    <div
                        className={`level-section-card level-lecciones-card ${leccionesExpanded ? 'expanded' : ''}`}
                    >
                        {/* Header de Lecciones */}
                        <div className="level-section-header" onClick={() => setLeccionesExpanded(!leccionesExpanded)}>
                            <div className="level-section-header-left">
                                <div className="level-section-icon level-lecciones-icon">
                                    <BookOpen
                                        style={{
                                            width: '2.5vw',
                                            height: '2.5vw',
                                            minWidth: '24px',
                                            minHeight: '24px',
                                            maxWidth: '40px',
                                            maxHeight: '40px',
                                        }}
                                        color="white"
                                    />
                                </div>
                                <div>
                                    <h2 className="level-section-title">Lecciones</h2>
                                    <p className="level-section-subtitle">
                                        {lecciones.length} lecciones disponibles
                                    </p>
                                    <div className="level-section-progress">
                                        <span className="level-progress-text-small level-lecciones-progress-text">
                                            {leccionesProgress}% completado
                                        </span>
                                        <span className="level-progress-text-tiny">
                                            {lecciones.filter(l => l.completada).length} de {lecciones.length} completadas
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="level-section-header-right">
                                {leccionesProgress === 100 && <CheckCircle size={24} color="#22c55e" />}
                                {leccionesExpanded ?
                                    <ChevronDown size={24} color="#9ca3af" /> :
                                    <ChevronRight size={24} color="#9ca3af" />
                                }
                            </div>
                        </div>

                        {/* Barra de progreso de lecciones */}
                        <div className="level-section-progress-bar">
                            <div className="level-section-progress-bar-inner">
                                <div
                                    className="level-lecciones-progress-bar-fill"
                                    style={{ width: `${leccionesProgress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Contenido expandible de lecciones */}
                        {leccionesExpanded && (
                            <div className="level-expanded-content">
                                <div className="level-expanded-content-inner">
                                    <div className="level-items-grid">
                                        {lecciones.map((leccion, index) => (
                                            <div
                                                key={leccion.id}
                                                className={`level-item 
                                                    ${leccion.completada ? 'level-completed-leccion' : 'level-pending-leccion'} 
                                                    ${leccion.bloqueada ? 'level-disabled-leccion' : ''}`}
                                                onClick={() => {
                                                    if (!leccion.bloqueada) {
                                                        setLeccionSeleccionada(leccion);
                                                        handleOpenLessonsDialog(leccion);
                                                    }
                                                }}
                                            >
                                                <div className="level-item-content">
                                                    <div className="level-item-left">
                                                        <div className={`level-item-number 
                                                            ${leccion.completada ? 'level-completed-number' : 'level-pending-number-leccion'}
                                                            ${leccion.bloqueada ? 'level-disabled-number' : ''}`}
                                                        >
                                                            {leccion.completada ? (
                                                                <CheckCircle size={16} />
                                                            ) : leccion.bloqueada ? (
                                                                <Lock size={16} color="#9ca3af" />
                                                            ) : (
                                                                index + 1
                                                            )}
                                                        </div>
                                                        <div className="level-item-text-container">
                                                            <span className="level-item-name">{leccion.titulo}</span>
                                                            <div className="level-item-status">
                                                                {leccion.bloqueada
                                                                    ? 'Bloqueada'
                                                                    : leccion.completada
                                                                        ? 'Completada'
                                                                        : 'Pendiente'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Play
                                                        size={20}
                                                        color={leccion.bloqueada ? "#d1d5db" : "#9ca3af"}
                                                        className="level-play-icon"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <LessonsDialog
                    open={openLessonsDialog}
                    handleClose={handleCloseLessonsDialog}
                    leccion={leccionSeleccionada}
                    lessonContent={lessonsContent}
                    updateLecciones={updateLecciones}
                    onNextLesson={handleNextLesson}
                    hasNextLesson={hasNextLesson()}
                />

                {/* Sección de Ejercicios */}
                <div className={`level-section-container ${!ejerciciosEnabled ? 'disabled-section' : ''}`}>
                    <div
                        className={`level-section-card level-ejercicios-card ${ejerciciosExpanded ? 'expanded' : ''}`}
                        onClick={() => {
                            if (ejerciciosEnabled) setEjerciciosExpanded(!ejerciciosExpanded);
                        }}
                    >
                        {/* Header de Ejercicios */}
                        <div className="level-section-header">
                            <div className="level-section-header-left">
                                <div className="level-section-icon level-ejercicios-icon">
                                    <Code
                                        style={{
                                            width: '2.5vw',
                                            height: '2.5vw',
                                            minWidth: '24px',
                                            minHeight: '24px',
                                            maxWidth: '40px',
                                            maxHeight: '40px',
                                        }}
                                        color="white"
                                    />
                                </div>
                                <div>
                                    <h2 className="level-section-title">Ejercicios</h2>
                                    <p className="level-section-subtitle">
                                        {ejercicios.length} ejercicios de práctica
                                    </p>
                                    {ejerciciosEnabled ? (
                                        <div className="level-section-progress">
                                            <span className="level-progress-text-small level-ejercicios-progress-text">
                                                {ejerciciosProgress}% completado
                                            </span>
                                            <span className="level-progress-text-tiny">
                                                {ejerciciosCompletados} de {ejercicios.length} completados
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="level-section-progress">
                                            <span className="level-progress-text-small level-ejercicios-progress-text">
                                                Bloqueado hasta completar lecciones
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="level-section-header-right">
                                {ejerciciosProgress === 100 && <CheckCircle size={24} color="#22c55e" />}
                                {ejerciciosExpanded ?
                                    <ChevronDown size={24} color="#9ca3af" /> :
                                    <ChevronRight size={24} color="#9ca3af" />
                                }
                            </div>
                        </div>

                        {/* Barra de progreso de ejercicios */}
                        <div className="level-section-progress-bar">
                            <div className="level-section-progress-bar-inner">
                                <div
                                    className="level-ejercicios-progress-bar-fill"
                                    style={{ width: `${ejerciciosProgress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Contenido expandible de ejercicios */}
                        {ejerciciosExpanded && (
                            <div className="level-expanded-content">
                                <div className="level-expanded-content-inner">
                                    <div className="level-exercise-grid">
                                        {ejercicios.map((ejercicio, index) => (
                                            <div
                                                key={ejercicio.id}
                                                className={`level-item ${ejercicio.intento_realizado ? 'level-completed-ejercicio' : 'level-pending-ejercicio'}`}
                                                onClick={() => {
                                                    if (ejerciciosEnabled) {
                                                        setEjercicioSeleccionado(ejercicio);
                                                        handleOpenExcerciseDialog();
                                                    }
                                                }}
                                            >
                                                <div className="level-item-content">
                                                    <div className="level-item-left">
                                                        <div className={`level-item-number ${ejercicio.intento_realizado ? 'level-completed-number' : 'level-pending-number-ejercicio'}`}>
                                                            {ejercicio.intento_realizado ? <CheckCircle size={16} /> : index + 1}
                                                        </div>
                                                        <div className="level-item-text-container">
                                                            <span className="level-item-name-small">
                                                                {ejercicio.tipo === 'grupo_opcion_multiple'
                                                                    ? ejercicio.nombre
                                                                    : tipoLabels[ejercicio.tipo]
                                                                }
                                                            </span>
                                                            <div className="level-item-status">
                                                                {ejercicio.intento_realizado ? 'Completado' : 'Pendiente'}
                                                                {ejercicio.tipo === 'grupo_opcion_multiple' &&
                                                                    ` (${ejercicio.preguntas.filter(p => p.intento_realizado).length}/${ejercicio.preguntas.length})`
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Play size={16} color={ejerciciosEnabled ? "#9ca3af" : "#d1d5db"} className="level-play-icon" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <ExerciseDialog
                    open={openExcerciseDialog}
                    handleClose={handleCloseExcerciseDialog}
                    ejercicio={ejercicioSeleccionado}
                    updateEjercicios={updateEjercicios}
                />
            </div>
            <Dialog
                open={openInsigniaDialog}
                onClose={handleCloseInsigniaDialog}
                aria-labelledby="insignia-dialog-title"
                BackdropProps={{
                    style: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                    },
                }}
                PaperProps={{
                    sx: {
                        background: "linear-gradient(135deg, #111827, #1f2937)",
                        border: "1px solid #374151",
                        borderRadius: "24px",
                        padding: "20px",
                        maxWidth: "720px",
                        width: "100%",
                        color: "#ffffff",
                        boxShadow: "0px 0px 20px rgba(0,0,0,0.8)",
                    },
                }}
            >
                <DialogTitle
                    id="insignia-dialog-title"
                    sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        textAlign: "center",
                    }}
                >
                    ¡Nueva Insignia Desbloqueada!
                </DialogTitle>

                <DialogContent
                    dividers
                    sx={{
                        overflowY: "auto",
                        scrollbarWidth: "none",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                        padding: "20px",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr",
                            gap: "24px",
                            justifyItems: "center",
                        }}
                    >
                        {nuevasInsignias.map((insignia) => (
                            <div
                                key={insignia.id}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "16px",
                                    borderRadius: "16px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                                    transition: "transform 0.3s ease",
                                    background: "linear-gradient(145deg, rgba(55,65,81,0.8), rgba(31,41,55,0.9))",
                                    border: "1px solid #4b5563",
                                    maxWidth: "350px",
                                    width: "100%",
                                }}
                            >
                                <img
                                    src={`https://gamifypy.online${insignia.icono.replace('/backend', '')}`}
                                    alt={insignia.nombre}
                                    style={{
                                        width: "148px",
                                        height: "148px",
                                        marginBottom: "12px",
                                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
                                    }}
                                />
                                <h3
                                    style={{
                                        fontWeight: "600",
                                        fontSize: "1rem",
                                        textAlign: "center",
                                        color: "#81D4FA",
                                        margin: 0,
                                    }}
                                >
                                    {insignia.nombre}
                                </h3>
                                <p
                                    style={{
                                        fontSize: "0.875rem",
                                        color: "#d1d5db",
                                        textAlign: "center",
                                        marginTop: "4px",
                                    }}
                                >
                                    {insignia.descripcion}
                                </p>
                            </div>
                        ))}
                    </div>
                </DialogContent>

                <DialogActions sx={{ justifyContent: "center", padding: "16px" }}>
                    <Button
                        variant="contained"
                        onClick={handleCloseInsigniaDialog}
                        sx={{
                            background: "#81D4FA",
                            color: "#111827",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            borderRadius: "12px",
                            textTransform: "none",
                            paddingX: "24px",
                        }}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default LevelContent;
