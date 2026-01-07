import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LevelContent from "../../components/LevelContent";
import './LevelView.css'

function LevelView() {
    const { levelId } = useParams();
    const navigate = useNavigate();
    const [levelTitle, setLevelTitle] = useState("");
    const [levelDescription, setLevelDescription] = useState("");

    useEffect(() => {
        const getLevelInfo = async () => {
            try {
                const respone = await fetch(`https://gamifypy.online/api/category-level/niveles/${levelId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!respone.ok) {
                    throw new Error('Error fetching level data');
                }

                const data = await respone.json();
                setLevelTitle(data.nombre);
                setLevelDescription(data.descripcion);
            } catch (error) {
                console.error('Error fetching level data:', error);
            }
        }
        getLevelInfo();
    }, [levelId]);

    return (
        <div className="levelView-Container">
            <div className="levelView-Header">
                <div className="levelView-Header-buttons">
                    <IconButton onClick={() => navigate('/levels')} >
                        <ArrowBackIcon />
                    </IconButton>
                </div>
                <div className="levelView-Header-title">
                    <h1>{levelTitle}</h1>
                </div>
                <div className="levelView-Heder-Description">
                    <p>{levelDescription}</p>
                </div>
            </div>
            <div className="levelView-Body">
                <LevelContent
                    id_nivel={levelId}
                />
            </div>
        </div>
    )
}

export default LevelView;
