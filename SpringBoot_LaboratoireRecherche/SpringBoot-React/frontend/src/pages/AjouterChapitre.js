import React, { useEffect, useState } from "react";

const AjouterChapitre = ({ onChapitreAdded }) => {
  const [auteursDisponibles, setAuteursDisponibles] = useState([]);
  const [selectedAuteurIds, setSelectedAuteurIds] = useState([]);
  const [formData, setFormData] = useState({
    intituleChapitre: "",
    titreLivre: "",
    isbn: "",
    maisonEdition: "",
    anneePublication: "",
    pageDebut: "",
    pageFin: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8081/api/auteurs", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setAuteursDisponibles(data))
      .catch((err) => console.error("Erreur chargement auteurs:", err));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAuteurSelection = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(parseInt(options[i].value));
      }
    }
    setSelectedAuteurIds(selected);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const auteursSelectionnes = auteursDisponibles
      .filter((a) => selectedAuteurIds.includes(a.id))
      .map((a) => ({ id: a.id }));

    const chapitre = {
      ...formData,
      anneePublication: parseInt(formData.anneePublication),
      pageDebut: parseInt(formData.pageDebut),
      pageFin: parseInt(formData.pageFin),
      auteurs: auteursSelectionnes
    };

    fetch("http://localhost:8081/api/chapitres", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(chapitre)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur HTTP " + res.status);
        return res.json();
      })
      .then((data) => {
        console.log("✅ Chapitre ajouté:", data);
        onChapitreAdded();
      })
      .catch((err) => {
        console.error("❌ Erreur ajout chapitre:", err.message);
        alert("Erreur lors de l'ajout du chapitre");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="intituleChapitre"
        placeholder="Intitulé du chapitre"
        value={formData.intituleChapitre}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      />
      <input
        type="text"
        name="titreLivre"
        placeholder="Titre du livre"
        value={formData.titreLivre}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />
      <input
        type="text"
        name="isbn"
        placeholder="ISBN"
        value={formData.isbn}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />
      <input
        type="text"
        name="maisonEdition"
        placeholder="Maison d'édition"
        value={formData.maisonEdition}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />
      <input
        type="number"
        name="anneePublication"
        placeholder="Année de publication"
        value={formData.anneePublication}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />
      <input
        type="number"
        name="pageDebut"
        placeholder="Page début"
        value={formData.pageDebut}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />
      <input
        type="number"
        name="pageFin"
        placeholder="Page fin"
        value={formData.pageFin}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />

      <label className="block font-semibold">Auteurs :</label>
      <select
        multiple
        onChange={handleAuteurSelection}
        className="border p-2 w-full rounded h-32"
        required
      >
        {auteursDisponibles.map((a) => (
          <option key={a.id} value={a.id}>
            {a.prenom} {a.nom}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Ajouter Chapitre
      </button>
    </form>
  );
};

export default AjouterChapitre;
