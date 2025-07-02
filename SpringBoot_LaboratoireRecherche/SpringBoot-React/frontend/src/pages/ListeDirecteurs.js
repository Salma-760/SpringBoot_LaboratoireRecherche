import React, { useEffect, useState } from "react";
import AjouterDirecteur from "./AjouterDirecteur";
import EditDirecteur from "./EditDirecteur";
import {
  BriefcaseIcon,
  IdentificationIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

const ListeDirecteurs = () => {
  const [directeurs, setDirecteurs] = useState([]);
  const [directeurToEdit, setDirecteurToEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  const fetchDirecteurs = () => {
    fetch("http://localhost:8081/api/directeurs")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur chargement directeurs");
        return res.json();
      })
      .then((data) => setDirecteurs(data))
      .catch((err) => {
        console.error("Erreur récupération :", err);
        setError("Impossible de charger les directeurs.");
      });
  };

  useEffect(() => {
    fetchDirecteurs();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;

    fetch(`http://localhost:8081/api/directeurs/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Échec de la suppression");
        fetchDirecteurs();
      })
      .catch((err) => {
        console.error("Erreur suppression :", err);
        setError("Échec de la suppression du directeur.");
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-800">
        <BriefcaseIcon className="w-8 h-8 text-blue-600" />
        Liste des Directeurs
      </h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!showForm && !directeurToEdit && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ➕ Ajouter un directeur
        </button>
      )}

      {showForm && (
        <AjouterDirecteur
          onDirecteurAdded={() => {
            fetchDirecteurs();
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {directeurToEdit && (
        <EditDirecteur
          directeur={directeurToEdit}
          onDirecteurUpdated={() => {
            fetchDirecteurs();
            setDirecteurToEdit(null);
          }}
          onCancel={() => setDirecteurToEdit(null)}
        />
      )}

      <div className="flex flex-wrap gap-6">
        {directeurs.map((d) => (
          <div
            key={d.id}
            className="w-[340px] bg-white border rounded-lg shadow-md p-5 space-y-3"
          >
            <div className="flex items-center gap-3">
              <IdentificationIcon className="w-7 h-7 text-blue-600" />
              <div>
                <p className="text-lg font-semibold text-gray-800">{d.nom}</p>
                <p className="text-lg font-semibold text-gray-800">{d.prenom}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDirecteurToEdit(d)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1.5 rounded font-medium flex items-center gap-2"
              >
                <PencilIcon className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => handleDelete(d.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded font-medium flex items-center gap-2"
              >
                <TrashIcon className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeDirecteurs;
