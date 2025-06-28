import React, { useState } from "react";

const AuteurForm = ({ onAuteurAdded }) => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const auteur = { nom, prenom, email };

    const token = localStorage.getItem("token");

    fetch("http://localhost:8081/api/auteurs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(auteur),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erreur HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        setNom("");
        setPrenom("");
        setEmail("");
        if (onAuteurAdded) onAuteurAdded();
      })
      .catch((err) => {
        console.error("Erreur ajout :", err.message);
        alert("❌ Échec de l'ajout : vérifie ton rôle (ADMIN) ou ta connexion.");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-green-100 p-4 rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center text-green-700">Ajouter un auteur</h2>
      <input
        type="text"
        placeholder="Nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />
      <input
        type="text"
        placeholder="Prénom"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
        className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition duration-200"
      >
        Ajouter
      </button>
    </form>
  );
};

export default AuteurForm;
