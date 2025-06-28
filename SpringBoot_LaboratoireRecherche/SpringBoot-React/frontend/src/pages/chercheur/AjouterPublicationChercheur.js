import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { SparklesIcon, UserCircleIcon } from "@heroicons/react/24/solid";

const baseIndexationOptions = [
    { value: "Scopus", label: "Scopus" },
    { value: "dblp", label: "DBLP" },
    { value: "WOS", label: "WOS" },
    { value: "WebOfScience", label: "Web of Science" },
];

const AjouterPublicationChercheur = () => {
    const { chercheur } = useOutletContext();

    // ================== VÉRIFICATION CRUCIALE ==================
    // Ce log s'affichera dans la console du navigateur dès que la page se charge.
    // Vérifiez que l'objet 'chercheur' contient bien les bonnes informations.
    console.log("Objet 'chercheur' reçu depuis le contexte :", chercheur);
    // ==========================================================

    const [publication, setPublication] = useState({
        titre: "", journal: "", baseIndexations: [], annee: "",
        volume: "", pages: "", doi: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPublication({ ...publication, [name]: value });
    };

    const handleBaseIndexationChange = (e) => {
        const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
        setPublication({ ...publication, baseIndexations: selected });
    };
    console.log("ID du chercheur utilisé pour l'auteur:", chercheur?.idUtilisateur);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const token = localStorage.getItem("token");

        // Construction du DTO juste avant l'envoi pour garantir les données
        const dtoToSend = {

            baseIndexation: publication.baseIndexations,
            titre: publication.titre,
            journal: publication.journal,
            doi: publication.doi,
            annee: Number(publication.annee) || null,
            volume: Number(publication.volume) || null,
            pages: Number(publication.pages) || null,

        };
        console.log("Payload FINAL envoyé au backend (SANS AUTEURS) :", dtoToSend);

        // Ce log est le plus important. Vérifiez sa sortie dans la console du navigateur.
        console.log("Payload FINAL envoyé au backend :", dtoToSend);

        fetch("http://localhost:8081/publications/soumettre", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(dtoToSend),
        })
            .then(async response => { // On utilise async pour pouvoir lire le corps de la réponse en cas d'erreur
                if (!response.ok) {
                    const errorBody = await response.text();
                    console.error("Réponse du serveur non OK:", response.status, errorBody);
                    throw new Error(`La soumission a échoué. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                alert("✅ Publication soumise avec succès !");
                setPublication({
                    titre: "", journal: "", baseIndexations: [], annee: "",
                    volume: "", pages: "", doi: "",
                });
            })
            .catch((err) => {
                console.error("Erreur dans le catch du fetch:", err);
                alert("❌ Une erreur est survenue lors de la soumission. Vérifiez la console (F12) pour les détails.");
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    // Le reste du JSX est inchangé
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center py-12 px-6">
            {/* ... tout votre JSX reste identique ... */}
            <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 w-full max-w-4xl animate-fade-in">
                <div className="flex justify-center items-center mb-6">
                    <SparklesIcon className="h-8 w-8 text-blue-600 mr-2" />
                    <h2 className="text-4xl font-black text-center text-blue-700 tracking-tight">Soumettre une Publication</h2>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Les champs du formulaire restent inchangés */}
                    {[
                        { name: "titre", placeholder: "Titre" },
                        { name: "journal", placeholder: "Journal" },
                        { name: "annee", placeholder: "Année", type: "number" },
                        { name: "volume", placeholder: "Volume", type: "number" },
                        { name: "pages", placeholder: "Pages" },
                        { name: "doi", placeholder: "DOI" },
                    ].map(({ name, placeholder, type = "text" }) => (
                        <div key={name} className="flex flex-col">
                            <label className="text-sm font-bold text-gray-700 mb-1 capitalize">{placeholder}</label>
                            <input
                                type={type} name={name} placeholder={placeholder}
                                onChange={handleChange} value={publication[name]}
                                required={name === "titre"}
                                className="px-4 py-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-base shadow-md bg-white/50"
                            />
                        </div>
                    ))}

                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-700 mb-1 capitalize">Base d'indexation</label>
                        <select
                            name="base_indexation" multiple
                            value={publication.baseIndexations}
                            onChange={handleBaseIndexationChange} required
                            className="px-4 py-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-base shadow-md bg-white/50"
                        >
                            {baseIndexationOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-sm font-bold text-gray-700 mb-1 block">Auteur (vous)</label>
                        <div className="flex items-center px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 shadow-inner">
                            <UserCircleIcon className="h-6 w-6 mr-3 text-gray-400" />
                            {chercheur ? (
                                <span className="font-medium">{chercheur.prenom} {chercheur.nom}</span>
                            ) : (
                                <span>Chargement de votre profil...</span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Vous serez automatiquement ajouté comme auteur principal. Pour ajouter des co-auteurs, veuillez contacter un administrateur après validation.</p>
                    </div>

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 text-white text-lg bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 rounded-2xl transition duration-300 font-extrabold shadow-xl tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Soumission en cours...' : 'Soumettre pour validation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AjouterPublicationChercheur;