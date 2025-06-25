import React, { useState } from "react";

const AuteurForm = ({ onAuteurAdded }) => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const auteur = { nom, prenom, email };

    fetch("http://localhost:8080/auteurs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(auteur),
    })
      .then((res) => res.json())
      .then(() => {
        setNom("");
        setPrenom("");
        setEmail("");
        onAuteurAdded();
      })
      .catch((err) => console.error("Erreur ajout :", err));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-green-100 p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Ajouter un auteur</h2>
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
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Ajouter
      </button>
    </form>
  );
};

export default AuteurForm;
