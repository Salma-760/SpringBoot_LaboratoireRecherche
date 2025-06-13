import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        // Si pas de token, rediriger vers la page d'accueil/login
        return <Navigate to="/" replace />;
    }

    try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        // Vérifier si le rôle de l'utilisateur est dans la liste des rôles autorisés
        if (allowedRoles.includes(userRole)) {
            // Si le rôle est autorisé, afficher le composant enfant (la page protégée)
            return children;
        } else {
            // Si le rôle n'est pas autorisé, rediriger
            console.warn(`Accès refusé. Rôle requis: ${allowedRoles}, Rôle actuel: ${userRole}`);
            return <Navigate to="/" replace />;
        }
    } catch (error) {
        // Si le token est invalide ou expiré
        console.error("Token invalide ou expiré:", error);
        localStorage.clear(); // Nettoyer le stockage local
        return <Navigate to="/" replace />;
    }
};

export default ProtectedRoute;