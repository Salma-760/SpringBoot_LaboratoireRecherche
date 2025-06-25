import React, { useEffect, useState } from "react";

const EditLivre = ({ livre, onLivreUpdated, onCancel }) => {
  const [form, setForm] = useState({
    intituleLivre: "",
    isbn: "",
    maisonEdition: "",
    anneeParution: "",
    auteurs: []
  });

  const [auteurs, setAuteurs] = useState([]);

  useEffect(() => {
    // Charger la liste des auteurs
    fetch("http://localhost:8081/auteurs")
      .then(res => res.json())
      .then(data => setAuteurs(data));

    // Initialiser les champs avec les valeurs du livre
    if (livre) {
      setForm({
        intituleLivre: livre.intituleLivre || "",
        isbn: livre.isbn || "",
        maisonEdition: livre.maisonEdition || "",
        anneeParution: livre.anneeParution || "",
        auteurs: livre.auteurs ? livre.auteurs.map(a => a.id) : []
      });
    }
  }, [livre]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAuteurChange = (e) => {
    const selected = [...e.target.selectedOptions].map(opt => opt.value);
    setForm({ ...form, auteurs: selected });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedLivre = {
      ...form,
      auteurs: form.auteurs.map(id => ({ id: parseInt(id) }))
    };

    fetch(`http://localhost:8081/livres/${livre.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedLivre)
    })
      .then(() => {
        onLivreUpdated();
      })
      .catch(err => console.error("Erreur modification livre:", err));
  };

  return (
    <div className="bg-yellow-50 p-4 rounded shadow-md">
      <h2 className="text-lg font-bold mb-2">Modifier un livre</h2>
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
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Modifier
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

export default EditLivre;
