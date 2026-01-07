import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './home.css';

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        createParticles();
        setTimeout(animateTerminal, 2000);
    }, []);

    const createParticles = () => {
        const particlesContainer = document.querySelector('.particles');
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';

            const animationDelay = Math.random() * 6 + 's';
            const animationDuration = Math.random() * 4 + 4 + 's';

            particle.style.animationDelay = animationDelay;
            particle.style.animationDuration = animationDuration;
            particle.classList.add('animate');
            particlesContainer.appendChild(particle);
        }
    };

    const animateTerminal = () => {
        const lines = document.querySelectorAll('.terminal-line');
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('show');
            }, (index + 1) * 800);
        });
    };

    const empezarAventura = () => {
        navigate("/auth", { replace: true });
    };

    return (
        <div className="container">
            <div className="particles"></div>

            <h1 className="logo">GamifyPy</h1>
            <p className="subtitle">Domina Python jugando. Cada línea de código te acerca a la victoria.</p>

            <div className="terminal">
                <div className="terminal-header">&gt;&gt;&gt; Iniciando misión Python...</div>
                <div className="terminal-line">def iniciar_aventura():</div>
                <div className="terminal-line">    experiencia = 0</div>
                <div className="terminal-line">    nivel = "Principiante"</div>
                <div className="terminal-line">    print("¡Bienvenido a Gamify.Py!")</div>
                <div className="terminal-line">    return "Aventura iniciada 🐍"</div>
                <div className="terminal-line"><span className="cursor"></span></div>
            </div>

            <button className="cta-button" onClick={empezarAventura}>
                ¡Comenzar Aventura!
            </button>
        </div>
    )
}

export default Home;
