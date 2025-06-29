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
    pages: "", // Le champ pages est une chaîne de caractères
    doi: "",
    resume: "",
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

    // Log pour s'assurer que la fonction est bien appelée
    console.log("Tentative de soumission du formulaire...");

    const dtoToSend = {
      ...publication, // Inclut déjà titre, journal, resume, pages (string), doi, auteurs
      baseIndexation: publication.baseIndexations,
      annee: Number(publication.annee) || null, // Mettre à null si invalide
      volume: Number(publication.volume) || 0,
    };
    delete dtoToSend.baseIndexations;

    // Log pour voir exactement ce qui est envoyé
    console.log("Payload envoyé au backend:", dtoToSend);

    fetch("http://localhost:8081/api/publications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(dtoToSend),
    })
      .then((res) => {
        if (!res.ok) {
          // Loguer le corps de l'erreur pour un meilleur débogage
          res.text().then(text => console.error("Erreur HTTP:", res.status, text));
          throw new Error("Erreur HTTP " + res.status);
        }
        return res.json();
      })
      .then(() => {
        alert("Publication ajoutée avec succès !");
        onSave(); // recharge les publications dans le composant parent
      })
      .catch((err) => {
        console.error("Erreur lors de la soumission:", err);
        alert("Une erreur est survenue. Vérifiez la console pour les détails.");
      });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 w-full max-w-4xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h2 className="text-3xl font-bold text-blue-700 flex items-center">
          <SparklesIcon className="h-7 w-7 mr-3" />
          Nouvelle Publication
        </h2>
        <button
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Annuler
        </button>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        {[
          { name: "titre", placeholder: "Titre de la publication", type: "text" },
          { name: "journal", placeholder: "Nom du journal", type: "text" },
          { name: "annee", placeholder: "Année (ex: 2024)", type: "number" },
          { name: "volume", placeholder: "Volume (si applicable)", type: "number" },
          // CORRECTION: Le type est "text" pour permettre "15-20"
          { name: "pages", placeholder: "Pages (ex: 15-20)", type: "text" },
          { name: "doi", placeholder: "DOI (si applicable)", type: "text" },
        ].map(({ name, placeholder, type }) => (
          <div key={name} className="flex flex-col">
            <label className="text-sm font-bold text-gray-700 mb-2 capitalize">{name}</label>
            <input
              type={type}
              name={name}
              value={publication[name]}
              onChange={handleChange}
              placeholder={placeholder}
              required={name === "titre"}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        ))}

        <div className="flex flex-col">
          <label className="text-sm font-bold text-gray-700 mb-2">Base d'indexation</label>
          <select
            multiple
            value={publication.baseIndexations}
            onChange={handleBaseIndexationChange}
            className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 shadow-sm"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            {auteursList.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nom} {a.prenom} – {a.email}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="resume" className="text-sm font-bold text-gray-700 mb-2 block">Résumé</label>
          <textarea
            id="resume"
            name="resume"
            rows="6"
            value={publication.resume}
            onChange={handleChange}
            placeholder="Saisissez le résumé (abstract) de la publication ici..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <div className="md:col-span-2 pt-4">
          <button
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-2xl font-bold shadow-lg transition-colors"
          >
            Enregistrer la publication
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjouterPublication;