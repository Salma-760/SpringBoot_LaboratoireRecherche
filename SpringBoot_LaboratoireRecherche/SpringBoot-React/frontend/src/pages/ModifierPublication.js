import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const ModifierPublication = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [publication, setPublication] = useState({
    titre: "", journal: "", base_indexation: "",
    annee_publication: "", volume: "", pages: "",
    doi: "", auteurs: []
  });

  const [auteursList, setAuteursList] = useState([]);

  useEffect(() => {
    // Charger la publication
    fetch(`http://localhost:8081/publications/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Erreur backend");
        return res.json();
      })
      .then(data => {
        setPublication({
          ...data,
          auteurs: Array.isArray(data.auteurs) ? data.auteurs.map(a => ({ id: a.id })) : []
        });
      })
      .catch(err => {
        console.error("Erreur de chargement publication:", err);
      });

    // Charger les auteurs
    fetch("http://localhost:8081/auteurs")
      .then(res => {
        if (!res.ok) throw new Error("Erreur backend");
        return res.json();
      })
      .then(data => {
        setAuteursList(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Erreur de chargement auteurs:", err);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPublication({ ...publication, [name]: value });
  };

  const handleAuteurSelect = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => ({ id: parseInt(option.value) }));
    setPublication({ ...publication, auteurs: selectedIds });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/publications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(publication)
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur backend PUT");
        alert("Publication modifiée !");
        navigate("/");
      })
      .catch(err => {
        console.error("Erreur modification:", err);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center py-12 px-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 w-full max-w-4xl animate-fade-in space-y-5">
        <h2 className="text-4xl font-black text-center text-blue-700 mb-6">Modifier une publication</h2>

        {[{ name: "titre", placeholder: "Titre" },
          { name: "journal", placeholder: "Journal" },
          { name: "base_indexation", placeholder: "Base d'indexation" },
          { name: "annee_publication", placeholder: "Année", type: "number" },
          { name: "volume", placeholder: "Volume", type: "number" },
          { name: "pages", placeholder: "Pages", type: "number" },
          { name: "doi", placeholder: "DOI" }].map(({ name, placeholder, type = "text" }) => (
            <div key={name}>
              <label className="text-sm font-bold text-gray-700 mb-1 block capitalize">{placeholder}</label>
              <input
                type={type}
                name={name}
                value={publication[name]}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/50"
              />
            </div>
        ))}

        <div>
          <label className="text-sm font-bold text-gray-700 mb-1 block">Auteurs :</label>
          <select
            multiple
            value={publication.auteurs.map(a => a.id)}
            onChange={handleAuteurSelect}
            className="w-full px-4 py-3 border border-blue-300 rounded-xl shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/50"
          >
            {auteursList.map(a => (
              <option key={a.id} value={a.id}>Nom: {a.nom} Prenom: {a.prenom} Email:{a.email}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-4 text-white text-lg bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 rounded-2xl transition duration-300 font-extrabold shadow-xl tracking-wide"
        >
          ✏️ Modifier
        </button>
      </form>
    </div>
  );
};

export default ModifierPublication;
