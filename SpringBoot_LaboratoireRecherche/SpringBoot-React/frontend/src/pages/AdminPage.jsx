import React from "react";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token"); // supprime le token
        navigate("/"); // redirige vers la page d'accueil ou login
    };

    return (
        <div>
            <h1>Page Admin</h1>
            {/* ... contenu Admin ... */}
            <button onClick={handleLogout} className="btn-logout">
                Déconnexion
            </button>
        </div>
    );
};

export default AdminPage;
