import React, { useState } from "react";

const AjouterChercheur = ({ onChercheurAdded }) => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [specialite, setSpecialite] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const chercheur = { nom, prenom, email, specialite };
    const token = localStorage.getItem("token");

    fetch("http://localhost:8081/api/chercheurs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(chercheur),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Échec de l'ajout du chercheur");
        }
        // Si pas de contenu JSON (HTTP 204), on retourne un objet vide
        return res.json().catch(() => ({}));
      })
      .then(() => {
        setNom("");
        setPrenom("");
        setEmail("");
        setSpecialite("");
        if (typeof onChercheurAdded === "function") {
          onChercheurAdded(); // 🔁 recharge la liste dans ListeChercheurs
        }
      })
      .catch((err) => console.error("Erreur lors de l'ajout :", err));
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
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Ajouter
      </button>
    </form>
  );
};

export default AjouterChercheur;
