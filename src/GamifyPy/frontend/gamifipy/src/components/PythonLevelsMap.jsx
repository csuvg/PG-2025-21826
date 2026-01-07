import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Lock, Star, Play, Trophy, Zap, Code, Brain, Rocket } from 'lucide-react';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoadingBackdrop from './LoadingBackdrop';

const PythonLevelsMap = () => {
    const navigate = useNavigate();
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [mainLevels, setMainLevels] = useState([]);
    const [extraLevels, setExtraLevels] = useState([]);
    const [showExtraLevels, setShowExtraLevels] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleProfile = () => {
        navigate("/profile");
    };

    const getIconForLevel = (id) => {
        const iconMap = { 1: Code, 2: Code, 3: Brain, 4: Brain, 5: Zap, 6: Rocket, 7: Code, 8: Brain, 9: Zap, 10: Rocket, 11: Star, 12: Star, 13: Star, 14: Star };
        return iconMap[id] || Lock;
    }

    useEffect(() => {
        const getLevels = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("No token found");
                }

                const response = await fetch('https://gamifypy.online/api/category-level/niveles', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch levels");
                }

                const data = await response.json();
                const nivelData = data.map(level => ({
                    ...level,
                    icon: getIconForLevel(level.id),
                }))

                const main = nivelData.filter(level => level.id_categoria !== 5);
                const extras = nivelData.filter(level => level.id_categoria === 5);
                setMainLevels(main);
                setExtraLevels(extras);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching levels:", error);
                setLoading(false);
            }
        }
        getLevels();
    }, []);

    const getLevelGradient = (nivel) => {
        if (nivel.completado) {
            return 'linear-gradient(135deg, #22c55e, #16a34a)';
        } else if (!nivel.bloqueado) {
            return 'linear-gradient(135deg, #06b6d4, #0891b2)';
        } else {
            return 'linear-gradient(135deg, #6b7280, #374151)';
        }
    };

    const LevelNode = ({ nivel, position }) => {
        const unlocked = !nivel.bloqueado;
        const completed = nivel.completado;
        const Icon = nivel.icon;

        const nodeStyles = {
            position: 'absolute',
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease',
            cursor: unlocked ? 'pointer' : 'not-allowed'
        };

        const circleStyles = {
            position: 'relative',
            width: '12vw',
            height: '12vw',
            maxWidth: '80px',
            maxHeight: '80px',
            minWidth: '50px',
            minHeight: '50px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
            background: getLevelGradient(nivel),
            border: completed ? '4px solid #fbbf24' : 'none',
            zIndex: 10
        };

        return (
            <div
                style={nodeStyles}
                onClick={() => unlocked && setSelectedLevel(nivel)}
                onMouseEnter={(e) => {
                    if (unlocked) {
                        e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                }}
            >
                <div style={circleStyles}>
                    {!unlocked && (
                        <div style={{
                            position: 'absolute',
                            inset: '0',
                            background: 'rgba(0, 0, 0, 0.5)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Lock
                                style={{
                                    width: '4vw',
                                    height: '4vw',
                                    minWidth: '20px',
                                    minHeight: '20px',
                                    maxWidth: '32px',
                                    maxHeight: '32px'
                                }}
                                color="#d1d5db"
                            />
                        </div>
                    )}

                    <Icon
                        style={{
                            width: '5vw',
                            height: '5vw',
                            minWidth: '24px',
                            minHeight: '24px',
                            maxWidth: '40px',
                            maxHeight: '40px'
                        }}
                        color={unlocked ? 'white' : '#9ca3af'}
                    />

                    {completed && (
                        <div style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: '#fbbf24',
                            borderRadius: '50%',
                            padding: '4px'
                        }}>
                            <Star size={16} color="#92400e" fill="#92400e" />
                        </div>
                    )}

                    <div style={{
                        position: 'absolute',
                        bottom: '-45px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: unlocked ? 'white' : '#6b7280'
                        }}>
                            Nivel {nivel.id}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const mainPositions = [
        { x: 15, y: 10 }, { x: 35, y: 20 }, { x: 55, y: 10 }, { x: 75, y: 20 },
        { x: 85, y: 35 }, { x: 65, y: 45 }, { x: 45, y: 40 }, { x: 25, y: 45 },
        { x: 40, y: 65 }, { x: 60, y: 70 }
    ];

    const extraPositions = [
        { x: 20, y: 105 }, { x: 40, y: 105 }, { x: 60, y: 105 }, { x: 80, y: 105 }
    ];

    const containerStyles = {
        minHeight: showExtraLevels ? '120vh' : '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'visible',
    };

    const overlayStyles = {
        position: 'absolute',
        inset: '0',
    };

    if (loading) {
        return <LoadingBackdrop loading={loading} />;
    }

    return (
        <div style={containerStyles}>
            <div style={overlayStyles} />
            <div style={{ textAlign: 'center', padding: '32px 0', position: 'relative', zIndex: 10 }}>
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '8px',
                }}>
                    Niveles
                </h1>
                <IconButton
                    style={{
                        position: 'absolute',
                        top: 32,
                        right: 32,
                        color: 'white',
                    }}
                >
                    <AccountCircleIcon fontSize="large" onClick={handleProfile} />
                </IconButton>
            </div>

            <div style={{
                position: 'relative',
                height: '80vh',
                margin: '0 32px 32px',
                transition: 'height 0.3s ease'
            }}>
                {mainLevels.map((nivel, index) => (
                    <LevelNode
                        key={nivel.id}
                        nivel={nivel}
                        position={mainPositions[index]}
                    />
                ))}

                {showExtraLevels && extraLevels.map((nivel, index) => (
                    <LevelNode
                        key={nivel.id}
                        nivel={nivel}
                        position={extraPositions[index]}
                    />
                ))}

                {!showExtraLevels && (
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        textAlign: 'center'
                    }}>
                        <button
                            onClick={() => {
                                setShowExtraLevels(true);
                                setTimeout(() => {
                                    window.scrollTo({
                                        top: window.innerHeight * 0.5,
                                        behavior: 'smooth'
                                    });
                                }, 300);
                            }}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'rgba(6, 182, 212, 0.15)',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(6, 182, 212, 0.3)',
                                borderRadius: '24px',
                                padding: '12px 24px',
                                color: '#67e8f9',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.05)';
                                e.target.style.boxShadow = '0 0 10px rgba(34, 211, 238, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            <Trophy size={20} color="#22d3ee" />
                            <span>Mostrar Niveles Extras</span>
                        </button>
                    </div>
                )}

                {showExtraLevels && (
                    <div style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        textAlign: 'center'
                    }}>
                        <button
                            onClick={() => {
                                window.scrollTo({
                                    top: 0,
                                    behavior: 'smooth'
                                });
                                setTimeout(() => {
                                    setShowExtraLevels(false);
                                }, 300);
                            }}
                            style={{
                                background: 'rgba(100, 116, 139, 0.15)',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(100, 116, 139, 0.3)',
                                borderRadius: '16px',
                                padding: '8px 16px',
                                color: '#cbd5e1',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.color = '#ffffff';
                                e.target.style.boxShadow = '0 0 10px rgba(148, 163, 184, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = '#cbd5e1';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            Ocultar Niveles Extras
                        </button>
                    </div>
                )}
            </div>

            {selectedLevel && (
                <div style={{
                    position: 'fixed',
                    inset: '0',
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 50,
                    padding: '16px'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #111827, #1f2937)',
                        border: '1px solid #374151',
                        borderRadius: '24px',
                        padding: '32px',
                        maxWidth: '448px',
                        width: '100%',
                        transform: 'scale(1)',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                margin: '0 auto 16px',
                                borderRadius: '50%',
                                background: getLevelGradient(selectedLevel.id),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <selectedLevel.icon size={40} color="white" />
                            </div>

                            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
                                {selectedLevel.title}
                            </h3>
                            <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
                                {selectedLevel.nombre}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <button
                                    style={{
                                        width: '100%',
                                        fontFamily: '"Orbitron", sans-serif',
                                        backgroundColor: '#009966',
                                        border: 'none',
                                        padding: '12px 24px',
                                        fontWeight: 'bold',
                                        color: '#000',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'scale(1.02)';
                                        e.target.style.boxShadow = '0 0 10px rgba(0, 255, 136, 0.6)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'scale(1)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                    onClick={() => navigate(`/level/${selectedLevel.id}`)}
                                >
                                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Play size={20} fill="white" />
                                        <span>Comenzar Nivel</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setSelectedLevel(null)}
                                    style={{
                                        width: '100%',
                                        background: '#374151',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        padding: '12px 24px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = '#4b5563'}
                                    onMouseLeave={(e) => e.target.style.background = '#374151'}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PythonLevelsMap;
