import React, { useEffect, useState } from "react";
import AjouterChercheur from "./AjouterChercheur";
import EditChercheur from "./EditChercheur";

const ListeChercheurs = () => {
  const [chercheurs, setChercheurs] = useState([]);
  const [chercheurToEdit, setChercheurToEdit] = useState(null);
  const [showFormAjout, setShowFormAjout] = useState(false);

  const fetchChercheurs = () => {
    fetch("http://localhost:8081/chercheurs")
      .then((res) => res.json())
      .then((data) => setChercheurs(data))
      .catch((err) => console.error("Erreur chargement chercheurs :", err));
  };

  useEffect(() => {
    fetchChercheurs();
  }, []);

  const deleteChercheur = (id) => {
    fetch(`http://localhost:8081/chercheurs/${id}`, {
      method: "DELETE",
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
    <div className="p-4">
      <button
        onClick={handleAddClick}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
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

      <h2 className="text-2xl mt-6 mb-3">Liste des chercheurs</h2>
      <ul className="space-y-2">
        {chercheurs.map((c) => (
          <li
            key={c.id}
            className="flex justify-between items-center bg-white p-3 border rounded shadow"
          >
            <div>
              <strong>{c.nom} {c.prenom}</strong><br />
              {c.email} | {c.specialite}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(c)}
                className="bg-yellow-400 text-black px-3 py-1 rounded"
              >
                Modifier
              </button>
              <button
                onClick={() => deleteChercheur(c.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListeChercheurs;