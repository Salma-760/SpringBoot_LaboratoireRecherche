import React, { useEffect, useState } from "react";
import AuteurForm from "./AjouterAuteur";
import AuteurModifier from "./EditAuteur";

const ListeAuteurs = () => {
  const [auteurs, setAuteurs] = useState([]);
  const [auteurToEdit, setAuteurToEdit] = useState(null);
  const [showFormAjout, setShowFormAjout] = useState(false);

  const fetchAuteurs = () => {
    fetch("http://localhost:8081/api/auteurs")
      .then((res) => res.json())
      .then((data) => setAuteurs(data))
      .catch((err) => console.error("Erreur chargement auteurs :", err));
  };

  useEffect(() => {
    fetchAuteurs();
  }, []);

  const deleteAuteur = (id) => {
    fetch(`http://localhost:8081/api/auteurs/${id}`, {
      method: "DELETE",
    })
      .then(() => fetchAuteurs())
      .catch((err) => console.error("Erreur suppression :", err));
  };

  const handleEdit = (auteur) => {
    setAuteurToEdit(auteur);
    setShowFormAjout(false); // cacher formulaire d'ajout
  };

  const handleCancelEdit = () => {
    setAuteurToEdit(null);
  };

  const handleAddClick = () => {
    setShowFormAjout(!showFormAjout); // toggle
    setAuteurToEdit(null); // annuler modification si en cours
  };

  return (
    <div className="p-4">
      {/* Bouton pour afficher/cacher le formulaire d'ajout */}
      <button
        onClick={handleAddClick}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        {showFormAjout ? "Fermer le formulaire" : "➕ Ajouter un auteur"}
      </button>

      {/* Formulaire d’ajout visible si demandé */}
      {showFormAjout && !auteurToEdit && (
        <AuteurForm
          onAuteurAdded={() => {
            fetchAuteurs();
            setShowFormAjout(false);
          }}
        />
      )}

      {/* Formulaire de modification */}
      {auteurToEdit && (
        <AuteurModifier
          auteur={auteurToEdit}
          onAuteurUpdated={fetchAuteurs}
          onCancel={handleCancelEdit}
        />
      )}

      <h2 className="text-2xl mt-6 mb-3">Liste des auteurs</h2>
      <ul className="space-y-2">
        {auteurs.map((a) => (
          <li
            key={a.id}
            className="flex justify-between items-center bg-white p-3 border rounded shadow"
          >
            <div>
              <strong>{a.nom} {a.prenom}</strong><br />
              {a.email}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(a)}
                className="bg-yellow-400 text-black px-3 py-1 rounded"
              >
                Modifier
              </button>
              <button
                onClick={() => deleteAuteur(a.id)}
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

export default ListeAuteurs;
