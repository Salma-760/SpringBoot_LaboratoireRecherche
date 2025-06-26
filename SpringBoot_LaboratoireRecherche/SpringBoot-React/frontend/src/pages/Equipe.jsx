import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers } from 'react-icons/fa';

// Le composant pour l'effet de chargement (skeleton)
const MemberSkeleton = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center animate-pulse">
        <div className="w-32 h-32 rounded-full mx-auto bg-gray-300"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mt-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mt-2"></div>
    </div>
);

// Le composant principal de la page "Equipe"
function Equipe() {
    const [membres, setMembres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hook pour charger les données de l'API au montage du composant
    useEffect(() => {
        const fetchEquipe = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8081/api/equipe');
                // Trier les membres par ordre alphabétique
                const sortedData = response.data.sort((a, b) => a.nomComplet.localeCompare(b.nomComplet));
                setMembres(sortedData);
            } catch (err) {
                setError("Impossible de charger les membres de l'équipe.");
                console.error(err);
            } finally {
                // Petit délai pour que l'animation de chargement soit visible
                setTimeout(() => setLoading(false), 500);
            }
        };

        fetchEquipe();
    }, []); // Le tableau vide [] assure que cet effet ne s'exécute qu'une seule fois

    // Le rendu JSX du composant
    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                {/* En-tête de la page */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Notre Équipe</h1>
                    <p className="mt-3 text-lg text-gray-600">
                        Découvrez les chercheurs et les esprits innovants qui composent notre laboratoire.
                    </p>
                </div>

                {/* Affichage conditionnel basé sur l'état de chargement et les erreurs */}
                {loading ? (
                    // Affiche les squelettes pendant le chargement
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => <MemberSkeleton key={i} />)}
                    </div>
                ) : error ? (
                    // Affiche un message d'erreur si l'API a échoué
                    <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>
                ) : (
                    // Affiche la grille des membres si tout s'est bien passé
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                        {membres.map(membre => (
                            <div key={membre.id} className="bg-white p-5 rounded-xl shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center">
                                <img
                                    // === MODIFICATION ICI ===
                                    // On utilise le nouveau chemin de l'image de substitution
                                    src={membre.imageUrl || '/images/profile.jpg'}
                                    alt={`Photo de ${membre.nomComplet}`}
                                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white ring-2 ring-gray-200"
                                />
                                <h3 className="text-xl font-bold mt-4 text-gray-900">{membre.nomComplet}</h3>
                                <p className="text-indigo-600 font-semibold mt-1">{membre.role}</p>
                                <p className="text-sm text-gray-500 mt-1">{membre.specialite}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Equipe;