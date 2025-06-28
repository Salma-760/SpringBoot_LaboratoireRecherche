import React, { useEffect, useState } from "react";

const AjouterThese = ({ onTheseAdded, onCancel }) => {
  const [form, setForm] = useState({
    nomDoctorant: "",
    prenomDoctorant: "",
    titreThese: "",
    specialite: "",
    anneeUniversitaire: "",
    dateSoutenance: "",
    directeurs: [],
  });

  const [directeurs, setDirecteurs] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8081/api/directeurs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDirecteurs(data);
        else setDirecteurs([]);
      })
      .catch((err) => {
        console.error("Erreur chargement directeurs:", err);
        setDirecteurs([]);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDirecteursChange = (e) => {
    const selected = [...e.target.selectedOptions].map((opt) => opt.value);
    setForm({ ...form, directeurs: selected });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const theseData = {
      ...form,
      directeurs: form.directeurs.map((id) => ({ id: parseInt(id) })),
    };

    fetch("http://localhost:8081/api/theses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(theseData),
    })
      .then(() => {
        setSuccessMessage("✅ Thèse ajoutée avec succès !");
        onTheseAdded();
        setForm({
          nomDoctorant: "",
          prenomDoctorant: "",
          titreThese: "",
          specialite: "",
          anneeUniversitaire: "",
          dateSoutenance: "",
          directeurs: [],
        });
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((err) => console.error("Erreur ajout thèse:", err));
  };

  return (
    <div className="bg-gray-50 p-4 rounded shadow-md">
      <h2 className="text-lg font-bold mb-3">Ajouter une thèse</h2>

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-2 rounded mb-3">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            name="nomDoctorant"
            placeholder="Nom du doctorant"
            value={form.nomDoctorant}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
          />
          <input
            type="text"
            name="prenomDoctorant"
            placeholder="Prénom du doctorant"
            value={form.prenomDoctorant}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
          />
        </div>

        <input
          type="text"
          name="titreThese"
          placeholder="Titre de la thèse"
          value={form.titreThese}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="specialite"
          placeholder="Spécialité"
          value={form.specialite}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="anneeUniversitaire"
          placeholder="Année universitaire de 1ère inscription"
          value={form.anneeUniversitaire}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="date"
          name="dateSoutenance"
          value={form.dateSoutenance}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <label className="block font-semibold">Directeur(s) de thèse</label>
        <select
          multiple
          value={form.directeurs}
          onChange={handleDirecteursChange}
          className="w-full border px-3 py-2 rounded"
        >
          {directeurs.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nom} {d.prenom}
            </option>
          ))}
        </select>

        <div className="flex gap-3 mt-2">
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

export default AjouterThese;
