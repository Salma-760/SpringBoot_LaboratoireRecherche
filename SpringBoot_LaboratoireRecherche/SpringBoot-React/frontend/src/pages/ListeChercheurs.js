import React, { useEffect, useState } from "react";
import AjouterChercheur from "./AjouterChercheur";
import EditChercheur from "./EditChercheur";
import { UserIcon, EnvelopeIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/solid";

const ListeChercheurs = () => {
  const [chercheurs, setChercheurs] = useState([]);
  const [chercheurToEdit, setChercheurToEdit] = useState(null);
  const [showFormAjout, setShowFormAjout] = useState(false);

  const token = localStorage.getItem("token");

  const fetchChercheurs = () => {
    fetch("http://localhost:8081/api/chercheurs", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur de chargement des chercheurs");
        return res.json();
      })
      .then((data) => setChercheurs(data))
      .catch((err) => console.error("Erreur chargement chercheurs :", err));
  };

  useEffect(() => {
    fetchChercheurs();
  }, []);

  const deleteChercheur = (id) => {
    fetch(`http://localhost:8081/api/chercheurs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then(() => fetchChercheurs())
      .catch((err) => console.error("Erreur suppression :", err));
  };

  const handleEdit = (chercheur) => {
    setChercheurToEdit(chercheur);
    setShowFormAjout(false);
  };

  const handleCancelEdit = () => {
    setChercheurToEdit(null);
  };

  const handleAddClick = () => {
    setShowFormAjout(!showFormAjout);
    setChercheurToEdit(null);
  };

  return (
    <div className="p-6">
      <button
        onClick={handleAddClick}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
      >
        {showFormAjout ? "Fermer le formulaire" : "➕ Ajouter un chercheur"}
      </button>

      {showFormAjout && !chercheurToEdit && (
        <AjouterChercheur
          onChercheurAdded={() => {
            fetchChercheurs();
            setShowFormAjout(false);
          }}
        />
      )}

      {chercheurToEdit && (
        <EditChercheur
          chercheur={chercheurToEdit}
          onChercheurUpdated={() => {
            fetchChercheurs();
            setChercheurToEdit(null);
          }}
          onCancel={handleCancelEdit}
        />
      )}

      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <UserIcon className="w-8 h-8 text-red-600" />
        Liste des Chercheurs
      </h2>

      <div className="flex flex-wrap gap-6">
        {chercheurs.map((c) => (
          <div
            key={c.id}
            className="w-[340px] bg-white border rounded-lg shadow-md p-5 space-y-3"
          >
            <div className="flex items-center gap-3">
              <UserIcon className="w-7 h-7 text-red-600" />
              <div>
                <p className="text-lg font-semibold text-gray-800">{c.nom}</p>
                <p className="text-lg font-semibold text-gray-800">{c.prenom}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <EnvelopeIcon className="w-6 h-6 text-gray-600" />
              <p className="text-sm text-gray-700">{c.email}</p>
            </div>

            <div className="flex items-center gap-2">
              <WrenchScrewdriverIcon className="w-6 h-6 text-teal-600" />
              <p className="text-sm text-gray-700 font-medium">{c.specialite}</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleEdit(c)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1.5 rounded font-medium flex items-center gap-2"
              >
                ✏️ Modifier
              </button>
              <button
                onClick={() => deleteChercheur(c.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded font-medium flex items-center gap-2"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeChercheurs;
