import React, { useState, useEffect } from 'react';
import { FiInbox, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

// Un petit composant pour afficher joliment le statut
const StatutBadge = ({ statut }) => {
    const statutInfo = {
        VALIDEE: { text: 'Validée', icon: <FiCheckCircle />, color: 'bg-green-100 text-green-800' },
        EN_ATTENTE: { text: 'En attente', icon: <FiClock />, color: 'bg-yellow-100 text-yellow-800' },
        REFUSEE: { text: 'Refusée', icon: <FiXCircle />, color: 'bg-red-100 text-red-800' },
    };

    const info = statutInfo[statut] || { text: statut, icon: null, color: 'bg-gray-100 text-gray-800' };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${info.color}`}>
            {info.icon && <span className="mr-1.5">{info.icon}</span>}
            {info.text}
        </span>
    );
};


const PublicationsChercheur = () => {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMesPublications = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");

            try {
                const response = await fetch('/api/publications/mes-publications', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération de vos publications.');
                }
                const data = await response.json();
                setPublications(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMesPublications();
    }, []); // Le tableau vide [] assure que l'effet ne s'exécute qu'une fois au montage

    if (loading) {
        return <div className="text-center p-10">Chargement de vos publications...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-600">Erreur : {error}</div>;
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes Publications</h2>

            {publications.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FiInbox className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune publication</h3>
                    <p className="mt-1 text-sm text-gray-500">Vous n'avez pas encore soumis de publication.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Journal</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Année</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {publications.map((pub) => (
                                <tr key={pub.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pub.titre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pub.journal}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pub.annee}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <StatutBadge statut={pub.statut} />
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

export default PublicationsChercheur;