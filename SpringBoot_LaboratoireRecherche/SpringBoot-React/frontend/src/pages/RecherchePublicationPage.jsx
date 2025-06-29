import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { FiBookOpen, FiUser, FiCalendar } from 'react-icons/fi';

const RecherchePublicationPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialiser les états depuis les paramètres de l'URL pour la persistance
    const [terme, setTerme] = useState(searchParams.get('terme') || '');
    const [auteur, setAuteur] = useState(searchParams.get('auteur') || '');
    const [annee, setAnnee] = useState(searchParams.get('annee') || '');

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    const performSearch = async (criteres) => {
        if (!criteres.terme && !criteres.auteur && !criteres.annee) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        setLoading(true);
        setError(null);
        setHasSearched(true);

        const params = new URLSearchParams();
        if (criteres.terme) params.append('terme', criteres.terme);
        if (criteres.auteur) params.append('auteur', criteres.auteur);
        if (criteres.annee) params.append('annee', criteres.annee);

        setSearchParams(params);

        try {
            const response = await axios.get(`http://localhost:8081/api/publications?${params.toString()}`);
            setResults(response.data);
        } catch (err) {
            setError('La recherche a échoué. Veuillez réessayer.');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    // Effet pour lancer une recherche si l'URL contient déjà des paramètres au chargement
    useEffect(() => {
        const urlTerme = searchParams.get('terme');
        const urlAuteur = searchParams.get('auteur');
        const urlAnnee = searchParams.get('annee');
        if (urlTerme || urlAuteur || urlAnnee) {
            performSearch({
                terme: urlTerme || '',
                auteur: urlAuteur || '',
                annee: urlAnnee || ''
            });
        }
    }, []); // Note: le tableau de dépendances vide assure que cela ne s'exécute qu'une fois.

    const handleSubmit = (e) => {
        e.preventDefault();
        performSearch({ terme, auteur, annee });
    };

    const handleReset = () => {
        setTerme('');
        setAuteur('');
        setAnnee('');
        setResults([]);
        setHasSearched(false);
        setSearchParams({});
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-5xl mx-auto border border-slate-200">
                    <h1 className="text-4xl font-extrabold text-center text-slate-800 mb-2">Recherche de Publications</h1>
                    <p className="text-center text-slate-500 mb-8">
                        Trouvez des articles en utilisant un ou plusieurs critères ci-dessous.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label htmlFor="terme" className="block text-sm font-semibold text-slate-600 mb-1">Titre ou Journal</label>
                                <FiBookOpen className="absolute left-3 top-10 h-5 w-5 text-slate-400" />
                                <input type="text" id="terme" value={terme} onChange={(e) => setTerme(e.target.value)} placeholder="Ex: Machine Learning" className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="relative">
                                <label htmlFor="auteur" className="block text-sm font-semibold text-slate-600 mb-1">Auteur</label>
                                <FiUser className="absolute left-3 top-10 h-5 w-5 text-slate-400" />
                                <input type="text" id="auteur" value={auteur} onChange={(e) => setAuteur(e.target.value)} placeholder="Ex: A. Turing" className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                        <div className="relative">
                            <label htmlFor="annee" className="block text-sm font-semibold text-slate-600 mb-1">Année de Publication</label>
                            <FiCalendar className="absolute left-3 top-10 h-5 w-5 text-slate-400" />
                            <input type="number" id="annee" value={annee} onChange={(e) => setAnnee(e.target.value)} placeholder="Ex: 2024" className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center disabled:bg-blue-400 transition-all duration-300">
                                <FaSearch className="h-5 w-5 mr-2" />
                                {loading ? 'Recherche en cours...' : 'Lancer la recherche'}
                            </button>
                            <button type="button" onClick={handleReset} className="w-auto bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 flex items-center justify-center transition-all duration-300" title="Réinitialiser les filtres">
                                <FaTimes className="h-5 w-5" />
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-12">
                    {loading && <div className="text-center p-10">Chargement...</div>}
                    {error && <div className="text-center p-10 text-red-500 bg-red-50 rounded-lg">{error}</div>}
                    {hasSearched && !loading && (
                        results.length > 0 ? (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold">Résultats <span className="text-slate-500 font-medium">({results.length})</span></h2>
                                {results.map(pub => (
                                    <div key={pub.id} className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                                        <h3 className="text-xl font-bold text-blue-800">{pub.titre}</h3>
                                        <p className="text-md text-slate-600 mt-2">
                                            <span className="font-semibold text-slate-800">Auteurs :</span> {pub.auteurs.map(a => `${a.prenom} ${a.nom}`).join(', ')}
                                        </p>
                                        <p className="text-sm text-slate-500 italic mt-1">
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
                            <div className="text-center py-16 bg-white rounded-xl shadow-md">
                                <FaSearch className="mx-auto h-16 w-16 text-slate-300" />
                                <h2 className="mt-4 text-2xl font-semibold text-slate-700">Aucun résultat trouvé</h2>
                                <p className="text-slate-500 mt-2">Veuillez ajuster vos critères de recherche.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecherchePublicationPage;