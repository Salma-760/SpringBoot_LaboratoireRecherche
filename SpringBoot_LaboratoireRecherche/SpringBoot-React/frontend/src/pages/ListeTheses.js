import React, { useEffect, useState } from "react";
import AjouterThese from "./AjouterThese";
import EditThese from "./EditThese";

const ListeTheses = () => {
  const [theses, setTheses] = useState([]);
  const [theseToEdit, setTheseToEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTheses = () => {
    fetch("http://localhost:8081/theses")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTheses(data);
        } else {
          console.error("Format de données invalide :", data);
        }
      })
      .catch((err) => console.error("Erreur de chargement :", err));
  };

  useEffect(() => {
    fetchTheses();
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:8081/theses/${id}`, {
      method: "DELETE",
    }).then(() => fetchTheses());
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Liste des thèses</h2>

      {!showForm && !theseToEdit && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Ajouter une thèse
        </button>
      )}

      {showForm && (
        <AjouterThese
          onTheseAdded={() => {
            fetchTheses();
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {theseToEdit && (
        <EditThese
          these={theseToEdit}
          onTheseUpdated={() => {
            fetchTheses();
            setTheseToEdit(null);
          }}
          onCancel={() => setTheseToEdit(null)}
        />
      )}

      <table className="w-full border mt-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Doctorant</th>
            <th className="p-2 border">Titre</th>
            <th className="p-2 border">Spécialité</th>
            <th className="p-2 border">Année Univ.</th>
            <th className="p-2 border">Date soutenance</th>
            <th className="p-2 border">Directeurs</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {theses.map((t) => (
            <tr key={t.id} className="text-center">
              <td className="border p-2">{t.nomDoctorant} {t.prenomDoctorant}</td>
              <td className="border p-2">{t.titreThese}</td>
              <td className="border p-2">{t.specialite}</td>
              <td className="border p-2">{t.anneeUniversitaire}</td>
              <td className="border p-2">{t.dateSoutenance}</td>
              <td className="border p-2">
                {t.directeurs?.map((d) =>
                  `${d?.nom || ""} ${d?.prenom || ""}`
                ).join(", ")}
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => setTheseToEdit(t)}
                  className="bg-yellow-400 px-3 py-1 rounded"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
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

export default ListeTheses;
