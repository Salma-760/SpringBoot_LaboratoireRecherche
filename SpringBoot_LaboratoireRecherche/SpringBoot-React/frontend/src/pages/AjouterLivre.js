import React, { useEffect, useState } from "react";

const AjouterLivre = ({ onLivreAdded, onCancel }) => {
  const [form, setForm] = useState({
    intituleLivre: "",
    isbn: "",
    maisonEdition: "",
    anneeParution: "",
    auteurs: [],
  });

  const [auteurs, setAuteurs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/api/auteurs")
      .then((res) => res.json())
      .then((data) => setAuteurs(data))
      .catch((err) => console.error("Erreur chargement auteurs:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAuteurChange = (e) => {
    const selected = [...e.target.selectedOptions].map((opt) => opt.value);
    setForm({ ...form, auteurs: selected });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const livreData = {
      ...form,
      auteurs: form.auteurs.map((id) => ({ id: parseInt(id) })),
    };

    fetch("http://localhost:8081/api/livres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(livreData),
    })
      .then(() => {
        onLivreAdded();
        setForm({
          intituleLivre: "",
          isbn: "",
          maisonEdition: "",
          anneeParution: "",
          auteurs: [],
        });
      })
      .catch((err) => console.error("Erreur ajout livre:", err));
  };

  return (
    <div className="bg-gray-50 p-4 rounded shadow-md">
      <h2 className="text-lg font-bold mb-2">Ajouter un livre</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="intituleLivre"
          placeholder="Intitulé du livre"
          value={form.intituleLivre}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="isbn"
          placeholder="ISBN"
          value={form.isbn}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="maisonEdition"
          placeholder="Maison d'édition"
          value={form.maisonEdition}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="anneeParution"
          placeholder="Année de parution"
          value={form.anneeParution}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <label className="block font-semibold">Auteurs</label>
        <select
          multiple
          value={form.auteurs}
          onChange={handleAuteurChange}
          className="w-full border px-3 py-2 rounded"
        >
          {auteurs.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nom} {a.prenom}
            </option>
          ))}
        </select>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Ajouter
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
    </div>
  );
};

export default AjouterLivre;
