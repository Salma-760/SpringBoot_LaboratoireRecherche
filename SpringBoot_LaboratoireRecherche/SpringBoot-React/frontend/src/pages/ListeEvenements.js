import React, { useEffect, useState } from "react";
import AjouterEvenement from "./AjouterEvenement";

const ListeEvenements = () => {
  const [evenements, setEvenements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem("token");

  const fetchEvenements = () => {
    fetch("http://localhost:8081/api/evenements", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setEvenements(data))
      .catch(err => console.error("Erreur de chargement:", err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8081/api/evenements/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    }).then(fetchEvenements);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Date inconnue";
    const date = new Date(dateStr);
    return date.toLocaleString("fr-FR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  useEffect(() => {
    fetchEvenements();
  }, []);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">
        Nos Événements
      </h1>

      {/* 🔘 Bouton pour afficher / masquer le formulaire */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {showForm ? "Fermer le formulaire" : "➕ Ajouter un événement"}
        </button>
      </div>

      {/* ✅ Formulaire visible si showForm est true */}
      {showForm && (
        <AjouterEvenement
          refresh={() => {
            fetchEvenements();
            setShowForm(false); // refermer le formulaire après ajout
          }}
        />
      )}

      <div className="space-y-4 mt-6">
        {evenements.map((e) => (
          <div
            key={e.id}
            className="flex bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
          >
            {e.imageUrl && (
              <img
                src={e.imageUrl}
                alt={e.titre}
                className="w-48 h-32 object-cover"
              />
            )}
            <div className="flex-1 p-4">
              <h2 className="text-lg font-semibold text-blue-700">
                {e.titre}
              </h2>
              <p className="text-sm text-gray-500">
                📅 {formatDate(e.dateDebut)} → {formatDate(e.dateFin)}
              </p>
              <p className="text-sm text-gray-600 mb-2">📍 {e.lieu}</p>
              <p className="text-sm text-gray-800 line-clamp-2">{e.description}</p>
              <button
                onClick={() => handleDelete(e.id)}
                className="mt-2 text-sm text-red-600 hover:underline"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeEvenements;
