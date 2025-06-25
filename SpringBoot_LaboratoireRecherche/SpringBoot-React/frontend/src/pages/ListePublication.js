import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

const ListePublications = () => {
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/publications")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPublications(data);
        } else {
          console.error("Réponse invalide:", data);
          setPublications([]);
        }
      })
      .catch(err => console.error("Erreur de chargement:", err));
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:8081/publications/${id}`, {
      method: "DELETE"
    }).then(() => setPublications(publications.filter(p => p.id !== id)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center py-12 px-6">
      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 w-full max-w-7xl overflow-x-auto animate-fade-in">
        <h2 className="text-4xl font-black text-center text-blue-800 mb-10 tracking-tight">Liste des Publications</h2>
        <table className="min-w-full table-auto text-left text-base text-gray-700">
          <thead className="bg-blue-100 text-blue-700">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Titre</th>
              <th className="px-6 py-3">Journal</th>
              <th className="px-6 py-3">Base</th>
              <th className="px-6 py-3">Année</th>
              <th className="px-6 py-3">Volume</th>
              <th className="px-6 py-3">Pages</th>
              <th className="px-6 py-3">DOI</th>
              <th className="px-6 py-3">Auteurs</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-200">
            {Array.isArray(publications) && publications.map(p => (
              <tr key={p.id} className="hover:bg-blue-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">{p.id}</td>
                <td className="px-6 py-4">{p.titre}</td>
                <td className="px-6 py-4">{p.journal}</td>
                <td className="px-6 py-4">{p.base_indexation}</td>
                <td className="px-6 py-4">{p.annee_publication}</td>
                <td className="px-6 py-4">{p.volume}</td>
                <td className="px-6 py-4">{p.pages}</td>
                <td className="px-6 py-4">{p.doi}</td>
                <td className="px-6 py-4">{Array.isArray(p.auteurs) ? p.auteurs.map(a => a.nom).join(", ") : ""}</td>
                <td className="px-6 py-4 flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl shadow-md transition-transform hover:scale-105"
                  >
                    <TrashIcon className="h-5 w-5 mr-1" /> Supprimer
                  </button>
                  <Link to={`/ModifierPublication/${p.id}`}>
                    <button className="flex items-center bg-blue-400 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md transition-transform hover:scale-105">
                      <PencilSquareIcon className="h-5 w-5 mr-1" /> Modifier
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListePublications;
