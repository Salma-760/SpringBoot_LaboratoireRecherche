import React, { useEffect, useState } from "react";

const EditLivre = ({ livre, onLivreUpdated, onCancel }) => {
  const [form, setForm] = useState({
    intituleLivre: livre.intituleLivre || "",
    isbn: livre.isbn || "",
    maisonEdition: livre.maisonEdition || "",
    anneeParution: livre.anneeParution || "",
    auteurs: livre.auteursDTO ? livre.auteursDTO.map((a) => a.id.toString()) : [],
  });

  const [auteurs, setAuteurs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8081/api/auteurs", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setAuteurs(data))
      .catch((err) => {
        console.error("Erreur chargement auteurs:", err);
        setError("Impossible de charger la liste des auteurs.");
      });
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

    const token = localStorage.getItem("token");

    const livreData = {
      intituleLivre: form.intituleLivre,
      isbn: form.isbn,
      maisonEdition: form.maisonEdition,
      anneeParution: parseInt(form.anneeParution, 10),
      auteursDTO: form.auteurs.map((id) => ({ id: parseInt(id, 10) })), // ✅ Correction ici
    };

    fetch(`http://localhost:8081/api/livres/${livre.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(livreData),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      })
      .then(() => {
        onLivreUpdated();
        setError(null);
      })
      .catch((err) => {
        console.error("Erreur mise à jour livre:", err);
        setError("Échec de la mise à jour du livre.");
      });
  };

  return (
    <div className="bg-yellow-100 p-4 rounded shadow-md">
      <h2 className="text-lg font-bold mb-2">Modifier un livre</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="intituleLivre"
          placeholder="Intitulé du livre"
          value={form.intituleLivre}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
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
          required
        />

        <input
          type="number"
          name="anneeParution"
          placeholder="Année de parution"
          value={form.anneeParution}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <label className="block font-semibold">Auteurs</label>
        <select
          multiple
          value={form.auteurs}
          onChange={handleAuteurChange}
          className="w-full border px-3 py-2 rounded"
          required
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
            className="bg-yellow-500 text-black px-4 py-2 rounded"
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
