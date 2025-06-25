import React, { useEffect, useState } from "react";
import EditPublication from "./ModifierPublication";
import AjouterPublication from "./AjouterPublication"; // import du formulaire ajout
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

const ListePublications = () => {
  const [publications, setPublications] = useState([]);
  const [auteurs, setAuteurs] = useState([]);
  const [publicationToEdit, setPublicationToEdit] = useState(null);
  const [isAdding, setIsAdding] = useState(false); // état pour afficher ajout

  const fetchPublications = () => {
    fetch("http://localhost:8081/publications")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPublications(data);
        else setPublications([]);
      })
      .catch(err => console.error("Erreur fetchPublications:", err));
  };

  const fetchAuteurs = () => {
    fetch("http://localhost:8081/auteurs")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAuteurs(data);
        else setAuteurs([]);
      })
      .catch(err => console.error("Erreur fetchAuteurs:", err));
  };

  useEffect(() => {
    fetchPublications();
    fetchAuteurs();
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:8081/publications/${id}`, { method: "DELETE" })
      .then(() => setPublications(publications.filter(p => p.id !== id)))
      .catch(err => console.error("Erreur suppression publication:", err));
  };

  // Après sauvegarde ou ajout, refresh la liste et ferme les formulaires
  const handleSave = () => {
    setPublicationToEdit(null);
    setIsAdding(false);
    fetchPublications();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col items-center py-12 px-6">
      <h2 className="text-4xl font-black text-blue-800 mb-6 tracking-tight">Liste des Publications</h2>

     

      {/* Formulaire d'ajout affiché si isAdding = true */}
      {!isAdding && !publicationToEdit && (
  <div className="w-full mb-6 flex justify-start"> {/* Conteneur à gauche */}
    <button
      onClick={() => setIsAdding(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition"
    >
      Ajouter une publication
    </button>
  </div>
)}

      {/* Formulaire de modification */}
      {publicationToEdit && (
        <EditPublication
          publication={publicationToEdit}
          auteursDisponibles={auteurs}
          onCancel={() => setPublicationToEdit(null)}
          onSave={handleSave}
        />
      )}

      {/* Tableau des publications */}
      <table className="min-w-full table-auto text-left text-base text-gray-700 bg-white rounded shadow-md overflow-hidden">
        <thead className="bg-blue-100 text-blue-700">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Titre</th>
            <th className="px-6 py-3">Journal</th>
            <th className="px-6 py-3">Base_Indexation</th>
            <th className="px-6 py-3">Année</th>
            <th className="px-6 py-3">Volume</th>
            <th className="px-6 py-3">Pages</th>
            <th className="px-6 py-3">DOI</th>
            <th className="px-6 py-3">Auteurs</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-200">
          {publications.map(p => (
            <tr key={p.id} className="hover:bg-blue-50 transition">
              <td className="px-6 py-4 font-medium text-gray-900">{p.id}</td>
              <td className="px-6 py-4">{p.titre}</td>
              <td className="px-6 py-4">{p.journal}</td>
              <td className="px-6 py-4">{Array.isArray(p.baseIndexation) ? p.baseIndexation.join(", ") : p.baseIndexation}</td>
              <td className="px-6 py-4">{p.annee}</td>
              <td className="px-6 py-4">{p.volume}</td>
              <td className="px-6 py-4">{p.pages}</td>
              <td className="px-6 py-4">{p.doi}</td>
              <td className="px-6 py-4">{Array.isArray(p.auteurs) ? p.auteurs.map(a => a.nom).join(", ") : ""}</td>
              <td className="px-6 py-4 flex items-center justify-center space-x-2">
                <button
                  onClick={() => setPublicationToEdit(p)}
                  className="bg-blue-400 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md transition-transform hover:scale-105 flex items-center"
                >
                  <PencilSquareIcon className="h-5 w-5 mr-1" /> Modifier
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl shadow-md transition-transform hover:scale-105 flex items-center"
                >
                  <TrashIcon className="h-5 w-5 mr-1" /> Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListePublications;
