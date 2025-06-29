import React, { useState, useEffect } from 'react';

const ListePublicationsPubliques = () => {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8081/api/publications/validees")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau ou le serveur a répondu avec une erreur');
                }
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
    }, []); // Le tableau vide [] assure que l'effet ne se lance qu'une fois au montage

    if (loading) return <div className="text-center p-10">Chargement des publications...</div>;
    if (error) return <div className="text-center p-10 text-red-500">Erreur: {error}</div>;

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 border-b-2 pb-4">Nos Publications</h1>

            <div className="space-y-6">
                {publications.length > 0 ? (
                    publications.map(pub => (
                        <div key={pub.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <h2 className="text-2xl font-semibold text-blue-700">{pub.titre}</h2>
                            <p className="text-gray-600 mt-2">
                                <span className="font-medium">Auteurs :</span> {pub.auteurs.map(a => `${a.prenom} ${a.nom}`).join(', ')}
                            </p>
                            {pub.journal && <p className="text-gray-600"><span className="font-medium">Journal :</span> {pub.journal}</p>}
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                                <span>Année : {pub.annee}</span>
                                {pub.volume && <span>Volume : {pub.volume}</span>}
                                {pub.pages && <span>Pages : {pub.pages}</span>}
                            </div>
                            {pub.resume && <p className="mt-4 text-gray-700">{pub.resume}</p>}
                            {pub.doi &&
                                <a
                                    href={`https://doi.org/${pub.doi}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline mt-4 inline-block"
                                >
                                    Voir sur DOI: {pub.doi}
                                </a>
                            }
                        </div>
                    ))
                ) : (
                    <p>Aucune publication à afficher pour le moment.</p>
                )}
            </div>
        </div>
    );
};

export default ListePublicationsPubliques;