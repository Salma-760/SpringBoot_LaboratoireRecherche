import React, { useEffect, useState } from "react";
import AjouterChapitre from "./AjouterChapitre";
import EditChapitre from "./EditChapitre";

const ListeChapitres = () => {
  const [chapitres, setChapitres] = useState([]);
  const [chapitreToEdit, setChapitreToEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchChapitres = () => {
    fetch("http://localhost:8081/api/chapitres")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setChapitres(data);
        } else {
          console.error("\u26a0\ufe0f Format invalide :", data);
          setChapitres([]);
        }
      })
      .catch((err) => {
        console.error("Erreur chargement chapitres :", err);
        setChapitres([]);
      });
  };

  useEffect(() => {
    fetchChapitres();
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:8081/api/chapitres/${id}`, {
      method: "DELETE",
    }).then(() => fetchChapitres());
  };

  const handleEdit = (chapitre) => {
    setChapitreToEdit(chapitre);
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setChapitreToEdit(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Liste des chapitres</h2>

      {!chapitreToEdit && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? "Fermer le formulaire" : "Ajouter un chapitre"}
        </button>
      )}

      {showForm && (
        <div className="bg-gray-50 p-4 rounded shadow mb-4">
          <h3 className="text-lg font-semibold mb-2">Ajouter un chapitre</h3>
          <AjouterChapitre
            onChapitreAdded={() => {
              fetchChapitres();
              setShowForm(false);
            }}
          />
        </div>
      )}

      {chapitreToEdit && (
        <EditChapitre
          chapitre={chapitreToEdit}
          onChapitreUpdated={() => {
            fetchChapitres();
            setChapitreToEdit(null);
          }}
          onCancel={handleCancelEdit}
        />
      )}

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Intitulé</th>
            <th className="border p-2">Livre (ISBN)</th>
            <th className="border p-2">Maison / Année</th>
            <th className="border p-2">Pages</th>
            <th className="border p-2">Auteurs</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {chapitres.map((c) => (
            <tr key={c.id} className="bg-white">
              <td className="border p-2">{c.intituleChapitre || ""}</td>
              <td className="border p-2">
                {c.titreLivre || ""} ({c.isbn || ""})
              </td>
              <td className="border p-2">
                {c.maisonEdition || ""} - {c.anneePublication || ""}
              </td>
              <td className="border p-2">
                {c.pageDebut || 0} à {c.pageFin || 0}
              </td>
              <td className="border p-2 text-sm">
                {c.auteurs && c.auteurs.length > 0
                  ? c.auteurs.map((a) => `${a?.nom || ""} ${a?.prenom || ""}`).join(", ")
                  : ""}
              </td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListeChapitres;
