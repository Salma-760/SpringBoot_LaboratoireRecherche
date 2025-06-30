import React, { useEffect, useState } from "react";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import AjouterPublication from "./AjouterPublication";
import EditPublication from "./ModifierPublication";

const ListePublications = () => {
  const [publications, setPublications] = useState([]);
  const [auteurs, setAuteurs] = useState([]);
  const [publicationToEdit, setPublicationToEdit] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const token = localStorage.getItem("token");

  const fetchPublications = () => {
    fetch("http://localhost:8081/api/publications", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur HTTP " + res.status);
        return res.json();
      })
      .then(data => Array.isArray(data) ? setPublications(data) : setPublications([]))
      .catch(err => console.error("Erreur fetchPublications:", err.message));
  };

  const fetchAuteurs = () => {
    fetch("http://localhost:8081/api/auteurs", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur HTTP " + res.status);
        return res.json();
      })
      .then(data => Array.isArray(data) ? setAuteurs(data) : setAuteurs([]))
      .catch(err => console.error("Erreur fetchAuteurs:", err.message));
  };

  useEffect(() => {
    fetchPublications();
    fetchAuteurs();
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:8081/api/publications/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(() => setPublications(publications.filter(p => p.id !== id)))
      .catch(err => console.error("Erreur suppression:", err.message));
  };

  const handleSave = () => {
    setPublicationToEdit(null);
    setIsAdding(false);
    fetchPublications();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Liste des Publications</h2>
          {!isAdding && !publicationToEdit && (
            <button
              onClick={() => setIsAdding(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow"
            >
              Ajouter une publication
            </button>
          )}
        </div>

        {isAdding && (
          <AjouterPublication
            auteursDisponibles={auteurs}
            onCancel={() => setIsAdding(false)}
            onSave={handleSave}
          />
        )}

        {publicationToEdit && (
          <EditPublication
            publication={publicationToEdit}
            auteursDisponibles={auteurs}
            onCancel={() => setPublicationToEdit(null)}
            onSave={handleSave}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publications.map(pub => (
            <div key={pub.id} className="bg-white rounded-xl shadow-lg p-6 space-y-2 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-blue-700">{pub.titre}</h3>
              <p><span className="font-semibold">Journal:</span> {pub.journal}</p>
              <p><span className="font-semibold">Indexation:</span> {pub.baseIndexation}</p>
              <p><span className="font-semibold">Année:</span> {pub.annee}</p>
              <p><span className="font-semibold">Volume:</span> {pub.volume} | <span className="font-semibold">Pages:</span> {pub.pages}</p>
              <p><span className="font-semibold">DOI:</span> {pub.doi}</p>
              <p><span className="font-semibold">Résumé:</span> {pub.resume}</p>
              <p><span className="font-semibold">Statut:</span> {pub.statut}</p>
              <p>
  <span className="font-semibold">Auteurs:</span>{" "}
  {Array.isArray(pub.auteurs) ? pub.auteurs.map(a => `${a.prenom} ${a.nom}`).join(", ") : ""}
</p>


              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setPublicationToEdit(pub)}
                  className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  <PencilSquareIcon className="w-4 h-4 mr-1" />
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(pub.id)}
                  className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListePublications;
