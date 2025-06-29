import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

const ValidationPublications = () => {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fonction pour charger les publications en attente depuis le backend
    const fetchPublicationsEnAttente = () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        fetch("http://localhost:8081/api/publications/en-attente", {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                if (!response.ok) throw new Error("Impossible de charger les publications en attente.");
                return response.json();
            })
            .then(data => {
                setPublications(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    // Charger les données au montage du composant
    useEffect(() => {
        fetchPublicationsEnAttente();
    }, []);

    // Fonction pour valider ou refuser une publication
    const handleAction = (publicationId, action) => {
        const token = localStorage.getItem("token");
        fetch(`http://localhost:8081/api/publications/${publicationId}/${action}`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                if (!response.ok) throw new Error(`L'action "${action}" a échoué.`);
                // Mettre à jour l'UI en retirant la publication traitée de la liste
                setPublications(prev => prev.filter(pub => pub.id !== publicationId));
            })
            .catch(err => alert(err.message));
    };

    if (loading) return <div className="text-center p-10">Chargement...</div>;
    if (error) return <div className="text-center p-10 text-red-500">Erreur: {error}</div>;

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <ClockIcon className="w-8 h-8 mr-3 text-yellow-500" />
                Publications en attente de validation
            </h1>

            {publications.length === 0 ? (
                <p className="text-gray-500 text-center py-10">Aucune publication en attente.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-2 px-4 text-left">Titre</th>
                                <th className="py-2 px-4 text-left">Auteur(s)</th>
                                <th className="py-2 px-4 text-left">Année</th>
                                <th className="py-2 px-4 text-left">Résumé</th>
                                <th className="py-2 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {publications.map(pub => (
                                <tr key={pub.id} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-4 font-medium">{pub.titre}</td>
                                    <td className="py-2 px-4">{pub.auteurs.map(a => `${a.prenom} ${a.nom}`).join(', ')}</td>
                                    <td className="py-2 px-4">{pub.annee}</td>
                                    <td className="py-2 px-4 text-sm text-gray-600 max-w-xs truncate">{pub.resume}</td>
                                    <td className="py-2 px-4 flex justify-center items-center gap-2">
                                        <button
                                            onClick={() => handleAction(pub.id, 'valider')}
                                            className="p-2 rounded-full text-green-600 hover:bg-green-100 transition-colors"
                                            title="Valider"
                                        >
                                            <CheckCircleIcon className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={() => handleAction(pub.id, 'refuser')}
                                            className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                                            title="Refuser"
                                        >
                                            <XCircleIcon className="w-6 h-6" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ValidationPublications;