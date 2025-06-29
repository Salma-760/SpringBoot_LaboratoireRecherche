import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const Logo = () => {
    // --- États pour l'UI et l'animation 
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [title, setTitle] = useState("Laboratoire Des Sciences Appliquées Et Technologies Émergentes");
    const [displayTitle, setDisplayTitle] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [index, setIndex] = useState(0);
    const intervalRef = useRef(null);

    // --- États pour les champs du formulaire de connexion
    const [email, setEmail] = useState("");
    const [motPasse, setMotPasse] = useState("");
    const navigate = useNavigate();

    // --- Effet pour l'animation du titre (INCHANGÉ) ---
    useEffect(() => {
        if (isDeleting) {
            if (index > 0) {
                intervalRef.current = setTimeout(() => {
                    setDisplayTitle((prev) => prev.slice(0, -1));
                    setIndex((prev) => prev - 1);
                }, 100);
            } else {
                setIsDeleting(false);
                setIndex(0);
                setDisplayTitle("");
            }
        } else {
            if (index < title.length) {
                intervalRef.current = setTimeout(() => {
                    setDisplayTitle((prev) => title.slice(0, prev.length + 1));
                    setIndex((prev) => prev + 1);
                }, 100);
            } else {
                setTimeout(() => setIsDeleting(true), 2000);
            }
        }
        return () => clearTimeout(intervalRef.current);
    }, [index, isDeleting, title]);

    // --- Fonction pour formater le titre
    const formatTitle = (text) => {
        return text.split(" ").map((word, i) => (
            <span key={i}>
                <span style={{ color: "#007BFF" }}>{word[0]}</span>
                {word.slice(1)}{" "}
            </span>
        ));
    };

    // --- Fonction de gestion de la connexion 
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8081/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, motPasse }),
            });
            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    alert(`Échec de la connexion : ${errorData.message || "Email ou mot de passe invalide."}`);
                } catch {
                    alert("Échec de la connexion. Vérifiez vos identifiants.");
                }
                return;
            }
            const data = await response.json();
            localStorage.setItem("token", data.token);
            const decodedToken = jwtDecode(data.token);
            const userRole = decodedToken.role;
            localStorage.setItem("userRole", userRole);
            if (userRole === "ADMIN") {
                navigate("/admin");
            } else if (userRole === "CHERCHEUR") {
                navigate("/chercheur");
            } else {
                alert("Votre rôle n'est pas reconnu par le système.");
                localStorage.clear();
            }
        } catch (error) {
            console.error("Erreur de connexion au serveur:", error);
            alert("Une erreur de communication avec le serveur s'est produite.");
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const trimmedQuery = searchQuery.trim();

        // On ne fait rien si la recherche est vide
        if (trimmedQuery === "") {
            return;
        }

        // On redirige l'utilisateur vers une page dédiée aux résultats
        // en passant le terme de recherche comme paramètre d'URL.
        // `q` est une convention pour "query".
        navigate(`/recherche?q=${encodeURIComponent(trimmedQuery)}`);

        // On ferme la barre de recherche et on vide le champ pour la prochaine fois
        setShowSearchBar(false);
        setSearchQuery("");
    };

    return (
        <div className="relative w-full h-[35vh]">
            <img
                src="/images/Ensaf.jpg"
                alt="Ensaf"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            <div className="absolute inset-0 flex justify-center items-center px-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
                    {formatTitle(displayTitle)}
                </h1>
            </div>

            {/* Barre de recherche flottante */}
            {showSearchBar && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-2xl w-11/12 md:w-1/2 lg:w-1/3 z-30 transition-all duration-300 ease-in-out">
                    <form onSubmit={handleSearchSubmit} className="flex items-center">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher par titre, auteur, année..."
                            className="w-full px-4 py-2 text-lg border-none focus:ring-0 bg-transparent"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white p-3 rounded-md ml-2 hover:bg-blue-700 transition-colors"
                            aria-label="Lancer la recherche"
                        >
                            <FiSearch className="h-6 w-6" />
                        </button>
                    </form>
                </div>
            )}

            {/* Conteneur pour les boutons en haut à droite */}
            <div className="absolute top-4 right-4 flex items-center space-x-3">
                <button
                    onClick={() => {
                        setShowSearchBar(!showSearchBar);
                        setShowLoginForm(false);
                    }}
                    className="p-2.5 rounded-lg bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all duration-200"
                    aria-label="Ouvrir la barre de recherche"
                >
                    <FiSearch className="h-5 w-5" />
                </button>
                <button
                    onClick={() => {
                        setShowLoginForm(!showLoginForm);
                        setShowSearchBar(false);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Se Connecter
                </button>
            </div>

            {/* Formulaire de connexion */}
            {showLoginForm && (
                <div className="absolute top-16 right-4 bg-white p-6 rounded-lg shadow-lg w-80 z-20">
                    <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Connexion</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="votre.email@exemple.com"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Mot de passe</label>
                            <input
                                type="password"
                                value={motPasse}
                                onChange={(e) => setMotPasse(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Connexion
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Logo;