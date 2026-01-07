import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import './auth.css'

function ForgotPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [values, setValues] = useState({
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

    const handleNewPassword = async () => {
        if (values.password !== values.confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden.');
            return;
        }

        try {
            const response = await fetch("https://gamifypy.online/api/auth/reset-password", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    new_password: values.password,
                }),
            })
            if (!response.ok) {
                throw new Error("Error al cambiar la contraseña")
            }
            navigate("/auth", { replace: true });
        } catch (error) {
            setErrorMessage(error.message || 'Error al cambiar la contraseña');
            return;
        }
    };

    return (
        <div>
            {/* Alert flotante */}
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
                        onClose={() => setErrorMessage(false)}
                        sx={{
                            color: 'black',
                            backgroundColor: '#f44336',
                        }}
                    >
                        {errorMessage}
                    </Alert>
                </Box>
            )}

            {/* Contenedor principal */}
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
                        variant="h6"
                        sx={{
                            textAlign: 'center',
                            color: 'white',
                            mt: 5,
                            mb: 3,
                            fontWeight: 300,
                        }}
                    >
                        Recuperar contraseña
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            textAlign: 'center',
                            color: 'rgba(255, 255, 255, 0.7)',
                            mb: 2,
                        }}
                    >
                        Ingresa tu nueva contraseña
                    </Typography>

                    {/* Formulario */}
                    <Box
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mt: 7,
                            '& .MuiTextField-root': {
                                m: 2,
                                width: '30ch',
                            },
                        }}
                        noValidate
                        autoComplete="off"
                    >
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

                        {/* Botón de Iniciar Sesión */}
                        <Button
                            variant="contained"
                            sx={{
                                mt: 10,
                                mb: 1,
                                width: '40ch',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                },
                            }}
                            onClick={handleNewPassword}
                        >
                            Cambiar contraseña
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </div>
    )
}

export default ForgotPassword;
