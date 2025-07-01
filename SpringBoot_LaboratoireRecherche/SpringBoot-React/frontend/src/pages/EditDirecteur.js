import React, { useState } from "react";

const EditDirecteur = ({ directeur, onDirecteurUpdated, onCancel }) => {
  const [form, setForm] = useState({
    nom: directeur.nom || "",
    prenom: directeur.prenom || "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    fetch(`http://localhost:8081/api/directeurs/${directeur.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) {
            throw new Error("Accès interdit : vous n'avez pas les droits nécessaires.");
          } else {
            throw new Error(`Erreur HTTP ${res.status}`);
          }
        }
        return res.json().catch(() => ({}));
      })
      .then(() => {
        setSuccess(true);
        setError(null);
        onDirecteurUpdated();
        setTimeout(() => setSuccess(false), 2000);
      })
      .catch((err) => {
        console.error("Erreur mise à jour directeur :", err);
        setError(err.message || "Échec de la mise à jour.");
      });
  };

  return (
    <div className="bg-yellow-50 p-4 rounded shadow-md">
      <h2 className="text-lg font-bold mb-3">Modifier le directeur</h2>

      {success && <div className="text-green-600 mb-2">Modifié avec succès</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="nom"
          value={form.nom}
          onChange={handleChange}
          placeholder="Nom"
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="prenom"
          value={form.prenom}
          onChange={handleChange}
          placeholder="Prénom"
          className="w-full border p-2 rounded"
          required
        />

        <div className="flex gap-2">
          <button type="submit" className="bg-yellow-500 text-black px-4 py-2 rounded">
            Modifier
          </button>
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDirecteur;
