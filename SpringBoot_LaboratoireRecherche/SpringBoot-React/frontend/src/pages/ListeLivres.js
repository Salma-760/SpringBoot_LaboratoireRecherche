import React, { useEffect, useState } from "react";
import AjouterLivre from "./AjouterLivre";
import ModifierLivre from "./EditLivre";

const ListeLivres = () => {
  const [livres, setLivres] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [livreToEdit, setLivreToEdit] = useState(null);

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
      {/* 👉 Formulaire Ajouter ou Modifier */}
      {isAdding && (
        <div className="bg-blue-50 p-4 rounded shadow mb-6">
          <AjouterLivre
            onLivreAdded={handleLivreAdded}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      )}

      {livreToEdit && (
        <div className="bg-yellow-50 p-4 rounded shadow mb-6">
          <ModifierLivre
            livre={livreToEdit}
            onCancel={() => setLivreToEdit(null)}
            onLivreUpdated={handleLivreUpdated}
          />
        </div>
      )}

      {/* 👉 Bouton ajouter (si aucun formulaire affiché) */}
      {!isAdding && !livreToEdit && (
        <button
          onClick={() => setIsAdding(true)}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ajouter un livre
        </button>
      )}

      {/* ✅ Titre placé après formulaire */}
      <h1 className="text-2xl font-bold mb-4">Liste des Livres</h1>

      {/* 📚 Liste des livres */}
      <div className="space-y-4">
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
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleLivreDeleted(livre.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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
