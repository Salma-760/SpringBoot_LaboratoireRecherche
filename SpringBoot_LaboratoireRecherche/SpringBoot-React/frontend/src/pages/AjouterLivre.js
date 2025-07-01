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
      .then((data) => {
        setAuteurs(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Erreur chargement auteurs:", err);
        setError("Impossible de charger la liste des auteurs.");
      });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAuteurChange = (e) => {
    const selected = [...e.target.selectedOptions].map((opt) => opt.value);
    setForm({ ...form, auteurs: selected });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const livreData = {
  ...form,
  auteursDTO: form.auteurs.map((id) => ({ id: parseInt(id) })), // ✅ attention au nom du champ !
};

    fetch("http://localhost:8081/api/livres", {
      method: "POST",
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
      .then((data) => {
        console.log("Livre ajouté:", data);
        if (typeof onLivreAdded === "function") {
          onLivreAdded(); // appelle la fonction du parent
        }
        setForm({
          intituleLivre: "",
          isbn: "",
          maisonEdition: "",
          anneeParution: "",
          auteurs: [],
        });
        setError(null);
      })
      .catch((err) => {
        console.error("Erreur ajout livre:", err);
        setError("Échec de l'ajout du livre.");
      });
  };

  return (
    <div className="bg-gray-50 p-4 rounded shadow-md">
      <h2 className="text-lg font-bold mb-2">Ajouter un livre</h2>
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
