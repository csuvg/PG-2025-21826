import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function TermsPrivacyModal({ open, handleClose, title, content }) {
    return (
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
                {title}
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
                <Typography
                    variant="body2"
                    component="div"
                    sx={{ color: '#d1d5db', whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}
                >
                    {content}
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} sx={{ color: '#ffffff' }}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
