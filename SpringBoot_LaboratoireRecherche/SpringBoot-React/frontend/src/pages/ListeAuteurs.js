import React, { useEffect, useState } from "react";
import AuteurForm from "./AjouterAuteur";
import AuteurModifier from "./EditAuteur";
import {
  UserIcon,
  EnvelopeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

const ListeAuteurs = () => {
  const [auteurs, setAuteurs] = useState([]);
  const [auteurToEdit, setAuteurToEdit] = useState(null);
  const [showFormAjout, setShowFormAjout] = useState(false);
  const [error, setError] = useState(null);

  const fetchAuteurs = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8081/api/auteurs", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setAuteurs(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Erreur chargement auteurs :", err);
        setError(
          "Impossible de charger les auteurs. Veuillez vérifier votre connexion ou authentification."
        );
      });
  };

  useEffect(() => {
    fetchAuteurs();
  }, []);

  const deleteAuteur = (id) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8081/api/auteurs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur suppression HTTP ${res.status}`);
        fetchAuteurs();
      })
      .catch((err) => {
        console.error("Erreur suppression :", err);
        alert("Erreur lors de la suppression. Vérifiez les logs.");
      });
  };

  const handleEdit = (auteur) => {
    setAuteurToEdit(auteur);
    setShowFormAjout(false);
  };

  const handleCancelEdit = () => {
    setAuteurToEdit(null);
  };

  const handleAddClick = () => {
    setShowFormAjout(!showFormAjout);
    setAuteurToEdit(null);
  };

  return (
    <div className="p-6">
      <button
        onClick={handleAddClick}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
      >
        {showFormAjout ? "Fermer le formulaire" : "➕ Ajouter un auteur"}
      </button>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {showFormAjout && !auteurToEdit && (
        <AuteurForm
          onAuteurAdded={() => {
            fetchAuteurs();
            setShowFormAjout(false);
          }}
        />
      )}

      {auteurToEdit && (
        <AuteurModifier
          auteur={auteurToEdit}
          onAuteurUpdated={() => {
            fetchAuteurs();
            setAuteurToEdit(null);
          }}
          onCancel={handleCancelEdit}
        />
      )}

      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <UserIcon className="w-8 h-8 text-red-600" />
        Liste des Auteurs
      </h2>

      <div className="flex flex-wrap gap-6">
        {auteurs.map((a) => (
          <div
            key={a.id}
            className="w-[340px] bg-white border rounded-lg shadow-md p-5 space-y-3"
          >
            <div className="flex items-center gap-3">
              <UserIcon className="w-7 h-7 text-red-600" />
              <div>
                <p className="text-lg font-semibold text-gray-800">{a.nom}</p>
                <p className="text-lg font-semibold text-gray-800">{a.prenom}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <EnvelopeIcon className="w-6 h-6 text-gray-600" />
              <p className="text-sm text-gray-700">{a.email}</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleEdit(a)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1.5 rounded font-medium flex items-center gap-2"
              >
                <PencilIcon className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => deleteAuteur(a.id)}
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

export default ListeAuteurs;
