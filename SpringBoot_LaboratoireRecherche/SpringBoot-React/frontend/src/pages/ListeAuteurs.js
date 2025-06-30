import React, { useEffect, useState } from "react";
import AuteurForm from "./AjouterAuteur";
import AuteurModifier from "./EditAuteur";

const ListeAuteurs = () => {
  const [auteurs, setAuteurs] = useState([]);
  const [auteurToEdit, setAuteurToEdit] = useState(null);
  const [showFormAjout, setShowFormAjout] = useState(false);
  const [error, setError] = useState(null);

  const fetchAuteurs = () => {
    const token = localStorage.getItem("token"); // ou selon où tu stockes le JWT

    fetch("http://localhost:8081/api/auteurs", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erreur HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Données auteurs reçues :", data);
        setAuteurs(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Erreur chargement auteurs :", err);
        setError("Impossible de charger les auteurs. Veuillez vérifier votre connexion ou authentification.");
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
      <button
        onClick={handleAddClick}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
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
