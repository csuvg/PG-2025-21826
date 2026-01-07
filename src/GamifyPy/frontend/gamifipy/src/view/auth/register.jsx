import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Paper, TextField, IconButton, InputAdornment, Button, Typography, Checkbox } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Alert from '@mui/material/Alert';
import TokenVerificationModal from '../../components/TokenVerificationModal';
import TermsPrivacyModal from '../../components/TermsPrivacyModal';
import './auth.css'

function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [termsModalOpen, setTermsModalOpen] = useState(false);
    const [termsModalTitle, setTermsModalTitle] = useState('');
    const [termsModalContent, setTermsModalContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const handleLogin = () => {
        navigate("/auth", { replace: true });
    }

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setShowPassword((show) => !show);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword((show) => !show);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleTermsChange = (event) => {
        setAcceptTerms(event.target.checked);
    };

    const handleSendPin = async () => {
        if (!values.email || !values.username || !values.password || !values.confirmPassword) {
            setErrorMessage('Por favor, completa todos los campos.');
            console.error('❌ Error: Todos los campos son obligatorios');
            return;
        }

        if (values.password !== values.confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden.');
            return;
        }

        try {
            const response = await fetch('https://gamifypy.online/api/auth/send-pin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Error al enviar el PIN');
            }
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error al enviar el PIN:', error);
            setErrorMessage(error.message || 'Error al enviar el PIN');
            return;
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const handleVerify = async (token) => {
        if (!token || token.length !== 6) {
            setErrorMessage('Por favor, ingresa un token válido de 6 dígitos.');
            return;
        }

        try {
            const verifyResponse = await fetch('https://gamifypy.online/api/auth/verify-pin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                    pin: token,
                }),
            })
            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok) {
                throw new Error(verifyData.detail || 'Error al verificar el pin');
            }

            const registerResponse = await fetch('https://gamifypy.online/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                    username: values.username,
                }),
            })
            const registerData = await registerResponse.json();
            if (!registerResponse.ok) {
                throw new Error(registerData.detail || 'Error al registrar el usuario');
            }
            setIsModalOpen(false);
            navigate("/auth", { replace: true });
        } catch (error) {
            console.error('❌ Error durante la verificación o el registro:', error.message);
            setErrorMessage(error.message || 'Error durante la verificación o el registro');
        }
    };

    const showTerms = () => {
        setTermsModalTitle('Términos y Condiciones');
        fetch('/legal/terminos.txt')
            .then((res) => res.text())
            .then((text) => {
                setTermsModalContent(text);
            })
            .catch((error) => {
                console.error('Error al cargar los términos:', error);
                setTermsModalContent('Error al cargar los Términos y Condiciones.');
            });
        setTermsModalOpen(true);
    };

    const showPrivacy = () => {
        setTermsModalTitle('Política de Privacidad')
        fetch('/legal/politicas.txt')
            .then((res) => res.text())
            .then((text) => {
                setTermsModalContent(text);
            })
            .catch((error) => {
                console.error('Error al cargar las politicas:', error);
                setTermsModalContent('Error al cargar las políticas de privacidad.');
            });
        setTermsModalOpen(true);
    }

    const handleCloseTerms = () => {
        setTermsModalOpen(false);
    }

    return (
        <div>
            {errorMessage && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 20,
                        right: 20,
                        zIndex: 9999,
                    }}
                >
                    <Alert
                        severity="error"
                        variant="filled"
                        onClose={() => setErrorMessage('')}
                        sx={{
                            color: 'black',
                            backgroundColor: '#f44336',
                        }}
                    >
                        {errorMessage}
                    </Alert>
                </Box>
            )}

            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={8}
                    sx={{
                        width: 600,
                        height: 700,
                        backgroundColor: 'transparent',
                        backdropFilter: 'blur(10px)',
                        padding: 3,
                    }}
                >
                    {/* Titulo */}
                    <div className='auth-Title'>
                        <h1>GamifyPy</h1>
                    </div>

                    {/* Texto de bienvenida */}
                    <Typography
                        variant="body2"
                        sx={{
                            textAlign: 'center',
                            color: 'rgba(255, 255, 255, 0.7)',
                            mt: 2,
                            mb: 1,
                        }}
                    >
                        Crea tu cuenta y comienza tu aventura
                    </Typography>

                    {/* Formulario */}
                    <Box
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mt: 1,
                            '& .MuiTextField-root': {
                                m: 2,
                                width: '30ch',
                            },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            id="username"
                            label="Nombre de usuario"
                            variant="standard"
                            value={values.username}
                            onChange={handleChange('username')}
                            InputLabelProps={{
                                sx: {
                                    color: 'white',
                                    '&.Mui-focused': {
                                        color: 'white',
                                    },
                                },
                            }}
                            InputProps={{
                                sx: {
                                    color: 'white',
                                    '&:before': {
                                        borderBottomColor: 'rgba(255, 255, 255, 0.42)',
                                    },
                                    '&:hover:not(.Mui-disabled):before': {
                                        borderBottomColor: 'rgba(255, 255, 255, 0.87)',
                                    },
                                    '&:after': {
                                        borderBottomColor: 'white',
                                    },
                                },
                            }}
                        />
                        <TextField
                            id="email"
                            label="Correo electrónico"
                            variant="standard"
                            type="email"
                            value={values.email}
                            onChange={handleChange('email')}
                            InputLabelProps={{
                                sx: {
                                    color: 'white',
                                    '&.Mui-focused': {
                                        color: 'white',
                                    },
                                },
                            }}
                            InputProps={{
                                sx: {
                                    color: 'white',
                                    '&:before': {
                                        borderBottomColor: 'rgba(255, 255, 255, 0.42)',
                                    },
                                    '&:hover:not(.Mui-disabled):before': {
                                        borderBottomColor: 'rgba(255, 255, 255, 0.87)',
                                    },
                                    '&:after': {
                                        borderBottomColor: 'white',
                                    },
                                },
                            }}
                        />
                        <TextField
                            id="password"
                            label="Contraseña"
                            variant="standard"
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={handleChange('password')}
                            InputProps={{
                                sx: {
                                    color: 'white',
                                    '&:before': {
                                        borderBottomColor: 'rgba(255, 255, 255, 0.42)',
                                    },
                                    '&:hover:not(.Mui-disabled):before': {
                                        borderBottomColor: 'rgba(255, 255, 255, 0.87)',
                                    },
                                    '&:after': {
                                        borderBottomColor: 'white',
                                    },
                                },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                                            }
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            sx={{ color: 'white' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: 'white',
                                    '&.Mui-focused': {
                                        color: 'white',
                                    },
                                },
                            }}
                        />
                        <TextField
                            id="confirmPassword"
                            label="Confirmar contraseña"
                            variant="standard"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={values.confirmPassword}
                            onChange={handleChange('confirmPassword')}
                            InputProps={{
                                sx: {
                                    color: 'white',
                                    '&:before': {
                                        borderBottomColor: 'rgba(255, 255, 255, 0.42)',
                                    },
                                    '&:hover:not(.Mui-disabled):before': {
                                        borderBottomColor: 'rgba(255, 255, 255, 0.87)',
                                    },
                                    '&:after': {
                                        borderBottomColor: 'white',
                                    },
                                },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                                            }
                                            onClick={handleClickShowConfirmPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            sx={{ color: 'white' }}
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: 'white',
                                    '&.Mui-focused': {
                                        color: 'white',
                                    },
                                },
                            }}
                        />

                        <Box sx={{ mt: 2, mb: 2, width: '35ch', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Checkbox
                                checked={acceptTerms}
                                onChange={handleTermsChange}
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&.Mui-checked': {
                                        color: 'white',
                                    },
                                    mr: 1,
                                    mt: -0.5,
                                }}
                            />
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem', lineHeight: 1.4 }}>
                                Acepto los{' '}
                                <span
                                    style={{
                                        color: 'white',
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showTerms();
                                    }}
                                >
                                    términos y condiciones
                                </span>
                                {' '}y la{' '}
                                <span
                                    style={{
                                        color: 'white',
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showPrivacy();
                                    }}
                                >
                                    política de privacidad
                                </span>
                            </Typography>
                            <TermsPrivacyModal
                                open={termsModalOpen}
                                handleClose={handleCloseTerms}
                                title={termsModalTitle}
                                content={termsModalContent}
                            />
                        </Box>

                        {/* Botón de Iniciar Sesión */}
                        <Button
                            variant="contained"
                            disabled={!acceptTerms}
                            sx={{
                                mt: 1,
                                mb: 4,
                                width: '40ch',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                '&.Mui-disabled': {
                                    color: 'white',
                                    opacity: 0.5,
                                },
                            }}
                            onClick={handleSendPin}
                        >
                            Registrarse
                        </Button>
                        <TokenVerificationModal
                            open={isModalOpen}
                            handleClose={handleClose}
                            handleVerify={handleVerify}
                        />

                        {/* Enlaces inferiores */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                }}
                            >
                                ¿Ya tienes cuenta?{' '}
                                <span
                                    style={{
                                        color: 'white',
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                    }}
                                    onClick={handleLogin}
                                >
                                    Inicia sesión
                                </span>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </div>
    )
}

export default Register;
