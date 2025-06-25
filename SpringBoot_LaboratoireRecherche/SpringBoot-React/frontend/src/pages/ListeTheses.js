import React, { useEffect, useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import AjouterThese from "./AjouterThese";
import EditThese from "./EditThese";

const ListeTheses = () => {
  const [theses, setTheses] = useState([]);
  const [theseToEdit, setTheseToEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTheses = () => {
    fetch("http://localhost:8081/theses")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTheses(data);
        }
      })
      .catch((err) => console.error("Erreur chargement thèses :", err));
  };

  useEffect(() => {
    fetchTheses();
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:8081/theses/${id}`, { method: "DELETE" })
      .then(() => fetchTheses())
      .catch((err) => console.error("Erreur suppression :", err));
  };

  const renderDirecteur = (d, thesisId, index) => {
    if (typeof d === "object" && d !== null) {
      return (
        <div key={d.id || `${thesisId}-dir-${index}`}>
          {d.nom ?? "?"} {d.prenom ?? "?"}
        </div>
      );
    } else if (typeof d === "number" || typeof d === "string") {
      return <div key={`${thesisId}-dir-${index}`}>Directeur ID: {d}</div>;
    } else {
      return <div key={`${thesisId}-dir-${index}`}>Directeur inconnu</div>;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Liste des thèses</h2>

      {!showForm && !theseToEdit && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Ajouter une thèse
        </button>
      )}

      {showForm && (
        <AjouterThese
          onTheseAdded={() => {
            fetchTheses();
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {theseToEdit && (
        <EditThese
          these={theseToEdit}
          onTheseUpdated={() => {
            fetchTheses();
            setTheseToEdit(null);
          }}
          onCancel={() => setTheseToEdit(null)}
        />
      )}

      <table className="w-full border mt-6 border-collapse border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border border-gray-300">Doctorant</th>
            <th className="p-2 border border-gray-300">Titre</th>
            <th className="p-2 border border-gray-300">Spécialité</th>
            <th className="p-2 border border-gray-300">Année Univ.</th>
            <th className="p-2 border border-gray-300">Date soutenance</th>
            <th className="p-2 border border-gray-300">Directeurs</th>
            <th className="p-2 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {theses.map((t) => (
            <tr key={t.id} className="text-center">
              <td className="border border-gray-300 p-2">{t.nomDoctorant} {t.prenomDoctorant}</td>
              <td className="border border-gray-300 p-2">{t.titreThese}</td>
              <td className="border border-gray-300 p-2">{t.specialite}</td>
              <td className="border border-gray-300 p-2">{t.anneeUniversitaire}</td>
              <td className="border border-gray-300 p-2">{t.dateSoutenance}</td>
              <td className="border border-gray-300 p-2 text-left">
                {Array.isArray(t.directeurs) && t.directeurs.length > 0 ? (
                  t.directeurs.map((d, index) => renderDirecteur(d, t.id, index))
                ) : (
                  <span>Aucun</span>
                )}
              </td>
              <td className="border border-gray-300 p-2 flex justify-center gap-4">
                {/* Bouton Modifier */}
                <button
                  onClick={() => setTheseToEdit(t)}
                  aria-label="Modifier"
                  className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded transition-transform active:scale-95 select-none"
                  type="button"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                  Modifier
                </button>
                {/* Bouton Supprimer */}
                <button
                  onClick={() => handleDelete(t.id)}
                  aria-label="Supprimer"
                  className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded transition-transform active:scale-95 select-none"
                  type="button"
                >
                  <TrashIcon className="h-5 w-5" />
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

export default ListeTheses;
