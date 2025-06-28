import React, { useState, useEffect } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

const baseIndexationOptions = [
  { value: "Scopus", label: "Scopus" },
  { value: "dblp", label: "DBLP" },
  { value: "WOS", label: "WOS" },
  { value: "WebOfScience", label: "Web of Science" },
];

const AjouterPublication = ({ onSave, onCancel }) => {
  const [publication, setPublication] = useState({
    titre: "",
    journal: "",
    baseIndexations: [],
    annee: "",
    volume: "",
    pages: "",
    doi: "",
    auteurs: [],
  });

  const [auteursList, setAuteursList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/api/auteurs", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
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
    const dtoToSend = {
      ...publication,
      baseIndexation: publication.baseIndexations,
      annee: Number(publication.annee) || 0,
      volume: Number(publication.volume) || 0,
      pages: Number(publication.pages) || 0,
    };
    delete dtoToSend.baseIndexations;
<<<<<<< HEAD

=======
>>>>>>> b5af526d34fc44be4eb472631b6e4dbd4c058764

    fetch("http://localhost:8081/api/publications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(dtoToSend),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur HTTP " + res.status);
        onSave(); // recharge les publications dans ListePublication
      })
      .catch((err) => console.error("Erreur:", err));
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-md p-10 w-full max-w-4xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700 flex items-center">
          <SparklesIcon className="h-7 w-7 mr-2" />
          Nouvelle Publication
        </h2>
        <button
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg shadow"
        >
          Fermer
        </button>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              value={publication[name]}
              onChange={handleChange}
              required={name === "titre"}
              className="px-4 py-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-400 shadow bg-white"
            />
          </div>
        ))}

        <div className="flex flex-col">
          <label className="text-sm font-bold text-gray-700 mb-1">Base d'indexation</label>
          <select
            multiple
            value={publication.baseIndexations}
            onChange={handleBaseIndexationChange}
            className="px-4 py-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-400 shadow"
          >
            {baseIndexationOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-bold text-gray-700 mb-2 block">Auteurs</label>
          <select
            multiple
            onChange={handleAuteurSelect}
            className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow"
          >
            {auteursList.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nom} {a.prenom} – {a.email}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-2xl font-bold shadow-lg"
          >
            Enregistrer la publication
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjouterPublication;
