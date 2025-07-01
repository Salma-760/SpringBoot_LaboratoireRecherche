import React, { useState } from "react";

const AjouterDirecteur = ({ onDirecteurAdded, onCancel }) => {
  const [form, setForm] = useState({ nom: "", prenom: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null); // ⛔ Pour afficher un message d'erreur

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    fetch("http://localhost:8081/api/directeurs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "", // ✅ Envoie du token
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
        return res.json().catch(() => ({})); // Si le backend ne renvoie rien
      })
      .then(() => {
        setSuccess(true);
        setError(null);
        onDirecteurAdded(); // Rafraîchit la liste
        setForm({ nom: "", prenom: "" });
        setTimeout(() => setSuccess(false), 2000);
      })
      .catch((err) => {
        console.error("Erreur ajout directeur:", err);
        setError(err.message || "Erreur lors de l'ajout du directeur.");
      });
  };

  return (
    <div className="bg-gray-50 p-4 rounded shadow-md">
      <h2 className="text-lg font-bold mb-3">Ajouter un directeur</h2>

      {success && <div className="text-green-600">Ajouté avec succès</div>}
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
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Ajouter
          </button>
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjouterDirecteur;
