import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const AjouterPublicationChercheur = () => {
    const { chercheur } = useOutletContext();
    const [intitule, setIntitule] = useState('');
    const [annee, setAnnee] = useState(new Date().getFullYear());
    const [auteurs, setAuteurs] = useState(chercheur ? chercheur.nom : '');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const publicationData = {
            intitule,
            annee_publication: parseInt(annee, 10),
            auteursTexte: auteurs, // On envoie les auteurs en texte simple pour l'instant
            auteurPrincipalId: chercheur.idUtilisateur
        };

        const token = localStorage.getItem("token");

        try {
            const response = await fetch('/api/publications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(publicationData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de la création de la publication.');
            }

            setMessage({ type: 'success', text: 'Publication ajoutée avec succès !' });
            setIntitule('');
            setAnnee(new Date().getFullYear());
            setAuteurs(chercheur.nom);

        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ajouter une nouvelle publication</h2>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="intitule">
                            Intitulé
                        </label>
                        <input
                            id="intitule"
                            type="text"
                            value={intitule}
                            onChange={(e) => setIntitule(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="annee">
                            Année de publication
                        </label>
                        <input
                            id="annee"
                            type="number"
                            value={annee}
                            onChange={(e) => setAnnee(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="auteurs">
                            Auteurs (séparés par une virgule)
                        </label>
                        <input
                            id="auteurs"
                            type="text"
                            value={auteurs}
                            onChange={(e) => setAuteurs(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Nom Prénom, Nom2 Prénom2"
                            required
                        />
                    </div>

                    {message.text && (
                        <div className={`p-3 mb-4 rounded-md text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="flex items-center justify-end">
                        <button type="submit" disabled={loading} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors">
                            {loading ? 'Enregistrement...' : 'Enregistrer la publication'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AjouterPublicationChercheur;