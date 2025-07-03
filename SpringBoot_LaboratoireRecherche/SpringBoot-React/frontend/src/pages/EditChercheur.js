import React, { useState, useEffect } from "react";

const EditChercheur = ({ chercheur, onChercheurUpdated, onCancel }) => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [specialite, setSpecialite] = useState("");

  useEffect(() => {
    if (chercheur) {
      setNom(chercheur.nom || "");
      setPrenom(chercheur.prenom || "");
      setEmail(chercheur.email || "");
      setSpecialite(chercheur.specialite || "");
    }
  }, [chercheur]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedChercheur = { nom, prenom, email, specialite };

    const token = localStorage.getItem("token");

    fetch(`http://localhost:8081/api/chercheurs/${chercheur.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedChercheur),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erreur HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        onChercheurUpdated();
        onCancel();
      })
      .catch((err) => {
        console.error("❌ Erreur update chercheur :", err);
        alert("Erreur lors de la modification du chercheur.");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-yellow-100 p-6 rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-yellow-800 text-center">
        Modifier un chercheur
      </h2>
      <input
        type="text"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Nom"
        className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
        required
      />
      <input
        type="text"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
        placeholder="Prénom"
        className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
        required
      />
      <input
        type="text"
        value={specialite}
        onChange={(e) => setSpecialite(e.target.value)}
        placeholder="Spécialité"
        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
        required
      />
      <div className="flex justify-between gap-4">
        <button
          type="submit"
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded w-full"
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded w-full"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

export default EditChercheur;
