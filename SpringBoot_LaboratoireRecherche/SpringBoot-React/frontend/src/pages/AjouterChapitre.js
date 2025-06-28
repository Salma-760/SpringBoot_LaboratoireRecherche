import React, { useEffect, useState } from "react";

const AjouterChapitre = ({ onChapitreAdded }) => {
  const [form, setForm] = useState({
    intituleChapitre: "",
    titreLivre: "",
    isbn: "",
    maisonEdition: "",
    anneePublication: "",
    pageDebut: "",
    pageFin: "",
  });

  const [auteurs, setAuteurs] = useState([]);
  const [selectedAuteurs, setSelectedAuteurs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/api/auteurs")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => a.nom.localeCompare(b.nom));
        setAuteurs(sorted);
      })
      .catch((err) => console.error("Erreur chargement auteurs :", err));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAuteurChange = (e) => {
    const selectedIds = [...e.target.selectedOptions].map((opt) => opt.value);
    setSelectedAuteurs(selectedIds);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const chapitreData = {
      ...form,
      auteurs: selectedAuteurs.map((id) => ({ id: parseInt(id) })),
    };

    fetch("http://localhost:8081/api/chapitres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chapitreData),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Erreur lors de l'ajout");
        alert("✅ Chapitre ajouté avec succès !");
        if (onChapitreAdded) onChapitreAdded();
      })
      .catch((err) => {
        console.error("Erreur ajout chapitre :", err);
        alert("❌ Échec de l'ajout du chapitre.");
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 bg-gray-100 p-4 rounded shadow"
    >
      <input
        name="intituleChapitre"
        placeholder="Intitulé du chapitre"
        onChange={handleChange}
        className="w-full p-2 border"
        required
      />
      <input
        name="titreLivre"
        placeholder="Titre du livre"
        onChange={handleChange}
        className="w-full p-2 border"
        required
      />
      <input
        name="isbn"
        placeholder="ISBN"
        onChange={handleChange}
        className="w-full p-2 border"
      />
      <input
        name="maisonEdition"
        placeholder="Maison d’édition"
        onChange={handleChange}
        className="w-full p-2 border"
        required
      />
      <input
        name="anneePublication"
        placeholder="Année"
        type="number"
        onChange={handleChange}
        className="w-full p-2 border"
        required
      />
      <input
        name="pageDebut"
        placeholder="Page de début"
        type="number"
        onChange={handleChange}
        className="w-full p-2 border"
      />
      <input
        name="pageFin"
        placeholder="Page de fin"
        type="number"
        onChange={handleChange}
        className="w-full p-2 border"
      />

      {/* ✅ Liste des auteurs triée */}
      <label className="block font-semibold">Auteurs</label>
      <select
        multiple
        value={selectedAuteurs}
        onChange={handleAuteurChange}
        className="w-full border px-3 py-2 rounded"
        required
      >
        {auteurs.map((auteur) => (
          <option key={auteur.id} value={auteur.id}>
            {auteur.nom} {auteur.prenom}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded mt-2"
      >
        Ajouter
      </button>
    </form>
  );
};

export default AjouterChapitre;
