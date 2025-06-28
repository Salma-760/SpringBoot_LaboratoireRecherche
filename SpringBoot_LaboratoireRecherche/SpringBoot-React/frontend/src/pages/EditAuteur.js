import React, { useState, useEffect } from "react";

const AuteurModifier = ({ auteur, onAuteurUpdated, onCancel }) => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (auteur) {
      setNom(auteur.nom || "");
      setPrenom(auteur.prenom || "");
      setEmail(auteur.email || "");
    }
  }, [auteur]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8081/api/auteurs/${auteur.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nom, prenom, email }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur HTTP " + res.status);
        return res.json();
      })
      .then(() => {
        onAuteurUpdated();
        onCancel();
      })
      .catch((err) => console.error("Erreur modification :", err));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-yellow-100 p-4 rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-2">Modifier l’auteur</h2>
      <input
        type="text"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <input
        type="text"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <div className="flex gap-2">
        <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

export default AuteurModifier;
