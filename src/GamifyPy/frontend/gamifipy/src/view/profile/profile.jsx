import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import Insignias from "../../components/InsigniaCarousel";
import Skills from "../../components/SkillsList";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import './profile.css'

function Profile() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [progresoData, setProgresoData] = useState(null);
    const [loading, setLoading] = useState(true);

    const getMe = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }

            const responseMe = await fetch('https://gamifypy.online/api/user/me', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!responseMe.ok) {
                throw new Error("Failed to fetch user data");
            }

            const dataMe = await responseMe.json();
            setUserData(dataMe);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setLoading(false);
        }
    };

    const getProgreso = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }

            const responseProgreso = await fetch(`https://gamifypy.online/api/user/progreso`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!responseProgreso.ok) {
                throw new Error("Failed to fetch progreso data");
            }

            const dataProgreso = await responseProgreso.json();
            setProgresoData(dataProgreso);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching progreso data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getMe();
    }, []);

    useEffect(() => {
        if (userData) {
            getProgreso();
        }
    }, [userData]);

    if (loading) {
        return <LoadingBackdrop loading={loading} />;
    }

    const handleBack = () => {
        navigate("/levels");
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token')
        navigate("/", { replace: true });
    };

    return (
        <div className="page-container">
            <div className="profile-Header">
                <div className="profile-Header-buttons">
                    <IconButton onClick={handleBack} >
                        <ArrowBackIcon />
                    </IconButton>
                    <IconButton onClick={handleLogout} >
                        <LogoutIcon />
                    </IconButton>
                </div>
                <div className="profile-Header-user">
                    <h1>{userData ? `${userData.nombre}` : 'Cargando...'}</h1>
                </div>
            </div>
            <div className="profile-statistics">
                {progresoData ? (
                    <>
                        <p>Categoria: {progresoData.Categoria}</p>
                        <p>Nivel actual: {progresoData.Nivel.replace(':', ' - ')}</p>
                        <p>Puntos de experiencia (XP): {progresoData.Puntos}</p>
                    </>
                ) : (
                    <p>Loading progreso data...</p>
                )}
            </div>
            <div className="profile-insignias">
                <h2>Insignias</h2>
                <Box sx={{ overflow: 'hidden' }}>
                    <Insignias />
                </Box>
            </div>
            <div className="profile-skills">
                <h2>Habilidades</h2>
                <Skills />
            </div>
        </div>
    )
}

export default Profile;
