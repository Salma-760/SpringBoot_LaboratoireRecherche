import React, { useState } from "react";

const AjouterDirecteur = ({ onDirecteurAdded, onCancel }) => {
  const [form, setForm] = useState({ nom: "", prenom: "" });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8081/api/directeurs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(() => {
        setSuccess(true);
        onDirecteurAdded();
        setForm({ nom: "", prenom: "" });
        setTimeout(() => setSuccess(false), 2000);
      })
      .catch((err) => console.error("Erreur ajout directeur:", err));
  };

  return (
    <div className="bg-gray-50 p-4 rounded shadow-md">
      <h2 className="text-lg font-bold mb-3">Ajouter un directeur</h2>
      {success && <div className="text-green-600">Ajouté avec succès</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="nom" value={form.nom} onChange={handleChange} placeholder="Nom" className="w-full border p-2 rounded" />
        <input name="prenom" value={form.prenom} onChange={handleChange} placeholder="Prénom" className="w-full border p-2 rounded" />
        <div className="flex gap-2">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Ajouter</button>
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Annuler</button>
        </div>
      </form>
    </div>
  );
};

export default AjouterDirecteur;