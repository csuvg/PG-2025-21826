import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Slide from '@mui/material/Slide';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function LessonsDialog({ open, handleClose, leccion, lessonContent, updateLecciones, onNextLesson, hasNextLesson }) {
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [progress, setProgress] = useState(0);
    const [lessonCompleted, setLessonCompleted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(15); // eslint-disable-line no-unused-vars

    useEffect(() => {
        if (!open || !leccion) return;
        setLessonCompleted(leccion.completada || false);

        if (!leccion.completada) {
            setIsButtonDisabled(true);
            setProgress(0);
            setTimeRemaining(15);

            const totalTime = 15000;
            const interval = 50;
            const increment = (100 / totalTime) * interval;

            const progressTimer = setInterval(() => {
                setProgress(prev => {
                    const newProgress = prev + increment;
                    if (newProgress >= 100) {
                        setIsButtonDisabled(false);
                        setTimeRemaining(0);
                        clearInterval(progressTimer);
                        return 100;
                    }
                    return newProgress;
                });
            }, interval);

            const countdownTimer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownTimer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => {
                clearInterval(progressTimer);
                clearInterval(countdownTimer);
            };
        } else {
            setIsButtonDisabled(true);
            setProgress(100);
            setTimeRemaining(0);
        }
    }, [open, leccion]);

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }

            const response = await fetch(`https://gamifypy.online/api/lessons/${leccion.id}/completar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
            if (!response.ok) {
                throw new Error('Error al completar la lección');
            }
            updateLecciones(leccion.id);
        } catch (error) {
            console.error('Error al completar la lección:', error);
        }
    }

    const handleNextLessonClick = () => {
        if (onNextLesson) {
            onNextLesson();
            setLessonCompleted(false);
            setProgress(0);
            setTimeRemaining(15);
            setIsButtonDisabled(true);
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
                        backgroundColor: 'rgba(10, 10, 10, 0.3)',
                        boxShadow: 'none',
                    }}
                >
                    <Toolbar>
                        <IconButton
                            edge="start"
                            onClick={handleClose}
                            aria-label="close"
                            sx={{ color: 'white' }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                            <Typography
                                sx={{
                                    color: '#81D4FA',
                                    fontSize: '1.5rem',
                                    fontFamily: "'Orbitron', sans-serif"
                                }}
                                variant="h6"
                                component="div"
                            >
                                {leccion?.nombre || 'Lección'}
                            </Typography>
                        </Box>
                        <Box sx={{ ml: 'auto', p: 2 }}>
                            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                {leccion?.completada ? (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <CheckCircleIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.6rem' } }} />
                                        <p
                                            style={{
                                                fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
                                                margin: 0,
                                            }}
                                        >
                                            ¡Lección Completada!
                                        </p>
                                    </Box>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="inherit"
                                        onClick={handleSubmit}
                                        disabled={isButtonDisabled}
                                        startIcon={
                                            !isButtonDisabled && (
                                                <CheckCircleIcon sx={{ color: '#fff' }} />
                                            )
                                        }
                                        sx={{
                                            py: 1.5,
                                            px: 3,
                                            fontSize: { xs: '0.7rem', sm: '0.9rem' },
                                            fontWeight: 'bold',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            background: isButtonDisabled
                                                ? 'rgba(255, 255, 255, 0.1)'
                                                : '#66BB6A',
                                            color: isButtonDisabled
                                                ? 'rgba(255, 255, 255, 0.3)'
                                                : '#fff',
                                            border: '2px solid rgba(102, 187, 106, 0.3)',
                                            borderRadius: '25px',
                                            minWidth: { xs: '130px', sm: '200px' },
                                            transition: 'all 0.3s ease',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            '&:hover': {
                                                boxShadow: isButtonDisabled
                                                    ? 'none'
                                                    : '0 8px 10px rgba(102, 187, 106, 0.4)',
                                                transform: isButtonDisabled ? 'none' : 'translateY(-2px)',
                                            },
                                            '&:disabled': {
                                                cursor: 'not-allowed',
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                height: '100%',
                                                width: `${progress}%`,
                                                background: 'linear-gradient(45deg, #66BB6A 30%, #4CAF50 90%)',
                                                transition: 'width 0.05s linear',
                                                zIndex: -1,
                                                opacity: isButtonDisabled ? 0.8 : 0,
                                            },
                                        }}
                                    >
                                        {isButtonDisabled ? (
                                            <AccessTimeIcon
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.5)',
                                                    fontSize: { xs: '1.2rem', sm: '1.5rem' },
                                                }}
                                            />
                                        ) : (
                                            'Completar Lección'
                                        )}
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Box sx={{ padding: 4, color: 'white' }}>
                    <ReactMarkdown
                        children={lessonContent.contenido}
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ ...props }) => <h1 style={{ color: '#4FC3F7', fontSize: '2rem', marginTop: '1.5rem' }} {...props} />,
                            h2: ({ ...props }) => <h2 style={{ color: '#81D4FA', fontSize: '1.75rem', marginTop: '1.25rem' }} {...props} />,
                            h3: ({ ...props }) => <h3 style={{ color: '#B3E5FC', fontSize: '1.5rem', marginTop: '1rem' }} {...props} />,
                            h4: ({ ...props }) => <h4 style={{ color: '#E1F5FE', fontSize: '1.25rem', marginTop: '0.75rem' }} {...props} />,
                            h5: ({ ...props }) => <h5 style={{ color: '#E0F7FA', fontSize: '1.1rem' }} {...props} />,
                            h6: ({ ...props }) => <h6 style={{ color: '#B2EBF2', fontSize: '1rem' }} {...props} />,

                            p: ({ ...props }) => <p style={{ color: '#ddd', lineHeight: 1.6, marginBottom: '1rem' }} {...props} />,

                            code: ({ inline, children, ...props }) => {
                                return inline ? (
                                    <code style={{ backgroundColor: '#1e1e2f', color: '#00e676', padding: '2px 4px', borderRadius: '4px' }} {...props}>
                                        {children}
                                    </code>
                                ) : (
                                    <pre style={{
                                        backgroundColor: '#1e1e2f',
                                        color: '#00e676',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        overflowX: 'auto',
                                        marginBottom: '1rem'
                                    }}>
                                        <code {...props}>{children}</code>
                                    </pre>
                                );
                            },

                            ul: ({ ...props }) => <ul style={{ color: '#ccc', paddingLeft: '1.5rem', marginBottom: '1rem' }} {...props} />,
                            ol: ({ ...props }) => <ol style={{ color: '#ccc', paddingLeft: '1.5rem', marginBottom: '1rem' }} {...props} />,
                            li: ({ ...props }) => <li style={{ marginBottom: '0.5rem' }} {...props} />,

                            table: ({ ...props }) => (
                                <table style={{
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                    margin: '1rem 0',
                                    color: '#eee'
                                }} {...props} />
                            ),
                            thead: ({ ...props }) => <thead style={{ backgroundColor: 'rgba(10, 10, 10, 0.3)' }} {...props} />,
                            tbody: ({ ...props }) => <tbody {...props} />,
                            tr: ({ ...props }) => <tr style={{ borderBottom: '1px solid #444' }} {...props} />,
                            th: ({ ...props }) => <th style={{ padding: '0.75rem', border: '1px solid #555', fontWeight: 'bold' }} {...props} />,
                            td: ({ ...props }) => <td style={{ padding: '0.75rem', border: '1px solid #555' }} {...props} />,

                            blockquote: ({ ...props }) => (
                                <blockquote style={{
                                    borderLeft: '4px solid #81D4FA',
                                    margin: '1rem 0',
                                    padding: '0.5rem 1rem',
                                    color: '#aaa',
                                    backgroundColor: '#121212'
                                }} {...props} />
                            ),

                            a: ({ ...props }) => <a style={{ color: '#4FC3F7', textDecoration: 'underline' }} {...props} />,

                            img: ({ ...props }) => (
                                <img
                                    style={{ maxWidth: '100%', borderRadius: '8px', margin: '1rem 0' }}
                                    alt={props.alt || 'imagen'}
                                    {...props}
                                />
                            ),

                            hr: () => <hr style={{ border: 'none', borderTop: '1px solid #444', margin: '2rem 0' }} />,
                        }}
                    />
                </Box>

                {/* Botón flotante para siguiente lección */}
                {(lessonCompleted || (leccion && leccion.completada)) && hasNextLesson && (
                    <Button
                        variant="contained"
                        onClick={handleNextLessonClick}
                        startIcon={<ArrowForwardIcon />}
                        sx={{
                            position: 'fixed',
                            bottom: 30,
                            right: 30,
                            py: 1.5,
                            px: 3,
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            background: '#21CBF3',
                            color: '#fff',
                            border: '2px solid rgba(33, 150, 243, 0.3)',
                            borderRadius: '25px',
                            minWidth: '200px',
                            transition: 'all 0.3s ease',
                            zIndex: 1300,
                            boxShadow: '0 6px 20px rgba(33, 150, 243, 0.3)',
                            '&:hover': {
                                boxShadow: '0 8px 10px rgba(33, 150, 243, 0.5)',
                                transform: 'translateY(-3px) scale(1.02)',
                            },
                            '&:active': {
                                transform: 'translateY(-1px) scale(1.01)',
                            }
                        }}
                    >
                        Siguiente Lección
                    </Button>
                )}
            </Dialog>
        </div>
    );
}

export default LessonsDialog;
