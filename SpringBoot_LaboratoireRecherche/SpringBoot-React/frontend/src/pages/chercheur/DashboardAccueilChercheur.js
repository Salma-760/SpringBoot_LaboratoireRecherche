import React, { useState, useEffect } from 'react';
import { FiFileText, FiClock, FiCheckSquare, FiXSquare } from 'react-icons/fi';
import ActiviteAnnuelleChart from '../../components/ActiviteAnnuelleChart';


const StatCard = ({ icon, title, value, color }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transition-transform transform hover:scale-105">
            <div className={`p-3 rounded-full ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
};

const DashboardAccueilChercheur = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Le useEffect qui récupère les données reste inchangé.
    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            try {
                const response = await fetch('/api/chercheur-dashboard/statistiques', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error('Impossible de charger vos statistiques.');
                }
                const data = await response.json();
                setStats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-10 text-center">Chargement des statistiques...</div>;
    }

    if (error) {
        return <div className="p-10 text-center text-red-500">Erreur : {error}</div>;
    }

    // On s'assure que stats n'est pas null avant de tenter de l'afficher
    if (!stats) {
        return <div className="p-10 text-center">Aucune donnée de statistique disponible.</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Aperçu</h2>

            {/* La grille des stats reste inchangée */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<FiFileText className="h-6 w-6 text-blue-600" />}
                    title="Publications Totales"
                    value={stats.totalPublications}
                    color="bg-blue-100"
                />
                <StatCard
                    icon={<FiCheckSquare className="h-6 w-6 text-green-600" />}
                    title="Validées"
                    value={stats.publicationsValidees}
                    color="bg-green-100"
                />
                <StatCard
                    icon={<FiClock className="h-6 w-6 text-yellow-600" />}
                    title="En Attente"
                    value={stats.publicationsEnAttente}
                    color="bg-yellow-100"
                />
                <StatCard
                    icon={<FiXSquare className="h-6 w-6 text-red-600" />}
                    title="Refusées"
                    value={stats.publicationsRefusees}
                    color="bg-red-100"
                />
            </div>

            <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Activité Annuelle</h3>
                {/* On donne une hauteur fixe au conteneur du graphique pour un meilleur rendu */}
                <div className="mt-4 h-80 relative">
                    {/* On vérifie que les données pour le graphique existent et ne sont pas vides */}
                    {stats.publicationsParAnnee && Object.keys(stats.publicationsParAnnee).length > 0 ? (
                        <ActiviteAnnuelleChart data={stats.publicationsParAnnee} />
                    ) : (
                        // Message affiche si aucune donnée n'est disponible pour le graphique
                        <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500">Pas encore de données pour afficher le graphique.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardAccueilChercheur;