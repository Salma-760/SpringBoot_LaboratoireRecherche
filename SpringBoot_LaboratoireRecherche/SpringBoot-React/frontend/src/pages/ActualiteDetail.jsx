import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams pour récupérer l'ID de l'URL
import axios from 'axios';

// Squelette de chargement pour la page de détail
const DetailSkeleton = () => (
    <div className="pt-8 animate-pulse">
        <div className="h-10 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-8"></div>
        <div className="h-64 bg-gray-300 rounded-lg mb-8"></div>
        <div className="space-y-4">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
    </div>
);


function ActualiteDetail() {
    // Récupérons l'ID depuis l'URL grâce au hook useParams
    const { id } = useParams();

    const [actualite, setActualite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActualite = async () => {
            setLoading(true);
            setError(null);
            try {
                //  Utilisons l'ID pour construire l'URL de l'API
                const response = await axios.get(`http://localhost:8081/api/actualites/${id}`);
                setActualite(response.data);
            } catch (err) {
                setError("L'actualité demandée n'a pas pu être trouvée.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchActualite();
    }, [id]); // Le useEffect se relance si l'ID dans l'URL change

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    if (loading) {
        return <DetailSkeleton />;
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-red-600">{error}</h2>
                <Link to="/actualites" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Retour à la liste des actualités
                </Link>
            </div>
        );
    }

    // Si actualite est null, on affiche un message
    if (!actualite) return null;

    return (
        <div className="pt-8 max-w-4xl mx-auto">
            {/* Fil d'Ariane pour la navigation */}
            <div className="mb-4 text-sm">
                <Link to="/" className="text-blue-600 hover:underline">Accueil</Link>
                <span className="mx-2">/</span>
                <Link to="/actualites" className="text-blue-600 hover:underline">Actualités</Link>
            </div>

            <article>
                <h1 className="text-4xl font-extrabold text-gray-800 mb-2">{actualite.titre}</h1>
                <p className="text-md text-gray-500 mb-6">Publié le {formatDate(actualite.datePublication)}</p>

                <img
                    src={actualite.imageUrl || 'https://via.placeholder.com/800x400?text=Image'}
                    alt={actualite.titre}
                    className="w-full h-auto object-cover rounded-lg shadow-lg mb-8"
                />

                {/* Le contenu complet de l'actualité */}
                <div className="prose lg:prose-xl max-w-none">
                    <p className="lead font-semibold">{actualite.chapeau}</p>
                    <p>{actualite.contenu}</p>
                </div>
            </article>
        </div>
    );
}

export default ActualiteDetail;