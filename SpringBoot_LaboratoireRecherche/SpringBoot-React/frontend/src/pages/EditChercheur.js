import React, { useState, useEffect } from "react";

const EditChercheur = ({ chercheur, onChercheurUpdated, onCancel }) => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [specialite, setSpecialite] = useState("");

  useEffect(() => {
    if (chercheur) {
      setNom(chercheur.nom);
      setPrenom(chercheur.prenom);
      setEmail(chercheur.email);
      setSpecialite(chercheur.specialite);
    }
  }, [chercheur]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedChercheur = { nom, prenom, email, specialite };

    fetch(`http://localhost:8081/api/chercheurs/${chercheur.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedChercheur),
    })
      .then((res) => res.json())
      .then(() => {
        onChercheurUpdated();
        onCancel();
      })
      .catch((err) => console.error("Erreur :", err));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-yellow-100 p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Modifier le chercheur</h2>
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
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <input
        type="text"
        value={specialite}
        onChange={(e) => setSpecialite(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <div className="flex gap-2">
        <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
        <button onClick={onCancel} type="button" className="bg-gray-500 text-white px-4 py-2 rounded">
          Annuler
        </button>
      </div>
    </form>
  );
};

export default EditChercheur;
