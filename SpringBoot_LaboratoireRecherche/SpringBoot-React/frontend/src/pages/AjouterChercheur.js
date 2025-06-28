import React, { useState } from "react";

const AjouterChercheur = ({ onChercheurAdded }) => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [specialite, setSpecialite] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const chercheur = { nom, prenom, email, specialite };

    fetch("http://localhost:8081/api/chercheurs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chercheur),
    })
      .then((res) => res.json())
      .then(() => {
        setNom("");
        setPrenom("");
        setEmail("");
        setSpecialite("");
        onChercheurAdded();
      })
      .catch((err) => console.error("Erreur :", err));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Ajouter un chercheur</h2>
      <input
        type="text"
        placeholder="Nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Prénom"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Spécialité"
        value={specialite}
        onChange={(e) => setSpecialite(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Ajouter
      </button>
    </form>
  );
};

export default AjouterChercheur;
