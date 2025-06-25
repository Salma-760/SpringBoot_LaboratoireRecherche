import React, { useEffect, useState } from "react";
import AjouterDirecteur from "./AjouterDirecteur";
import EditDirecteur from "./EditDirecteur";

const ListeDirecteurs = () => {
  const [directeurs, setDirecteurs] = useState([]);
  const [directeurToEdit, setDirecteurToEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchDirecteurs = () => {
    fetch("http://localhost:8081/directeurs")
      .then((res) => res.json())
      .then((data) => setDirecteurs(data));
  };

  useEffect(() => {
    fetchDirecteurs();
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:8081/directeurs/${id}`, {
      method: "DELETE",
    }).then(() => fetchDirecteurs());
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Liste des directeurs</h2>
      {!showForm && !directeurToEdit && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Ajouter un directeur
        </button>
      )}

      {showForm && (
        <AjouterDirecteur
          onDirecteurAdded={() => {
            fetchDirecteurs();
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {directeurToEdit && (
        <EditDirecteur
          directeur={directeurToEdit}
          onDirecteurUpdated={() => {
            fetchDirecteurs();
            setDirecteurToEdit(null);
          }}
          onCancel={() => setDirecteurToEdit(null)}
        />
      )}

      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Prénom</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {directeurs.map((d) => (
            <tr key={d.id} className="text-center">
              <td className="border p-2">{d.nom}</td>
              <td className="border p-2">{d.prenom}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => setDirecteurToEdit(d)}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >Modifier</button>
                <button
                  onClick={() => handleDelete(d.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListeDirecteurs;