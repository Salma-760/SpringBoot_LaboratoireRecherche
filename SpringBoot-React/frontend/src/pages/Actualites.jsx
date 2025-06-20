import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa'; // On ajoute une icône

// Le composant squelette est déjà bien, on peut le garder tel quel.
const NewsSkeleton = () => (
    <div className="flex flex-col md:flex-row gap-6 animate-pulse bg-white p-6 rounded-xl shadow-lg">
        <div className="w-full md:w-1/3 h-48 bg-gray-300 rounded-lg"></div>
        <div className="w-full md:w-2/3 space-y-4">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-6 bg-gray-300 rounded w-1/3 mt-2"></div>
        </div>
    </div>
);

function Actualites() {
    const [actualites, setActualites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActualites = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:8081/api/actualites');
                const sortedData = response.data.sort((a, b) => new Date(b.datePublication) - new Date(a.datePublication));
                setActualites(sortedData);
            } catch (err) {
                setError("Impossible de charger les actualités. Veuillez réessayer plus tard.");
                console.error(err);
            } finally {
                // On garde un petit délai pour que l'animation de chargement soit visible
                setTimeout(() => setLoading(false), 500);
            }
        };

        fetchActualites();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        // On utilise un fond de page pour faire ressortir les cartes
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                {/* Titre de la page, plus centré et aéré */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Nos Actualités
                    </h1>
                    <p className="mt-3 text-lg text-gray-600">
                        Suivez les dernières avancées et les nouvelles de notre laboratoire.
                    </p>
                </div>

                {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-md mb-8">{error}</p>}

                <div className="max-w-4xl mx-auto space-y-12">
                    {loading ? (
                        <>
                            <NewsSkeleton />
                            <NewsSkeleton />
                        </>
                    ) : actualites.length > 0 ? (
                        actualites.map(actu => (
                            // Chaque actualité est maintenant une carte cliquable
                            <Link to={`/actualite/${actu.id}`} key={actu.id} className="group block">
                                <article className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                    {/* Conteneur de l'image */}
                                    <div className="w-full md:w-1/3 flex-shrink-0">
                                        <img
                                            src={actu.imageUrl || 'https://via.placeholder.com/400x250?text=Image'}
                                            alt={actu.titre}
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                    </div>
                                    {/* Conteneur du texte */}
                                    <div className="flex flex-col">
                                        <p className="text-sm font-semibold text-blue-600 mb-1">
                                            {formatDate(actu.datePublication)}
                                        </p>
                                        <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                                            {actu.titre}
                                        </h2>
                                        <p className="text-gray-600 mt-3 text-justify flex-grow line-clamp-3">
                                            {actu.chapeau}
                                        </p>
                                        <div className="mt-4 font-semibold text-blue-600 inline-flex items-center">
                                            Lire la suite
                                            <FaChevronRight className="ml-2 h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-white rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-700">Aucune actualité</h3>
                            <p className="text-gray-500 mt-2">Revenez bientôt pour découvrir nos dernières nouvelles.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Actualites;