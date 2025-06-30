import React, { useEffect, useState } from "react";

const EditChapitre = ({ chapitre, onChapitreUpdated, onCancel }) => {
  const [form, setForm] = useState({ ...chapitre });
  const [auteurs, setAuteurs] = useState([]);
  const [selectedAuteurs, setSelectedAuteurs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8081/api/auteurs", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => a.nom.localeCompare(b.nom));
        setAuteurs(sorted);

        // Initialiser les auteurs sélectionnés
        if (chapitre.auteurs) {
          setSelectedAuteurs(chapitre.auteurs.map((a) => a.id.toString()));
        }
      })
      .catch((err) => console.error("Erreur chargement auteurs :", err));
  }, [chapitre]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAuteurChange = (e) => {
    const ids = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setSelectedAuteurs(ids);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = {
      ...form,
      auteurs: selectedAuteurs.map((id) => ({ id: parseInt(id) })),
    };

    const token = localStorage.getItem("token");

    fetch(`http://localhost:8081/api/chapitres/${chapitre.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        onChapitreUpdated();
      })
      .catch((err) => console.error("Erreur modification:", err));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 bg-yellow-50 p-4 rounded shadow"
    >
      <h3 className="text-lg font-semibold mb-2">✏️ Modifier Chapitre</h3>

      <input
        name="intituleChapitre"
        value={form.intituleChapitre || ""}
        onChange={handleChange}
        className="w-full p-2 border"
      />
      <input
        name="titreLivre"
        value={form.titreLivre || ""}
        onChange={handleChange}
        className="w-full p-2 border"
      />
      <input
        name="isbn"
        value={form.isbn || ""}
        onChange={handleChange}
        className="w-full p-2 border"
      />
      <input
        name="maisonEdition"
        value={form.maisonEdition || ""}
        onChange={handleChange}
        className="w-full p-2 border"
      />
      <input
        name="anneePublication"
        type="number"
        value={form.anneePublication || ""}
        onChange={handleChange}
        className="w-full p-2 border"
      />
      <input
        name="pageDebut"
        type="number"
        value={form.pageDebut || ""}
        onChange={handleChange}
        className="w-full p-2 border"
      />
      <input
        name="pageFin"
        type="number"
        value={form.pageFin || ""}
        onChange={handleChange}
        className="w-full p-2 border"
      />

      <label className="font-semibold">Auteurs</label>
      <select
        multiple
        value={selectedAuteurs}
        onChange={handleAuteurChange}
        className="w-full p-2 border rounded"
      >
        {auteurs.map((a) => (
          <option key={a.id} value={a.id}>
            {a.nom} {a.prenom}
          </option>
        ))}
      </select>

      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

export default EditChapitre;
