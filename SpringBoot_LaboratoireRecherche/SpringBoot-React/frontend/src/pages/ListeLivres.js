import React, { useEffect, useState } from "react";
import AjouterLivre from "./AjouterLivre";
import EditLivre from "./EditLivre";

const ListeLivres = () => {
  const [livres, setLivres] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [livreToEdit, setLivreToEdit] = useState(null);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem("token");

  const fetchLivres = () => {
    const token = getToken();
    console.log("Chargement livres avec token:", token);
    fetch("http://localhost:8081/api/livres", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => {
        console.log("Réponse fetchLivres:", res);
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Livres reçus:", data);
        setLivres(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Erreur chargement livres:", err);
        setError("Impossible de charger les livres.");
        setLivres([]);
      });
  };

  useEffect(() => {
    fetchLivres();
  }, []);

  const handleDelete = (id) => {
    const token = getToken();
    console.log("Suppression livre id:", id);
    fetch(`http://localhost:8081/api/livres/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => {
        console.log("Réponse suppression:", res);
        if (!res.ok) throw new Error(`Erreur suppression HTTP ${res.status}`);
        fetchLivres();
      })
      .catch((err) => {
        console.error("Erreur suppression :", err);
        alert("Erreur lors de la suppression, voir console.");
      });
  };

  const handleEdit = (livre) => {
    console.log("Edition livre:", livre);
    setLivreToEdit(livre);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📘 Liste des livres</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!showForm && !livreToEdit && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        >
          ➕ Ajouter un livre
        </button>
      )}

      {showForm && (
        <AjouterLivre
          onLivreAdded={() => {
            console.log("Livre ajouté, rechargement...");
            fetchLivres();
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {livreToEdit && (
        <EditLivre
          livre={livreToEdit}
          onLivreUpdated={() => {
            console.log("Livre modifié, rechargement...");
            fetchLivres();
            setLivreToEdit(null);
          }}
          onCancel={() => setLivreToEdit(null)}
        />
      )}

      <table className="w-full mt-6 border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Intitulé</th>
            <th className="p-2 border">ISBN</th>
            <th className="p-2 border">Maison d'édition</th>
            <th className="p-2 border">Année</th>
            <th className="p-2 border">Auteurs</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {livres.map((livre) => (
            <tr key={livre.id} className="border hover:bg-gray-50">
              <td className="p-2 border">{livre.intituleLivre}</td>
              <td className="p-2 border">{livre.isbn}</td>
              <td className="p-2 border">{livre.maisonEdition}</td>
              <td className="p-2 border">{livre.anneeParution}</td>
              <td className="p-2 border">
                {livre.auteursDTO?.map((a) => `${a.nom} ${a.prenom}`).join(", ")}
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(livre)}
                  className="bg-yellow-400 text-black px-2 py-1 rounded mr-2"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(livre.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
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

export default ListeLivres;
