import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// Importer quelques icônes pour le design
import { FaNewspaper, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';

// === SQUELETTE DE CHARGEMENT AMÉLIORÉ ===
const SkeletonCard = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6 mt-1"></div>
    </div>
);

const HomeSkeleton = () => (
    <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-16 animate-pulse">
            <div className="h-12 bg-gray-300 rounded w-1/2 mx-auto"></div>
            <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto mt-4"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <section>
                <div className="h-8 bg-gray-300 rounded w-1/2 mb-6"></div>
                <div className="space-y-6">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </section>
            <section>
                <div className="h-8 bg-gray-300 rounded w-1/2 mb-6"></div>
                <div className="space-y-6">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </section>
        </div>
    </div>
);


function Home() {
    const [recentNews, setRecentNews] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [newsResponse, eventsResponse] = await Promise.all([
                    axios.get('http://localhost:8081/api/actualites/recentes?count=2'), // On va afficher 2 cartes plus grandes
                    axios.get('http://localhost:8081/api/evenements/prochains?count=2')
                ]);
                setRecentNews(newsResponse.data);
                setUpcomingEvents(eventsResponse.data);
            } catch (error) {
                console.error("Erreur lors du chargement des données de la page d'accueil", error);
            } finally {
                // On garde un petit délai pour que le chargement ne soit pas trop bref
                setTimeout(() => setLoading(false), 500);
            }
        };
        fetchData();
    }, []);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

    if (loading) {
        return <HomeSkeleton />;
    }

    return (
        // On ajoute un fond subtil à la page
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">

                <div className="text-center py-20">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-800 tracking-tight">
                        Laboratoire de Recherche LSATE
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-500 max-w-3xl mx-auto">
                        À la pointe de l'innovation, nous transformons les idées en découvertes qui façonnent l'avenir.
                    </p>
                    {/* Une ligne décorative pour ajouter une touche de couleur et de structure */}
                    <div className="mt-8 h-1 w-24 bg-blue-500 mx-auto rounded"></div>
                </div>

                {/* === contenu PRINCIPAL === */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* === SECTION DERNIERES ACTUALITES === */}
                    <section>
                        <h2 className="flex items-center text-3xl font-bold text-gray-800 mb-6">
                            <FaNewspaper className="mr-3 text-blue-500" />
                            Dernières Actualités
                        </h2>
                        <div className="space-y-6">
                            {recentNews.length > 0 ? recentNews.map(actu => (
                                <Link to={`/actualite/${actu.id}`} key={actu.id} className="block bg-white p-6 rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                    <p className="text-sm text-gray-500 mb-2">{formatDate(actu.datePublication)}</p>
                                    <h3 className="font-bold text-xl text-gray-900 mb-2">{actu.titre}</h3>
                                    <p className="text-gray-600 text-base line-clamp-2">{actu.chapeau}</p>
                                </Link>
                            )) : (
                                <p className="text-gray-500">Aucune actualité récente.</p>
                            )}
                        </div>
                        <Link to="/actualites" className="group inline-flex items-center text-blue-600 hover:text-blue-800 mt-6 font-semibold transition-colors">
                            Voir toutes les actualités
                            <FaChevronRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </section>

                    {/* === SECTION PROCHAINS EVENEMENTS === */}
                    <section>
                        <h2 className="flex items-center text-3xl font-bold text-gray-800 mb-6">
                            <FaCalendarAlt className="mr-3 text-green-500" />
                            Prochains Événements
                        </h2>
                        <div className="space-y-6">
                            {upcomingEvents.length > 0 ? upcomingEvents.map(evt => (
                                <Link to={`/evenement/${evt.id}`} key={evt.id} className="block bg-white p-6 rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                    <p className="text-sm text-green-700 font-semibold mb-2">{formatDate(evt.dateDebut)}</p>
                                    <h3 className="font-bold text-xl text-gray-900 mb-2">{evt.titre}</h3>
                                    <p className="text-gray-600 text-base">Lieu : {evt.lieu}</p>
                                </Link>
                            )) : (
                                <p className="text-gray-500">Aucun événement à venir.</p>
                            )}
                        </div>
                        <Link to="/evenements" className="group inline-flex items-center text-green-600 hover:text-green-800 mt-6 font-semibold transition-colors">
                            Voir tous les événements
                            <FaChevronRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Home;