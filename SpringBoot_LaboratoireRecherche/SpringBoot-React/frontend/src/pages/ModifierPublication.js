import React, { useState, useEffect } from "react";

const ModifierPublication = ({ publication, auteursDisponibles, onCancel, onSave }) => {
  const [form, setForm] = useState({ ...publication, auteurs: publication.auteurs.map(a => a.id) });

  useEffect(() => {
    setForm({ ...publication, auteurs: publication.auteurs.map(a => a.id) });
  }, [publication]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAuteursChange = (e) => {
    const selectedIds = [...e.target.selectedOptions].map(option => parseInt(option.value));
    setForm({ ...form, auteurs: selectedIds });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedPublication = {
      ...form,
      auteurs: form.auteurs.map(id => ({ id }))
    };

    fetch(`http://localhost:8081/publications/${form.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPublication),
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors de la mise à jour");
        return res.json();
      })
      .then(data => {
        onSave(data);
      })
      .catch(err => alert(err.message));
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-xl mx-auto mb-6">
      <h3 className="text-xl font-bold mb-3">Modifier la publication </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="titre"
          placeholder="Titre"
          value={form.titre || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="journal"
          placeholder="Journal"
          value={form.journal || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="base_indexation"
          placeholder="Base d'indexation"
          value={form.base_indexation || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="annee_publication"
          placeholder="Année publication"
          value={form.annee_publication || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="volume"
          placeholder="Volume"
          value={form.volume || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="pages"
          placeholder="Pages"
          value={form.pages || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="doi"
          placeholder="DOI"
          value={form.doi || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <label className="block font-semibold">Auteurs</label>
        <select
          multiple
          value={form.auteurs || []}
          onChange={handleAuteursChange}
          className="w-full border rounded p-2"
        >
          {auteursDisponibles.map(a => (
            <option key={a.id} value={a.id}>
              {a.nom} {a.prenom}
            </option>
          ))}
        </select>

        <div className="flex gap-3 justify-end mt-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Enregistrer</button>
          <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Annuler</button>
        </div>
      </form>
    </div>
  );
};

export default ModifierPublication;
