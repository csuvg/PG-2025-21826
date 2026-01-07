import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

const generateSkills = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("No token found");
        }

        const response = await fetch('https://gamifypy.online/api/user/habilidades', {
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

const generatePositions = (totalSkills) => {
    const positions = [];
    const cols = 10;
    const nodeSpacing = 95;
    const startX = 40;
    const startY = 80;

    for (let i = 0; i < totalSkills; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const offsetX = row % 2 === 1 ? nodeSpacing / 2 : 0;

        positions.push({
            x: startX + (col * nodeSpacing) + offsetX,
            y: startY + (row * nodeSpacing * 0.8)
        });
    }

    return positions;
};

const styles = {
    container: {
        width: '100%',
        maxWidth: '1030px',
        position: 'relative'
    },
    treeContainer: {
        position: 'relative',
        marginBottom: '24px',
        overflowX: 'auto',
        overflowY: 'hidden'
    },
    treeContent: {
        minWidth: 'fit-content',
        height: '600px',
        position: 'relative'
    },
    skillNode: {
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        zIndex: 10
    },
    skillNodeSelected: {
        transform: 'translate(-50%, -50%) scale(1.1)',
        zIndex: 20
    },
    skillNodeUnlocked: {
        opacity: 1
    },
    skillNodeLocked: {
        opacity: 0.3
    },
    nodeCircle: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: '#374151',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#6b7280',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
    },
    nodeCircleSelected: {
        backgroundColor: '#1f2937',
        borderColor: '#3b82f6',
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
    },
    nodeCircleLocked: {
        backgroundColor: '#1f2937',
        borderColor: '#374151'
    },
    detailsPanel: {
        backgroundColor: 'rgba(31, 41, 55, 0.95)',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        border: '1px solid #374151',
        maxWidth: '400px',
        margin: '0 auto 40px auto',
        transition: 'all 0.3s ease'
    },
    skillName: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: '8px'
    },
    skillDescription: {
        color: '#d1d5db',
        fontSize: '14px',
        lineHeight: '1.6',
        marginBottom: '16px'
    },
    placeholder: {
        textAlign: 'center',
        color: '#9ca3af',
        padding: '0 0 60px 0'
    },
    placeholderIcon: {
        width: '32px',
        height: '32px',
        margin: '0 auto 16px',
        opacity: 0.5
    }
};

function SkillNode({ skill, position, isSelected, onClick, isUnlocked }) {
    const nodeStyle = {
        ...styles.skillNode,
        ...(isSelected ? styles.skillNodeSelected : {}),
        ...(isUnlocked ? styles.skillNodeUnlocked : styles.skillNodeLocked),
        left: position.x,
        top: position.y
    };

    const circleStyle = {
        ...styles.nodeCircle,
        ...(isSelected ? styles.nodeCircleSelected : {}),
        ...(!isUnlocked ? styles.nodeCircleLocked : {})
    };

    return (
        <div
            style={nodeStyle}
            onClick={() => onClick(skill)}
            onMouseEnter={(e) => {
                if (isUnlocked) {
                    e.currentTarget.style.transform = isSelected
                        ? 'translate(-50%, -50%) scale(1.15)'
                        : 'translate(-50%, -50%) scale(1.05)';
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = isSelected
                    ? 'translate(-50%, -50%) scale(1.1)'
                    : 'translate(-50%, -50%) scale(1)';
            }}
        >
            <div style={circleStyle}>
                <Zap
                    size={20}
                    color={isSelected ? '#3b82f6' : isUnlocked ? '#6b7280' : '#374151'}
                />
            </div>
        </div>
    );
}

function SkillDetails({ skill }) {
    if (!skill) return null;

    return (
        <div style={styles.detailsPanel}>
            <h3 style={styles.skillName}>
                {skill.nombre}
            </h3>

            <p style={styles.skillDescription}>
                {skill.descripcion}
            </p>
        </div>
    );
}

function Skills() {
    const [skills, setSkills] = useState([]);
    const [positions, setPositions] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState(null);

    useEffect(() => {
        const loadSkills = async () => {
            try {
                const response = await generateSkills();
                const skillsData = response.habilidades;

                if (Array.isArray(skillsData)) {
                    setSkills(skillsData);
                    setPositions(generatePositions(skillsData.length));
                } else {
                    console.error('La respuesta de la API no contiene un array en "habilidades":', response);
                }
            } catch (error) {
                console.error('Error fetching skills:', error);
            }
        };

        loadSkills();
    }, []);

    const handleSkillClick = (skill) => {
        if (!skill.isUnlocked) return;
        setSelectedSkill(selectedSkill?.id === skill.id ? null : skill);
    };

    return (
        <div style={styles.container}>
            <div style={styles.treeContainer}>
                <div style={styles.treeContent}>
                    {skills.map((skill, index) => (
                        <SkillNode
                            key={skill.id}
                            skill={skill}
                            position={positions[index]}
                            isSelected={selectedSkill?.id === skill.id}
                            onClick={handleSkillClick}
                            isUnlocked={skill.isUnlocked}
                        />
                    ))}
                </div>
            </div>

            {selectedSkill && (
                <SkillDetails skill={selectedSkill} />
            )}

            {!selectedSkill && (
                <div style={styles.placeholder}>
                    <Zap style={styles.placeholderIcon} />
                    <p>Haz clic en una habilidad para ver los detalles</p>
                </div>
            )}
        </div>
    );
}

export default Skills;
