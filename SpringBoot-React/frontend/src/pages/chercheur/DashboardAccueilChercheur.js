import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FiPlusCircle, FiBarChart2, FiBookOpen } from 'react-icons/fi';

const DashboardAccueilChercheur = () => {
    // Récupère l'objet 'chercheur' passé depuis le layout parent (ChercheurPage)
    const { chercheur } = useOutletContext();

    if (!chercheur) {
        return <div>Chargement des informations du tableau de bord...</div>;
    }

    return (
        <>
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">Tableau de bord</h2>
                    <p className="text-gray-500 mt-1">Vue d'ensemble de vos activités de recherche.</p>
                </div>
                <Link to="/chercheur/ajouter-publication" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-md hover:shadow-lg">
                    <FiPlusCircle />
                    <span>Ajouter une Publication</span>
                </Link>
            </div>

            <section>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Statistiques Clés</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <FiBookOpen className="text-blue-500 text-4xl mx-auto mb-2" />
                        <p className="text-3xl font-bold text-gray-800">5</p>
                        <p className="text-gray-500">Publications</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <FiBarChart2 className="text-green-500 text-4xl mx-auto mb-2" />
                        <p className="text-3xl font-bold text-gray-800">120</p>
                        <p className="text-gray-500">Citations</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        {/* Placeholder pour une autre statistique */}
                        <p className="text-3xl font-bold text-gray-800 mt-[3.2rem]">...</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default DashboardAccueilChercheur;