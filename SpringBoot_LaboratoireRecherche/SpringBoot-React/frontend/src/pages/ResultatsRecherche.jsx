import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';

const ResultatsRecherche = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();

    const query = searchParams.get('q');

    useEffect(() => {
        if (!query) {
            setLoading(false);
            setSearchResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            const isYear = /^\d{4}$/.test(query);

            if (isYear) {
                params.append('annee', query);
            } else {
                params.append('terme', query);
                params.append('auteur', query);
            }

            try {
                const response = await axios.get(`http://localhost:8081/api/publications?${params.toString()}`);
                setSearchResults(response.data);
            } catch (err) {
                console.error("Erreur lors de la recherche:", err);
                setError('La recherche a échoué. Veuillez réessayer.');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    if (loading) {
        return <div className="text-center p-10">Recherche en cours pour "{query}"...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12 min-h-[50vh]">
            <h1 className="text-3xl font-bold mb-8">
                Résultats de la recherche pour : <span className="text-blue-600">"{query}"</span>
            </h1>

            {searchResults.length > 0 ? (
                <div className="space-y-6">
                    {searchResults.map((pub) => (
                        <div key={pub.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                            <h3 className="text-xl font-bold text-blue-700">{pub.titre}</h3>
                            <p className="text-md text-gray-700 mt-2">
                                <span className="font-semibold">Auteurs :</span> {pub.auteurs.map(a => `${a.prenom} ${a.nom}`).join(', ')}
                            </p>
                            <p className="text-sm text-gray-500 italic mt-1">
                                Publié dans : {pub.journal}, {pub.annee}
                            </p>
                            {pub.resume && (
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                    <h4 className="font-semibold text-slate-800 mb-2">Résumé</h4>
                                    <p className="text-slate-600 text-sm whitespace-pre-wrap">{pub.resume}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <FiSearch className="mx-auto h-16 w-16 text-gray-300" />
                    <h2 className="mt-4 text-2xl font-semibold">Aucun résultat trouvé</h2>
                    <p className="text-gray-500 mt-2">Votre recherche pour "{query}" n'a retourné aucune publication validée.</p>
                </div>
            )}
        </div>
    );
};

export default ResultatsRecherche;