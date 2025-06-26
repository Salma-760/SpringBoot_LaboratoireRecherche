import React from 'react';

import { FaFlask, FaUsers, FaLightbulb } from 'react-icons/fa';

function Missions() {
    const missions = [
        {
            icon: <FaFlask size={40} className="text-blue-500" />,
            title: "Excellence en Recherche",
            description: "Pousser les frontières de la connaissance dans nos domaines de spécialité à travers une recherche fondamentale et appliquée de classe mondiale."
        },
        {
            icon: <FaUsers size={40} className="text-green-500" />,
            title: "Formation de la Prochaine Génération",
            description: "Former des étudiants, des doctorants et des chercheurs de haut niveau, en leur fournissant un environnement stimulant et les outils nécessaires pour devenir les leaders de demain."
        },
        {
            icon: <FaLightbulb size={40} className="text-yellow-500" />,
            title: "Valorisation et Transfert Technologique",
            description: "Transformer nos découvertes en innovations tangibles, en collaborant avec des partenaires industriels pour créer un impact économique et social positif."
        }
    ];

    return (
        <div className="bg-white py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Notre Mission</h1>
                    <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                        Les piliers qui guident notre engagement quotidien envers la science et la société.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    {missions.map((mission, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 mb-6">
                                {mission.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">{mission.title}</h3>
                            <p className="text-gray-600">{mission.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center bg-gray-50 p-10 rounded-lg">
                    <h2 className="text-3xl font-bold">Nos Valeurs</h2>
                    <p className="mt-4 text-gray-700 max-w-3xl mx-auto">
                        Intégrité, collaboration, curiosité et rigueur sont au cœur de toutes nos démarches. Nous croyons en une science ouverte, éthique et au service du progrès humain.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Missions;