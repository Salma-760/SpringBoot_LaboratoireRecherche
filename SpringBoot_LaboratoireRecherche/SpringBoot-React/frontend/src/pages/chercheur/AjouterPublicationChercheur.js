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
    const [publication, setPublication] = useState({
        titre: "",
        journal: "",
        baseIndexations: [],
        annee: "",
        volume: "",
        pages: "",
        doi: "",
        resume: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPublication(prev => ({ ...prev, [name]: value }));
    };

    const handleBaseIndexationChange = (e) => {
        const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
        setPublication(prev => ({ ...prev, baseIndexations: selected }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const token = localStorage.getItem("token");


        const dtoToSend = {
            titre: publication.titre,
            journal: publication.journal,
            baseIndexation: publication.baseIndexations,
            annee: Number(publication.annee) || null,
            volume: Number(publication.volume) || 0,
            pages: publication.pages,
            doi: publication.doi,
            resume: publication.resume,
            auteurs: chercheur && chercheur.id ? [{ id: chercheur.id }] : []
        };

        console.log("Payload envoyé au backend :", dtoToSend);

        fetch("http://localhost:8081/api/publications/soumettre", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(dtoToSend),
        })
            .then(async response => {
                if (!response.ok) {
                    const errorBody = await response.text();
                    console.error("Réponse du serveur non OK:", response.status, errorBody);
                    throw new Error(`La soumission a échoué. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                alert("✅ Publication soumise avec succès !");
                // Vider le formulaire complètement après succès
                setPublication({
                    titre: "", journal: "", baseIndexations: [], annee: "",
                    volume: "", pages: "", doi: "", resume: ""
                });
            })
            .catch((err) => {
                console.error("Erreur dans le catch du fetch:", err);
                alert("❌ Une erreur est survenue lors de la soumission. Vérifiez la console pour les détails.");
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div className="bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center py-12 px-6">
            <div className="bg-white rounded-[2rem] shadow-2xl p-10 w-full max-w-4xl">
                <div className="flex justify-center items-center mb-6">
                    <SparklesIcon className="h-8 w-8 text-blue-600 mr-2" />
                    <h2 className="text-4xl font-black text-center text-blue-700 tracking-tight">Soumettre une Publication</h2>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                    {/* Les champs texte standards */}
                    {[
                        { name: "titre", placeholder: "Titre de la publication" },
                        { name: "journal", placeholder: "Nom du journal ou de la conférence" },
                        { name: "annee", placeholder: "Année (ex: 2024)", type: "number" },
                        { name: "volume", placeholder: "Volume ", type: "number" },
                        { name: "pages", placeholder: "Pages " },
                        { name: "doi", placeholder: "DOI" },
                    ].map(({ name, placeholder, type = "text" }) => (
                        <div key={name} className="flex flex-col">
                            <label className="text-sm font-bold text-gray-700 mb-2 capitalize">{name}</label>
                            <input
                                type={type} name={name} placeholder={placeholder}
                                onChange={handleChange} value={publication[name]}
                                required={name === "titre"}
                                className="px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none text-base shadow-sm bg-white/60"
                            />
                        </div>
                    ))}

                    {/* Base d'indexation */}
                    <div className="flex flex-col md:col-span-2">
                        <label className="text-sm font-bold text-gray-700 mb-2">Base d'indexation</label>
                        <select
                            name="baseIndexations"
                            multiple
                            value={publication.baseIndexations}
                            onChange={handleBaseIndexationChange} required
                            className="px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none text-base shadow-sm bg-white/60"
                        >
                            {baseIndexationOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* champ Textarea pour le résumé */}
                    <div className="md:col-span-2">
                        <label htmlFor="resume" className="text-sm font-bold text-gray-700 mb-2 block">Résumé</label>
                        <textarea
                            id="resume"
                            name="resume"
                            rows="6"
                            placeholder="Saisissez le résumé (abstract) de la publication ici..."
                            onChange={handleChange}
                            value={publication.resume}
                            className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none text-base shadow-sm bg-white/60"
                        ></textarea>
                    </div>

                    {/* Affichage de l'auteur */}
                    <div className="md:col-span-2">
                        <label className="text-sm font-bold text-gray-700 mb-2 block">Auteur (vous)</label>
                        <div className="flex items-center px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 shadow-inner">
                            <UserCircleIcon className="h-6 w-6 mr-3 text-gray-400" />
                            {chercheur ? (
                                <span className="font-medium">{chercheur.prenom} {chercheur.nom}</span>
                            ) : (
                                <span>Chargement...</span>
                            )}
                        </div>
                    </div>

                    {/* Bouton Soumettre */}
                    <div className="md:col-span-2 pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 text-white text-lg font-extrabold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-2xl transition duration-300 shadow-xl tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
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