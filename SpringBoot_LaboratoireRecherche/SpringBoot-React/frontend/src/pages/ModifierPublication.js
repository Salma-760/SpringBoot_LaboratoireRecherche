import React, { useState, useEffect } from "react";

const baseIndexationOptions = [
  { value: "Scopus", label: "Scopus" },
  { value: "dblp", label: "DBLP" },
  { value: "WOS", label: "WOS" },
  { value: "WebOfScience", label: "Web of Science" },
];

const statutOptions = [
  { value: "EN_ATTENTE", label: "En attente" },
  { value: "VALIDE", label: "Validé" },
  { value: "REFUSE", label: "Refusé" },
];

const ModifierPublication = ({ publication, auteursDisponibles, onCancel, onSave }) => {
  const [form, setForm] = useState({
    ...publication,
    auteurs: publication.auteurs ? publication.auteurs.map(a => a.id) : [],
    baseIndexation: publication.baseIndexation || [],
    resume: publication.resume || "",
    statut: publication.statut || "EN_ATTENTE",
  });

  useEffect(() => {
    console.log("Publication reçue pour modification :", publication);
    setForm({
      ...publication,
      auteurs: publication.auteurs ? publication.auteurs.map(a => a.id) : [],
      baseIndexation: publication.baseIndexation || [],
      resume: publication.resume || "",
      statut: publication.statut || "EN_ATTENTE",
    });
  }, [publication]);

  const handleChange = (e) => {
    console.log(`Champ modifié: ${e.target.name} = ${e.target.value}`);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBaseIndexationChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
    console.log("Base d'indexation sélectionnée :", selected);
    setForm({ ...form, baseIndexation: selected });
  };

  const handleAuteursChange = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions).map(opt => parseInt(opt.value));
    console.log("Auteurs sélectionnés (ids) :", selectedIds);
    setForm({ ...form, auteurs: selectedIds });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulaire soumis avec données :", form);

    const updatedPublication = {
      ...form,
      auteurs: form.auteurs.map(id => ({ id })),
    };

    console.log("Payload envoyé au backend :", updatedPublication);

    fetch(`http://localhost:8081/api/publications/${form.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(updatedPublication),
    })
      .then(res => {
        console.log("Réponse du backend à la mise à jour :", res);
        if (!res.ok) throw new Error("Erreur lors de la mise à jour");
        return res.json();
      })
      .then(data => {
        console.log("Données retournées par le backend après mise à jour :", data);
        onSave(data);
      })
      .catch(err => {
        console.error("Erreur attrapée lors de la mise à jour :", err);
        alert(err.message);
      });
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-xl mx-auto mb-6">
      <h3 className="text-xl font-bold mb-3">Modifier la publication</h3>
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

        <label className="block font-semibold">Base d'indexation</label>
        <select
          multiple
          name="baseIndexation"
          value={form.baseIndexation}
          onChange={handleBaseIndexationChange}
          className="w-full border rounded p-2"
        >
          {baseIndexationOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <input
          type="number"
          name="annee"
          placeholder="Année publication"
          value={form.annee || ""}
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

        <textarea
          name="resume"
          placeholder="Résumé"
          value={form.resume}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={4}
        />

        <label className="block font-semibold">Statut</label>
        <select
          name="statut"
          value={form.statut}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          {statutOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <label className="block font-semibold">Auteurs</label>
        <select
          multiple
          value={form.auteurs || []}
          onChange={handleAuteursChange}
          className="w-full border rounded p-2"
        >
          {auteursDisponibles.map(a => (
            <option key={a.id} value={a.id}>{a.nom} {a.prenom}</option>
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
