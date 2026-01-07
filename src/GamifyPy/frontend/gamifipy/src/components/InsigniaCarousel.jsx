import React, { useEffect } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Carousel } from 'primereact/carousel';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';

const responsiveOptions = [
    {
        breakpoint: '1400px',
        numVisible: 6,
        numScroll: 1
    },
    {
        breakpoint: '1199px',
        numVisible: 4,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible: 2,
        numScroll: 1
    }
];

function Insignias() {
    const [insignias, setInsignias] = React.useState([]);

    useEffect(() => {
        const getInsignias = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("No token found");
                }

                const response = await fetch('https://gamifypy.online/api/user/insignias', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
                if (!response.ok) {
                    throw new Error("Failed to fetch skills data");
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Error fetching skills data:", error);
                return [];
            }
        };

        getInsignias().then(data => {
            setInsignias(data.insignias || []);
        });
    }, []);

    const itemTemplate = (item) => (
        <Box
            className="text-center py-5 px-3"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <img
                src={`https://gamifypy.online${item.icono.replace('/backend', '')}`}
                alt={item.nombre}
                style={{ width: '160px', height: '160px', objectFit: 'contain' }}
            />
            <Typography variant="body2" sx={{ fontFamily: 'Orbitron, sans-serif', mt: 2, alignItems: 'center', textAlign: 'center' }}>
                {item.nombre}
            </Typography>
        </Box>
    );

    return (
        <>
            {insignias.length === 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'start',
                        flexDirection: 'column',
                        alignItems: 'start',
                        mt: 5
                    }}
                >
                    <Typography variant="h6" sx={{ fontFamily: 'Orbitron, sans-serif', mb: 3 }}>
                        ¡Empieza tu aventura para ganar nuevas insignias!
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'Orbitron, sans-serif', textAlign: 'start', maxWidth: '400px' }}>
                        Completa lecciones y ejercicios para desbloquear insignias que reflejen tus logros y progreso.
                    </Typography>
                </Box>
            ) : insignias.length < 7 ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        flexWrap: 'wrap',
                        gap: 2,
                        mt: 3
                    }}
                >
                    {insignias.map((item, index) => (
                        <Box key={index} className="text-center">
                            {itemTemplate(item)}
                        </Box>
                    ))}
                </Box>
            ) : (
                <Box sx={{ mt: 3 }}>
                    <Carousel
                        value={insignias}
                        itemTemplate={itemTemplate}
                        numVisible={6}
                        numScroll={1}
                        responsiveOptions={responsiveOptions}
                        circular={false}
                        showIndicators={false}
                        showNavigators={true}
                    />
                </Box>
            )}
        </>
    );
}

export default Insignias;
