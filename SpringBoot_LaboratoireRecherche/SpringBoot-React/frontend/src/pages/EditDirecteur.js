import React, { useState } from "react";

const EditDirecteur = ({ directeur, onDirecteurUpdated, onCancel }) => {
  const [form, setForm] = useState({ nom: directeur.nom, prenom: directeur.prenom });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8081/directeurs/${directeur.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(() => onDirecteurUpdated())
      .catch((err) => console.error("Erreur modification:", err));
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-2 bg-yellow-50 p-4 rounded shadow-md">
      <input name="nom" value={form.nom} onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="prenom" value={form.prenom} onChange={handleChange} className="w-full border p-2 rounded" />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Modifier</button>
        <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Annuler</button>
      </div>
    </form>
  );
};

export default EditDirecteur;