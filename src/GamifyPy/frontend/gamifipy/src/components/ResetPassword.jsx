import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, Alert, Box } from '@mui/material';

export default function ResetPassword({ open, handleClose }) {
    const [email, setEmail] = useState("")
    const [alert, setAlert] = useState({ open: false, type: "success", message: "" });

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSend = async () => {
        try {
            const response = await fetch("https://gamifypy.online/api/auth/forgot-password", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                }),
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error("Error al enviar el enlace")
            }

            handleClose();
            setAlert({
                open: true,
                type: "success",
                message: data.message || "Se ha enviado el enlace a tu correo.",
            });

            setTimeout(() => {
                handleClose();
                setAlert({ ...alert, open: false });
            }, 3000);
        } catch (error) {
            console.error(error.message)

            setAlert({
                open: true,
                type: "error",
                message: error.message || "Error al enviar el enlace",
            });

            setTimeout(() => {
                handleClose();
                setAlert({ ...alert, open: false });
            }, 3000);
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="terms-privacy-dialog-title"
                aria-describedby="terms-privacy-dialog-description"
                BackdropProps={{
                    style: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                }}
                PaperProps={{
                    sx: {
                        background: 'linear-gradient(135deg, #111827, #1f2937)',
                        border: '1px solid #374151',
                        borderRadius: '24px',
                        padding: '10px',
                        maxWidth: '640px',
                        width: '100%',
                        color: '#ffffff',
                    },
                }}
            >
                <DialogTitle id="terms-privacy-dialog-title" sx={{ color: '#ffffff' }}>
                    Recuperar contraseña
                </DialogTitle>

                <DialogContent
                    dividers
                    sx={{
                        overflowY: 'scroll',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                    }}
                >
                    <Typography sx={{ marginBottom: '20px' }}>
                        Para recuperar tu contraseña, por favor ingresa tu correo electrónico. Te enviaremos un enlace para restablecerla.
                    </Typography>
                    <TextField
                        id="email"
                        label="Correo Electrónico"
                        variant="standard"
                        value={email}
                        onChange={handleEmailChange}
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
                        fullWidth
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} sx={{ color: '#ffffff' }}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSend} sx={{ color: '#ffffff' }}>
                        Enviar enlace
                    </Button>
                </DialogActions>
            </Dialog>

            {alert.open && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 20,
                        right: 20,
                        zIndex: 9999,
                    }}
                >
                    <Alert
                        severity={alert.type}
                        variant="filled"
                        onClose={() => setAlert({ ...alert, open: false })}
                        sx={{
                            color: "black",
                            backgroundColor: alert.type === "error" ? "#f44336" : "#4caf50",
                        }}
                    >
                        {alert.message}
                    </Alert>
                </Box>
            )}
        </>
    );
}
