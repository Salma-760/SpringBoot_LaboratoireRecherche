import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { FiGrid, FiFileText, FiPlusCircle, FiUser, FiLogOut } from 'react-icons/fi';
import Footer from "../components/Footer";

const ChercheurPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [chercheur, setChercheur] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }

            try {
                const response = await fetch('/api/utilisateurs/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error("Session invalide ou expirée.");
                }
                const userData = await response.json();
                setChercheur(userData);
            } catch (err) {
                console.error("Erreur de récupération du profil:", err);
                setError("Votre session a expiré. Veuillez vous reconnecter.");
                localStorage.clear();
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const getLinkClass = (path) => {
        const baseClass = "flex items-center px-4 py-2.5 text-gray-300 rounded-md transition-colors duration-200";
        const activeClass = "bg-slate-700 text-white font-semibold";
        const inactiveClass = "hover:bg-slate-700 hover:text-white";

        if (path === '/chercheur' && location.pathname === '/chercheur') {
            return `${baseClass} ${activeClass}`;
        }
        if (path !== '/chercheur' && location.pathname.startsWith(path)) {
            return `${baseClass} ${activeClass}`;
        }
        return `${baseClass} ${inactiveClass}`;
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-100">Chargement de votre espace...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen bg-gray-100 text-red-600">{error}</div>;
    }

    return (
        <div className="bg-gray-100">

            <aside className="fixed top-0 left-0 w-64 h-screen bg-slate-800 text-white flex flex-col shadow-xl z-20">
                <div className="h-20 flex items-center justify-center border-b border-slate-700">
                    <h1 className="text-xl font-bold">Espace Chercheur</h1>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    <Link to="/chercheur" className={getLinkClass('/chercheur')}>
                        <FiGrid className="h-5 w-5" />
                        <span className="ml-3">Tableau de bord</span>
                    </Link>
                    <Link to="/chercheur/publications" className={getLinkClass('/chercheur/publications')}>
                        <FiFileText className="h-5 w-5" />
                        <span className="ml-3">Mes Publications</span>
                    </Link>
                    <Link to="/chercheur/ajouter-publication" className={getLinkClass('/chercheur/ajouter-publication')}>
                        <FiPlusCircle className="h-5 w-5" />
                        <span className="ml-3">Ajouter Publication</span>
                    </Link>
                    <Link to="/chercheur/profil" className={getLinkClass('/chercheur/profil')}>
                        <FiUser className="h-5 w-5" />
                        <span className="ml-3">Mon Profil</span>
                    </Link>
                </nav>
                <div className="px-4 py-6 border-t border-slate-700">
                    <button onClick={handleLogout} className="w-full flex items-center px-4 py-2.5 text-gray-300 hover:bg-slate-700 rounded-md">
                        <FiLogOut className="h-5 w-5 text-red-400" />
                        <span className="ml-3">Se déconnecter</span>
                    </button>
                </div>
            </aside>


            <div className="ml-64">
                <header className="bg-white shadow-sm p-6 border-b border-gray-200">
                    {chercheur && (
                        <h1 className="text-3xl font-bold text-gray-800">
                            Bienvenue, {chercheur.nom} !
                        </h1>
                    )}
                </header>

                <main className="p-6 md:p-10">
                    <Outlet context={{ chercheur, setChercheur }} />
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default ChercheurPage;