import React from 'react';
import { Outlet } from 'react-router-dom';

// Import des composants communs qui constituent le layout
import Navbar from "../components/NavBar";
import Logo from "../components/Logo";
import Footer from "../components/Footer";

const PublicLayout = () => {
    return (
        // La div principale qui organise la page en flex-colonne
        <div className="flex flex-col min-h-screen">

            {/* Le header commun à toutes les pages publiques */}
            <Logo />
            <div className="relative z-10">
                <Navbar />
            </div>

            {/* La zone principale où le contenu spécifique de chaque page sera affiché */}
            <main className="flex-grow">
                {/* Outlet est un placeholder fourni par react-router-dom.
            Il rendra le composant de la route enfant correspondante (Home, About, etc.) */}
                <Outlet />
            </main>

            {/* Le footer commun à toutes les pages */}
            <Footer />
        </div>
    );
};

export default PublicLayout;