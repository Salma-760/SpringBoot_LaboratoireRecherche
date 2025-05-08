// src/pages/Home.jsx
import React from 'react';

function Home() {
    return (
        <div className="pt-16"> {/* Ajoutez un padding-top pour éviter que la navbar ne chevauche le contenu */}
            <h1 className="text-4xl font-bold text-center mt-8">Bienvenue au Laboratoire de Recherche</h1>
            <p className="text-center text-gray-600 mt-4">
                Nous sommes spécialisés dans la recherche innovante.
            </p>
        </div>
    );
}

export default Home;