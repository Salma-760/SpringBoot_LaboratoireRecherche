import React, { useState, useEffect, useRef } from "react";

const Logo = () => {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [title, setTitle] = useState("Laboratoire Des Sciences Appliquées Et Technologies Émergentes");
    const [displayTitle, setDisplayTitle] = useState(title);
    const [isDeleting, setIsDeleting] = useState(false);
    const [index, setIndex] = useState(0);
    const intervalRef = useRef(null);

    // Champs de formulaire
    const [email, setEmail] = useState("");
    const [motPasse, setMotPasse] = useState("");

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
                setTimeout(() => {
                    setDisplayTitle(title);
                }, 1000);
            }
        } else {
            if (index < title.length) {
                intervalRef.current = setTimeout(() => {
                    setDisplayTitle((prev) => title.slice(0, prev.length + 1));
                    setIndex((prev) => prev + 1);
                }, 100);
            } else {
                setIsDeleting(true);
            }
        }

        return () => clearTimeout(intervalRef.current);
    }, [index, isDeleting, title]);

    const formatTitle = (text) => {
        return text.split(" ").map((word, i) => (
            <span key={i}>
                <span style={{ color: "#0000FF" }}>{word[0]}</span>
                {word.slice(1)}{" "}
            </span>
        ));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8081/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, motPasse }),
            });

            if (!response.ok) {
                alert("Échec de la connexion. Vérifiez vos identifiants.");
                return;
            }

            const data = await response.json();

            // Stocker le token
            localStorage.setItem("token", data.token);

            // Redirection selon le rôle
            if (data.role === "ADMIN") {
                window.location.href = "/admin";
            } else if (data.role === "CHERCHEUR") {
                window.location.href = "/chercheur";
            } else {
                alert("Rôle non reconnu.");
            }

        } catch (error) {
            console.error("Erreur:", error);
            alert("Erreur de connexion au serveur.");
        }
    };

    return (
        <div className="relative w-full h-[40vh]">
            <img
                src="/images/Ensaf.jpg"
                alt="Ensaf"
                className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            <div className="absolute inset-0 flex justify-center items-center">
                <h1 className="text-4xl font-bold text-white text-center">
                    {formatTitle(displayTitle)}
                </h1>
            </div>

            <div className="absolute top-4 right-4">
                <button
                    onClick={() => setShowLoginForm(!showLoginForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
                    <h2 className="text-xl font-bold text-center mb-4">Connexion</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Nom d'utilisateur (Email)
                            </label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
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
