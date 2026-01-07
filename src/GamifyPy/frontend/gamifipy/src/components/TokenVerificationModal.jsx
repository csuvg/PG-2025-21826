import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from '@mui/material';
import { InputOtp } from 'primereact/inputotp';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import './TokenVerificationModal.css';

export default function TokenVerificationModal({ open, handleClose, handleVerify }) {
    const [token, setToken] = useState('');

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="token-dialog-title"
            aria-describedby="token-dialog-description"
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
                    maxWidth: '448px',
                    width: '100%',
                    color: '#ffffff',
                },
            }}
        >
            <DialogTitle id="token-dialog-title" sx={{ color: '#ffffff' }}>
                Verifica tu cuenta
            </DialogTitle>

            <DialogContent>
                <DialogContentText id="token-dialog-description" sx={{ color: '#ffffff', marginBottom: '30px' }}>
                    Se ha enviado un token de verificación a tu correo electrónico. Ingresa el código para continuar.
                </DialogContentText>

                <div className="card flex justify-content-center dark-otp-container">
                    <InputOtp
                        value={token}
                        onChange={(e) => setToken(e.value)}
                        integerOnly
                        length={6}
                    />
                </div>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} sx={{ color: '#ffffff' }}>Cancelar</Button>
                <Button
                    onClick={() => handleVerify(token)}
                    sx={{ color: '#ffffff' }}
                    disabled={token.length !== 6}
                >
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
