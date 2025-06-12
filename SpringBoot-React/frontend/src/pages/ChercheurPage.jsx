import React from "react";
import { useNavigate } from "react-router-dom";

const ChercheurPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Supprime le token stocké (par exemple dans localStorage)
        localStorage.removeItem("token");
        // Redirige vers la page d'accueil ou de connexion
        navigate("/");
    };

    return (
        <div>
            <h1>Page Chercheur</h1>
            {/* Contenu spécifique pour les chercheurs */}
            <p>Bienvenue, Chercheur !</p>

            {/* Bouton de déconnexion */}
            <button onClick={handleLogout} className="btn-logout">
                Déconnexion
            </button>
        </div>
    );
};

export default ChercheurPage;
