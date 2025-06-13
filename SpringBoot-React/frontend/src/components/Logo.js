import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode"; // Assurez-vous d'avoir installé jwt-decode

const Logo = () => {
    // --- États pour l'UI et l'animation ---
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [title, setTitle] = useState("Laboratoire Des Sciences Appliquées Et Technologies Émergentes");
    const [displayTitle, setDisplayTitle] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [index, setIndex] = useState(0);
    const intervalRef = useRef(null);

    // --- États pour les champs du formulaire ---
    const [email, setEmail] = useState("");
    const [motPasse, setMotPasse] = useState("");

    // --- Effet pour l'animation du titre ---
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
                // Une fois le titre complet, attendre un peu avant de commencer à effacer
                setTimeout(() => setIsDeleting(true), 2000);
            }
        }

        return () => clearTimeout(intervalRef.current);
    }, [index, isDeleting, title]);

    // --- Fonction pour formater le titre avec des couleurs ---
    const formatTitle = (text) => {
        return text.split(" ").map((word, i) => (
            <span key={i}>
                <span style={{ color: "#007BFF" }}>{word[0]}</span> {/* Couleur bleue pour la première lettre */}
                {word.slice(1)}{" "}
            </span>
        ));
    };

    // --- Fonction de gestion de la connexion ---
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !motPasse) {
            alert("Veuillez remplir l'email et le mot de passe.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8081/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, motPasse }),
            });

            // Si la réponse n'est pas OK (status 4xx ou 5xx)
            if (!response.ok) {
                // Essayer de lire le message d'erreur du backend
                try {
                    const errorData = await response.json();
                    alert(`Échec de la connexion : ${errorData.message || "Email ou mot de passe invalide."}`);
                } catch {
                    alert("Échec de la connexion. Vérifiez vos identifiants.");
                }
                return;
            }

            const data = await response.json(); // data = { token: "...", type: "Bearer" }

            // 1. Stocker le token JWT dans le localStorage
            localStorage.setItem("token", data.token);

            // 2. Décoder le token pour extraire le rôle
            const decodedToken = jwtDecode(data.token);
            const userRole = decodedToken.role; // Le nom du champ doit correspondre à celui dans notre JwtUtil

            // (Optionnel) Stocker aussi le rôle pour un accès facile
            localStorage.setItem("userRole", userRole);

            // 3. Rediriger l'utilisateur en fonction de son rôle
            if (userRole === "ADMIN") {
                window.location.href = "/admin"; // Redirection complète de la page
            } else if (userRole === "CHERCHEUR") {
                window.location.href = "/chercheur";
            } else {
                alert("Votre rôle n'est pas reconnu par le système.");
                localStorage.clear(); // Nettoyer le localStorage si le rôle est invalide
            }

        } catch (error) {
            console.error("Erreur de connexion au serveur:", error);
            alert("Une erreur de communication avec le serveur s'est produite. Veuillez réessayer plus tard.");
        }
    };

    // --- Rendu du composant ---
    return (
        <div className="relative w-full h-[40vh]">
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

            <div className="absolute top-4 right-4">
                <button
                    onClick={() => setShowLoginForm(!showLoginForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Se Connecter
                </button>
            </div>

            {showLoginForm && (
                <div
                    className="absolute top-16 right-4 bg-white p-6 rounded-lg shadow-lg w-80 z-20"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Connexion</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Email
                            </label>
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
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Mot de passe
                            </label>
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