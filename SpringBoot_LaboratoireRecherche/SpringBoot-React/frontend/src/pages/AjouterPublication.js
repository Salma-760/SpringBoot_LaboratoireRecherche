import React, { useState, useEffect } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

const AjouterPublication = () => {
  const [publication, setPublication] = useState({
    titre: "", journal: "", base_indexation: "",
    annee_publication: "", volume: "", pages: "",
    doi: "", auteurs: []
  });

  const [auteursList, setAuteursList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/auteurs")
      .then(res => res.json())
      .then(data => setAuteursList(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Erreur chargement auteurs:", err);
        setAuteursList([]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPublication({ ...publication, [name]: value });
  };

  const handleAuteurSelect = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => ({ id: option.value }));
    setPublication({ ...publication, auteurs: selectedIds });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8081/publications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(publication)
    })
      .then(() => alert("\u2728 Publication ajoutée avec succès !"))
      .catch(err => console.error("Erreur:", err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center py-12 px-6">
      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 w-full max-w-4xl animate-fade-in">
        <div className="flex justify-center items-center mb-6">
          <SparklesIcon className="h-8 w-8 text-blue-600 mr-2" />
          <h2 className="text-4xl font-black text-center text-blue-700 tracking-tight">Ajouter une Publication</h2>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[{ name: "titre", placeholder: "Titre" },
            { name: "journal", placeholder: "Journal" },
            { name: "base_indexation", placeholder: "Base d'indexation" },
            { name: "annee_publication", placeholder: "Année", type: "number" },
            { name: "volume", placeholder: "Volume", type: "number" },
            { name: "pages", placeholder: "Pages", type: "number" },
            { name: "doi", placeholder: "DOI" }].map(({ name, placeholder, type = "text" }) => (
              <div key={name} className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-1 capitalize">{placeholder}</label>
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-base shadow-md bg-white/50"
                />
              </div>
          ))}

          <div className="md:col-span-2">
            <label className="text-sm font-bold text-gray-700 mb-2 block">Auteurs</label>
            <select
              multiple
              onChange={handleAuteurSelect}
              className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md text-base bg-white/50"
            >
              {auteursList.map(a => (
                <option key={a.id} value={a.id}>
                  {a.nom} {a.prenom} – {a.email}
                </option>
              ))}
            </select>
          </div>

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