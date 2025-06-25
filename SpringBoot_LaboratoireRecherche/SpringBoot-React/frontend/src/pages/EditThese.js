import React, { useEffect, useState } from "react";

const EditThese = ({ these, onTheseUpdated, onCancel }) => {
  // On initialise form avec un objet plat, on met directeurs sous forme de tableau d'IDs
  const [form, setForm] = useState({
    ...these,
    directeurs: these.directeurs ? these.directeurs.map((d) => d.id.toString()) : [],
  });
  const [directeurs, setDirecteurs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/directeurs")
      .then((res) => res.json())
      .then((data) => setDirecteurs(data))
      .catch((err) => console.error("Erreur chargement directeurs:", err));
  }, []);

  // Au cas où la prop "these" change, on synchronise form.directeurs
  useEffect(() => {
    setForm({
      ...these,
      directeurs: these.directeurs ? these.directeurs.map((d) => d.id.toString()) : [],
    });
  }, [these]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDirecteurChange = (e) => {
    const selected = [...e.target.selectedOptions].map((opt) => opt.value);
    setForm({ ...form, directeurs: selected });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // On reconstruit la liste des directeurs sous forme d'objets {id: x}
    const updatedData = {
      ...form,
      directeurs: form.directeurs.map((id) => ({ id: parseInt(id) })),
    };

    fetch(`http://localhost:8081/theses/${form.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then(() => onTheseUpdated())
      .catch((err) => console.error("Erreur maj thèse:", err));
  };

  return (
    <div className="bg-yellow-50 p-4 rounded shadow-md">
      <h2 className="text-lg font-bold mb-2">Modifier une thèse</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Champs texte */}
        <input
          type="text"
          name="nomDoctorant"
          placeholder="Nom du doctorant"
          value={form.nomDoctorant || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="prenomDoctorant"
          placeholder="Prénom du doctorant"
          value={form.prenomDoctorant || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="titreThese"
          placeholder="Titre de la thèse"
          value={form.titreThese || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="specialite"
          placeholder="Spécialité"
          value={form.specialite || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="anneeUniversitaire"
          placeholder="Année universitaire de la première inscription"
          value={form.anneeUniversitaire || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="dateSoutenance"
          placeholder="Date de soutenance"
          value={form.dateSoutenance || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Sélecteur multiple des directeurs */}
        <label className="block font-semibold">Directeurs</label>
        <select
          multiple
          value={form.directeurs || []} // tableau d'IDs string
          onChange={handleDirecteurChange}
          className="w-full border px-3 py-2 rounded"
        >
          {directeurs.map((d) => (
            <option key={d.id} value={d.id.toString()}>
              {d.nom} {d.prenom}
            </option>
          ))}
        </select>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Enregistrer
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

export default EditThese;
