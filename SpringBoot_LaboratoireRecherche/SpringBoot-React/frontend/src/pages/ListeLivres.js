import React, { useEffect, useState } from "react";
import AjouterLivre from "./AjouterLivre";
import ModifierLivre from "./EditLivre";

const ListeLivres = () => {
  const [livres, setLivres] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [livreToEdit, setLivreToEdit] = useState(null); // Pour édition

  const fetchLivres = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8081/api/livres", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => res.json())
      .then((data) => setLivres(data))
      .catch((err) => console.error("Erreur chargement livres :", err));
  };

  useEffect(() => {
    fetchLivres();
  }, []);

  const handleLivreAdded = () => {
    fetchLivres();
    setIsAdding(false);
  };

  const handleLivreDeleted = (id) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8081/api/livres/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then(() => fetchLivres())
      .catch((err) => console.error("Erreur suppression livre :", err));
  };

  const handleLivreUpdated = () => {
    fetchLivres();
    setLivreToEdit(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Liste des Livres</h1>

      {isAdding ? (
        <AjouterLivre
          onLivreAdded={handleLivreAdded}
          onCancel={() => setIsAdding(false)}
        />
      ) : livreToEdit ? (
        <ModifierLivre
          livre={livreToEdit}
          onCancel={() => setLivreToEdit(null)}
          onLivreUpdated={handleLivreUpdated}
        />
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Ajouter un livre
        </button>
      )}

      <div className="mt-6 space-y-4">
        {livres.map((livre) => {
          const auteurs = livre.auteursDTO || [];

          return (
            <div key={livre.id} className="p-4 border rounded bg-white shadow-sm">
              <h2 className="text-lg font-semibold">{livre.intituleLivre}</h2>
              <p><strong>Maison d'édition :</strong> {livre.maisonEdition}</p>
              <p><strong>Année de parution :</strong> {livre.anneeParution}</p>
              <p><strong>ISBN :</strong> {livre.isbn}</p>
              <p><strong>Auteurs :</strong> {auteurs.length > 0
                  ? auteurs.map((a) => `${a.prenom} ${a.nom}`).join(", ")
                  : "Aucun"}</p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setLivreToEdit(livre)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleLivreDeleted(livre.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Supprimer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListeLivres;
