import React, { useState, useEffect } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

const baseIndexationOptions = [
  { value: "Scopus", label: "Scopus" },
  { value: "dblp", label: "DBLP" },
  { value: "WOS", label: " WOS " },
  { value: "WebOfScience", label: "Web of Science" },
];

const AjouterPublication = () => {
  const [publication, setPublication] = useState({
    titre: "",
    journal: "",
    baseIndexations: [], // pluriel dans le state
    annee: "",
    volume: "",
    pages: "",
    doi: "",
    auteurs: [],
  });

  const [auteursList, setAuteursList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/auteurs")
      .then((res) => res.json())
      .then((data) => setAuteursList(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Erreur chargement auteurs:", err);
        setAuteursList([]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPublication({ ...publication, [name]: value });
  };

  const handleBaseIndexationChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setPublication({ ...publication, baseIndexations: selected });
  };

  const handleAuteurSelect = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions, (opt) => ({ id: opt.value }));
    setPublication({ ...publication, auteurs: selectedIds });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Préparer le DTO compatible backend avec noms camelCase et conversion en nombre
    const dtoToSend = {
      ...publication,
      baseIndexation: publication.baseIndexations,
      annee: Number(publication.annee) || 0,
      volume: Number(publication.volume) || 0,
      pages: Number(publication.pages) || 0,
    };
    delete dtoToSend.baseIndexations;


    fetch("http://localhost:8081/publications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoToSend),
    })
      .then(() => alert("✨ Publication ajoutée avec succès !"))
      .catch((err) => console.error("Erreur:", err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center py-12 px-6">
      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 w-full max-w-4xl animate-fade-in">
        <div className="flex justify-center items-center mb-6">
          <SparklesIcon className="h-8 w-8 text-blue-600 mr-2" />
          <h2 className="text-4xl font-black text-center text-blue-700 tracking-tight">Ajouter une Publication</h2>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Champs texte standards */}
          {[
            { name: "titre", placeholder: "Titre" },
            { name: "journal", placeholder: "Journal" },
            { name: "annee", placeholder: "Année", type: "number" },
            { name: "volume", placeholder: "Volume", type: "number" },
            { name: "pages", placeholder: "Pages", type: "number" },
            { name: "doi", placeholder: "DOI" },
          ].map(({ name, placeholder, type = "text" }) => (
            <div key={name} className="flex flex-col">
              <label className="text-sm font-bold text-gray-700 mb-1 capitalize">{placeholder}</label>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                onChange={handleChange}
                value={publication[name]}  // valeur contrôlée
                required={name === "titre"}
                className="px-4 py-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-base shadow-md bg-white/50"
              />
            </div>
          ))}

          {/* Base d'indexation multi-select */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-700 mb-1 capitalize">Base d'indexation</label>
            <select
              name="base_indexation"
              multiple
              value={publication.baseIndexations}
              onChange={handleBaseIndexationChange}
              required
              className="px-4 py-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-base shadow-md bg-white/50"
            >
              {baseIndexationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sélection multiple des auteurs */}
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-gray-700 mb-2 block">Auteurs</label>
            <select
              multiple
              onChange={handleAuteurSelect}
              className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md text-base bg-white/50"
            >
              {auteursList.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nom} {a.prenom} – {a.email}
                </option>
              ))}
            </select>
          </div>

          {/* Bouton soumettre */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-4 text-white text-lg bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 rounded-2xl transition duration-300 font-extrabold shadow-xl tracking-wide"
            >
              Enregistrer la publication
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjouterPublication;
