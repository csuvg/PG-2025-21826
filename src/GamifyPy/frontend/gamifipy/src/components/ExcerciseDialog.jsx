import React, { useState, useRef, useEffect } from "react";
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import LinearProgress from '@mui/material/LinearProgress';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import QuizIcon from '@mui/icons-material/Quiz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Editor from '@monaco-editor/react';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ExerciseDialog({ open, handleClose, ejercicio, updateEjercicios }) {
    const [selectedOption, setSelectedOption] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [groupAnswers, setGroupAnswers] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [answerConfirmed, setAnswerConfirmed] = useState(false);
    const [codeAnswer, setCodeAnswer] = useState(ejercicio?.codigo_inicial || '');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const editorRef = useRef(null);

    useEffect(() => {
        if (!open) {
            setCodeAnswer('');
            setOutput('');
            setSelectedOption('');
            setAnswerConfirmed(false);
            setCurrentQuestionIndex(0);
            setGroupAnswers([]);
            setShowResults(false);
        } else if (ejercicio?.tipo === 'codigo') {
            setCodeAnswer(ejercicio.codigo_inicial || '');
            setOutput('');
        } else if (ejercicio?.tipo === 'grupo_opcion_multiple') {
            setCurrentQuestionIndex(0);
            setSelectedOption('');
            setAnswerConfirmed(false);

            if (ejercicio.intento_realizado) {
                const previousAnswers = ejercicio.preguntas.map(pregunta => ({
                    questionId: pregunta.id,
                    selectedOption: pregunta.respuesta_enviada,
                    isCorrect: pregunta.correcto,
                    question: pregunta.pregunta,
                    feedback: pregunta.retroalimentacion
                }));
                setGroupAnswers(previousAnswers);
                setShowResults(true);
            } else {
                const preguntasRespondidas = ejercicio.preguntas.filter(p => p.intento_realizado);
                if (preguntasRespondidas.length > 0) {
                    const partialAnswers = preguntasRespondidas.map(pregunta => ({
                        questionId: pregunta.id,
                        selectedOption: pregunta.respuesta_enviada,
                        isCorrect: pregunta.correcto,
                        question: pregunta.pregunta,
                        feedback: pregunta.retroalimentacion
                    }));
                    setGroupAnswers(partialAnswers);
                    setCurrentQuestionIndex(preguntasRespondidas.length);
                } else {
                    setGroupAnswers([]);
                    setCurrentQuestionIndex(0);
                }
                setShowResults(false);
            }
        }
    }, [ejercicio, open]);

    const handleCloseWithSave = () => {
        if (ejercicio?.tipo === 'grupo_opcion_multiple' && groupAnswers.length > 0 && !showResults) {
            updateEjercicios(ejercicio.id, groupAnswers);
        }

        handleClose();
    };

    useEffect(() => {
        if (editorRef.current && ejercicio?.tipo === 'codigo') {
            editorRef.current.setValue(ejercicio.codigo_inicial || '');
        }
    }, [ejercicio?.codigo_inicial, ejercicio?.tipo]);

    {/* Logica para preguntas de opción múltiple */ }
    const handleOptionChange = (event) => {
        if (!answerConfirmed) {
            setSelectedOption(event.target.value);
        }
    };

    const renderGroupResults = () => {
        const correctAnswers = groupAnswers.filter(answer => answer.isCorrect).length;
        const totalQuestions = groupAnswers.length;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);

        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography
                    variant="h4"
                    sx={{
                        color: '#81D4FA',
                        mb: 3,
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: { xs: '1.2rem', sm: '2rem' }
                    }}
                >
                    ¡Ejercicio Completado!
                </Typography>

                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h2"
                        sx={{
                            color: percentage >= 70 ? '#4CAF50' : '#ff9800',
                            mb: 1,
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: { xs: '2rem', sm: '3rem' }
                        }}
                    >
                        {percentage}%
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'white',
                            mb: 3,
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: { xs: '0.9rem', sm: '1.1rem' }
                        }}
                    >
                        {correctAnswers} de {totalQuestions} respuestas correctas
                    </Typography>
                </Box>

                <Box sx={{ textAlign: 'left', mb: 3 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            color: '#81D4FA',
                            mb: 2,
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: { xs: '1rem', sm: '1.2rem' }
                        }}
                    >
                        Resumen de respuestas:
                    </Typography>
                    {groupAnswers.map((answer, index) => (
                        <Paper
                            key={index}
                            elevation={2}
                            sx={{
                                p: 2,
                                mb: 2,
                                backgroundColor: answer.isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                border: `1px solid ${answer.isCorrect ? '#4CAF50' : '#f44336'}`
                            }}
                        >
                            <Typography
                                sx={{
                                    color: 'white',
                                    fontWeight: 'bold',
                                    mb: 1,
                                    fontFamily: "'Orbitron', sans-serif",
                                    fontSize: { xs: '0.85rem', sm: '1rem' }
                                }}
                            >
                                Pregunta {index + 1}:
                            </Typography>
                            <Typography
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    mb: 1,
                                    fontSize: { xs: '0.8rem', sm: '0.95rem' }
                                }}
                            >
                                {answer.question}
                            </Typography>
                            <Typography
                                sx={{
                                    color: 'white',
                                    fontFamily: "'Orbitron', sans-serif",
                                    fontSize: { xs: '0.8rem', sm: '0.95rem' }
                                }}
                            >
                                Tu respuesta: {answer.selectedOption}
                            </Typography>
                            <Typography
                                sx={{
                                    color: answer.isCorrect ? '#4CAF50' : '#f44336',
                                    fontWeight: 'bold',
                                    fontSize: { xs: '0.8rem', sm: '0.95rem' }
                                }}
                            >
                                {answer.isCorrect ? '✓ Correcto' : '✗ Incorrecto'}
                            </Typography>
                            <Typography
                                sx={{
                                    color: 'white',
                                    fontFamily: "'Orbitron', sans-serif",
                                    fontSize: { xs: '0.75rem', sm: '0.9rem' }
                                }}
                            >
                                Retroalimentación: {answer.feedback || 'No hay retroalimentación disponible.'}
                            </Typography>
                        </Paper>
                    ))}
                </Box>
            </Box>
        );
    };

    const renderMultipleChoice = () => {
        const currentQuestion = ejercicio.tipo === 'grupo_opcion_multiple'
            ? ejercicio.preguntas[currentQuestionIndex]
            : ejercicio;

        return (
            <Box sx={{ p: 2 }}>
                {ejercicio.tipo === 'grupo_opcion_multiple' && (
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#81D4FA', mb: 1 }}>
                            Pregunta {currentQuestionIndex + 1} de {ejercicio.preguntas.length}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={(currentQuestionIndex / ejercicio.preguntas.length) * 100}
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#81D4FA'
                                }
                            }}
                        />
                    </Box>
                )}

                <Typography variant="h6" sx={{ color: '#81D4FA', mb: 3, fontFamily: "'Orbitron', sans-serif" }}>
                    {currentQuestion.pregunta}
                </Typography>

                <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <RadioGroup value={selectedOption} onChange={handleOptionChange} sx={{ gap: 2 }}>
                        {currentQuestion.opciones?.map((opcion, index) => {
                            const esSeleccionada = selectedOption === opcion.texto;
                            const esCorrecta = Boolean(opcion.valor);

                            let borderColor = 'rgba(255, 255, 255, 0.1)';
                            if (answerConfirmed) {
                                if (esSeleccionada && esCorrecta) borderColor = '#4CAF50';
                                else if (esSeleccionada && !esCorrecta) borderColor = '#f44336';
                                else if (!esSeleccionada && esCorrecta) borderColor = '#4CAF50';
                            } else {
                                borderColor = esSeleccionada ? '#81D4FA' : 'rgba(255, 255, 255, 0.1)';
                            }

                            return (
                                <Paper
                                    key={index}
                                    elevation={2}
                                    sx={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                        border: `2px solid ${borderColor}`,
                                        borderRadius: '8px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        }
                                    }}
                                >
                                    <FormControlLabel
                                        value={opcion.texto}
                                        control={
                                            <Radio
                                                disabled={answerConfirmed}
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.7)',
                                                    '&.Mui-checked': {
                                                        color: '#81D4FA',
                                                    },
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography sx={{ color: 'white', fontSize: '1.1rem' }}>
                                                {opcion.texto}
                                            </Typography>
                                        }
                                        sx={{
                                            margin: 0,
                                            padding: '16px',
                                            width: '100%',
                                        }}
                                    />
                                </Paper>
                            );
                        })}
                    </RadioGroup>
                </FormControl>

                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    {!answerConfirmed && (
                        <Button
                            variant="contained"
                            onClick={handleAnswerConfirm}
                            disabled={!selectedOption}
                            sx={{
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                background: '#21CBF3',
                                color: '#fff',
                                border: '2px solid rgba(33, 150, 243, 0.3)',
                                borderRadius: '25px',
                                transition: 'all 0.3s ease',
                                px: 4,
                                py: 1.5,
                                '&:hover': {
                                    boxShadow: '0 8px 10px rgba(33, 150, 243, 0.5)',
                                    transform: 'translateY(-3px) scale(1.02)',
                                },
                                '&:disabled': {
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: 'rgba(255, 255, 255, 0.3)',
                                    border: '2px solid rgba(255, 255, 255, 0.2)',
                                    cursor: 'not-allowed'
                                },
                            }}
                        >
                            Confirmar respuesta
                        </Button>
                    )}

                    {answerConfirmed && ejercicio.tipo === 'grupo_opcion_multiple' && (
                        <Button
                            variant="contained"
                            onClick={handleNextQuestion}
                            startIcon={<ArrowForwardIcon />}
                            sx={{
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                background: '#21CBF3',
                                color: '#fff',
                                border: '2px solid rgba(33, 150, 243, 0.3)',
                                borderRadius: '25px',
                                transition: 'all 0.3s ease',
                                px: 4,
                                py: 1.5,
                                '&:hover': {
                                    boxShadow: '0 8px 10px rgba(33, 150, 243, 0.5)',
                                    transform: 'translateY(-3px) scale(1.02)',
                                }
                            }}
                        >
                            {currentQuestionIndex < ejercicio.preguntas.length - 1 ? 'Siguiente pregunta' : 'Ver resultados'}
                        </Button>
                    )}
                </Box>
            </Box>
        );
    };

    const handleAnswerConfirm = async () => {
        if (ejercicio.tipo === 'grupo_opcion_multiple') {
            const currentQuestion = ejercicio.preguntas[currentQuestionIndex];
            const optionSelected = currentQuestion.opciones.find(opt => opt.texto === selectedOption);
            const isCorrect = Boolean(optionSelected?.valor);

            const newAnswer = {
                questionId: currentQuestion.id,
                selectedOption,
                isCorrect,
                question: currentQuestion.pregunta
            };

            setGroupAnswers(prev => [...prev, newAnswer]);
            setAnswerConfirmed(true);

            try {
                const response = await fetch(`https://gamifypy.online/api/questions/${currentQuestion.id}/evaluar`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ respuesta: selectedOption }),
                });
                if (!response.ok) {
                    throw new Error('Error al enviar la respuesta');
                }

                const data = await response.json();
                setGroupAnswers(prev => prev.map(a =>
                    a.questionId === currentQuestion.id ? { ...a, feedback: data.retroalimentacion } : a
                ));
            } catch (error) {
                console.error("Error guardando intento:", error);
            }
        }
    };

    const handleNextQuestion = () => {
        if (ejercicio.tipo === 'grupo_opcion_multiple') {
            if (currentQuestionIndex < ejercicio.preguntas.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedOption('');
                setAnswerConfirmed(false);
            } else {
                setShowResults(true);
            }
        }
    };

    {/* Logica para ejercicios de código */ }
    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        monaco.editor.defineTheme('cyberTheme', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6A9955' },
                { token: 'keyword', foreground: '569CD6' },
                { token: 'string', foreground: 'CE9178' },
                { token: 'number', foreground: 'B5CEA8' },
                { token: 'identifier', foreground: '9CDCFE' },
            ],
            colors: {
                'editor.background': '#0a0a0a',
                'editor.foreground': '#ffffff',
                'editorLineNumber.foreground': '#81D4FA',
                'editor.selectionBackground': '#264f78',
                'editor.lineHighlightBackground': '#2a2d2e',
            },
        });

        monaco.editor.setTheme('cyberTheme');
    };

    const handleCodeChange = (value) => {
        setCodeAnswer(value || '');
    };

    const runCode = async () => {
        setIsRunning(true);
        setOutput('Ejecutando código...');

        try {
            const response = await fetch(`https://gamifypy.online/api/questions/${ejercicio.id}/evaluar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ respuesta: codeAnswer }),
            });
            if (!response.ok) {
                throw new Error('Error al ejecutar el código');
            }

            const data = await response.json();
            setOutput(data.retroalimentacion || 'No se recibió salida del servidor.');
        } catch (error) {
            setOutput('Error al ejecutar el código: ' + error.message);
        } finally {
            setIsRunning(false);
        }
    };

    const renderCodeExercise = () => (
        <Box
            sx={{
                p: 2,
                height: 'calc(100vh - 200px)',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Pregunta */}
            <Typography
                variant="h6"
                sx={{
                    color: '#81D4FA',
                    mb: 3,
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' }
                }}
            >
                {ejercicio.pregunta}
            </Typography>

            {/* Contenedor editor + consola */}
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    flexGrow: 1,
                    minHeight: 0,
                    flexDirection: { xs: 'column', md: 'row' }
                }}
            >
                {/* Editor de código */}
                <Paper
                    elevation={3}
                    sx={{
                        flex: 1,
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(129, 212, 250, 0.3)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: { xs: '250px', md: 'auto' }
                    }}
                >
                    <Box
                        sx={{
                            p: 1.5,
                            background: 'rgba(129, 212, 250, 0.1)',
                            borderBottom: '1px solid rgba(129, 212, 250, 0.2)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#81D4FA',
                                fontFamily: 'monospace',
                                fontSize: '0.9rem',
                                fontWeight: 'bold'
                            }}
                        >
                            main.py
                        </Typography>
                        <IconButton
                            onClick={runCode}
                            disabled={isRunning || !codeAnswer.trim()}
                            sx={{
                                opacity: isRunning || !codeAnswer.trim() ? 0.3 : 1,
                                transition: 'opacity 0.3s ease'
                            }}
                        >
                            <PlayArrowIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                        <Editor
                            height="100%"
                            defaultLanguage="python"
                            value={codeAnswer}
                            onChange={handleCodeChange}
                            onMount={handleEditorDidMount}
                            options={{
                                fontSize: 14,
                                fontFamily: "'Fira Code', 'Monaco', 'Menlo', monospace",
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                renderLineHighlight: 'gutter',
                                lineNumbers: 'on',
                                folding: true,
                                wordWrap: 'on',
                                automaticLayout: true,
                                tabSize: 4,
                                insertSpaces: true,
                                renderWhitespace: 'selection',
                                bracketPairColorization: { enabled: true },
                                guides: {
                                    indentation: true,
                                    bracketPairs: true
                                }
                            }}
                        />
                    </Box>
                </Paper>

                {/* Panel de salida */}
                <Paper
                    elevation={3}
                    sx={{
                        width: { xs: '100%', md: '300px' },
                        background: 'rgba(0, 0, 0, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: { xs: '200px', md: 'auto' }
                    }}
                >
                    <Box
                        sx={{
                            p: 1.5,
                            background: 'rgba(0, 0, 0, 0.3)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#81D4FA',
                                fontFamily: 'monospace',
                                fontSize: '0.9rem',
                                fontWeight: 'bold'
                            }}
                        >
                            Consola
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            flexGrow: 1,
                            p: 2,
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            color: '#00ff00',
                            backgroundColor: '#000',
                            overflow: 'auto',
                            minHeight: '150px'
                        }}
                    >
                        {output ? (
                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{output}</pre>
                        ) : (
                            <Typography
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    fontStyle: 'italic'
                                }}
                            >
                                Presiona "Comprobar" para ver el resultado de tu código...
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );

    {/* Logica para enviar */ }
    const handleSubmit = () => {
        if (ejercicio?.tipo === 'grupo_opcion_multiple') {
            updateEjercicios(ejercicio.id, groupAnswers);
            handleClose();
        } else if (ejercicio?.tipo === 'codigo') {
            updateEjercicios(ejercicio.id);
            handleClose();
        }
    };

    return (
        <div>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                slots={{
                    transition: Transition,
                }}
                PaperProps={{
                    sx: {
                        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0f0f23 100%)',
                        color: '#fff',
                    },
                }}
            >
                <AppBar
                    sx={{
                        position: 'relative',
                        backgroundColor: 'rgba(10, 10, 10, 0.6)',
                        boxShadow: 'none',
                    }}
                >
                    <Toolbar>
                        <IconButton
                            edge="start"
                            onClick={handleCloseWithSave}
                            aria-label="close"
                            sx={{ color: 'white' }}
                        >
                            <CloseIcon />
                        </IconButton>

                        <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 1, sm: 2 } }}>
                            {ejercicio?.tipo === 'grupo_opcion_multiple' ? (
                                <QuizIcon
                                    sx={{
                                        display: { xs: 'none', sm: 'inline-flex' },
                                        color: '#81D4FA',
                                        mr: { sm: 1 },
                                        fontSize: { sm: '1.5rem' },
                                    }}
                                />
                            ) : (
                                <CodeIcon
                                    sx={{
                                        display: { xs: 'none', sm: 'inline-flex' },
                                        color: '#81D4FA',
                                        mr: { sm: 1 },
                                        fontSize: { sm: '1.5rem' },
                                    }}
                                />
                            )}
                            <Typography
                                sx={{
                                    color: '#81D4FA',
                                    fontSize: { xs: '1rem', sm: '1.3rem', md: '1.5rem' },
                                    fontFamily: "'Orbitron', sans-serif",
                                }}
                                variant="h6"
                                component="div"
                            >
                                {ejercicio?.tipo === 'grupo_opcion_multiple' ? 'Pregunta' : 'Ejercicio de Código'}
                            </Typography>
                            <Chip
                                label={`${ejercicio?.puntos || 0} pts`}
                                size="small"
                                sx={{
                                    display: { xs: 'none', sm: 'inline-flex' },
                                    ml: { sm: 2 },
                                    fontSize: { sm: '0.8rem' },
                                    backgroundColor: 'rgba(129, 212, 250, 0.2)',
                                    color: '#81D4FA',
                                    fontWeight: 'bold',
                                }}
                            />
                        </Box>

                        <Box sx={{ ml: 'auto', p: { xs: 1, sm: 2 } }}>
                            <Button
                                variant="contained"
                                color="inherit"
                                onClick={handleSubmit}
                                disabled={
                                    (ejercicio?.tipo === 'grupo_opcion_multiple' && !showResults) ||
                                    (ejercicio?.tipo === 'codigo' && output === '')
                                }
                                startIcon={
                                    !(
                                        (ejercicio?.tipo === 'grupo_opcion_multiple' && !showResults) ||
                                        (ejercicio?.tipo === 'codigo' && output === '')
                                    ) && <CheckCircleIcon sx={{ color: '#fff', fontSize: { xs: '1rem', sm: '1.3rem' } }} />
                                }
                                sx={{
                                    py: { xs: 1, sm: 1.5 },
                                    px: { xs: 2, sm: 3 },
                                    fontSize: { xs: '0.65rem', sm: '0.9rem' },
                                    fontWeight: 'bold',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    background: '#66BB6A',
                                    color: '#fff',
                                    border: '2px solid rgba(102, 187, 106, 0.3)',
                                    borderRadius: '25px',
                                    minWidth: { xs: '130px', sm: '200px' },
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    '&:hover': {
                                        boxShadow:
                                            (ejercicio?.tipo === 'grupo_opcion_multiple' && !showResults) ||
                                                (ejercicio?.tipo === 'codigo' && output === '')
                                                ? 'none'
                                                : '0 8px 10px rgba(102, 187, 106, 0.4)',
                                        transform:
                                            (ejercicio?.tipo === 'grupo_opcion_multiple' && !showResults) ||
                                                (ejercicio?.tipo === 'codigo' && output === '')
                                                ? 'none'
                                                : 'translateY(-2px)',
                                    },
                                    '&:disabled': {
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        color: 'rgba(255, 255, 255, 0.3)',
                                        border: '2px solid rgba(255, 255, 255, 0.2)',
                                        cursor: 'not-allowed',
                                    },
                                }}
                            >
                                {ejercicio?.tipo === 'grupo_opcion_multiple' ? 'Finalizar Ejercicio' : 'Terminar Ejercicio'}
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                    {ejercicio?.tipo === 'grupo_opcion_multiple' && showResults && renderGroupResults()}
                    {ejercicio?.tipo === 'grupo_opcion_multiple' && !showResults && renderMultipleChoice()}
                    {ejercicio?.tipo === 'codigo' && renderCodeExercise()}
                </Box>
            </Dialog>
        </div>
    );
}

export default ExerciseDialog;
