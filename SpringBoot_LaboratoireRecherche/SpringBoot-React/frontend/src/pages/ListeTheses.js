import React, { useEffect, useState } from "react";
import AjouterThese from "./AjouterThese";
import EditThese from "./EditThese";

const ListeTheses = () => {
  const [theses, setTheses] = useState([]);
  const [theseToEdit, setTheseToEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchTheses = () => {
    fetch("http://localhost:8081/api/theses", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setTheses(data);
          setError(null);
        } else {
          setTheses([]);
          setError("Format de données inattendu");
        }
      })
      .catch((err) => {
        console.error("Erreur chargement thèses :", err);
        setError("Impossible de charger les thèses. Vérifiez la connexion.");
        setTheses([]);
      });
  };

  useEffect(() => {
    fetchTheses();
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:8081/api/theses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la suppression");
        fetchTheses();
      })
      .catch((err) => {
        console.error("Erreur suppression thèse :", err);
        alert("Erreur lors de la suppression.");
      });
  };

  const handleEdit = (these) => {
    setTheseToEdit(these);
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setTheseToEdit(null);
  };

  const renderDirecteur = (d, thesisId, index) => {
    if (typeof d === "object" && d !== null) {
      return (
        <div key={d.id || `${thesisId}-dir-${index}`}>
          {d.nom ?? "?"} {d.prenom ?? "?"}
        </div>
      );
    } else {
      return <div key={`${thesisId}-dir-${index}`}>Inconnu</div>;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Liste des thèses</h2>

      {!theseToEdit && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? "Fermer le formulaire" : "Ajouter une thèse"}
        </button>
      )}

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {showForm && (
        <div className="bg-gray-50 p-4 rounded shadow mb-4">
          <h3 className="text-lg font-semibold mb-2">Ajouter une thèse</h3>
          <AjouterThese
            onTheseAdded={() => {
              fetchTheses();
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {theseToEdit && (
        <EditThese
          these={theseToEdit}
          onTheseUpdated={() => {
            fetchTheses();
            setTheseToEdit(null);
          }}
          onCancel={handleCancelEdit}
        />
      )}

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Doctorant</th>
            <th className="border p-2">Titre</th>
            <th className="border p-2">Spécialité</th>
            <th className="border p-2">Année Univ.</th>
            <th className="border p-2">Date soutenance</th>
            <th className="border p-2">Directeurs</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {theses.map((t, index) => (
            <tr key={t.id || index} className="bg-white text-center">
              <td className="border p-2">{t.nomDoctorant} {t.prenomDoctorant}</td>
              <td className="border p-2">{t.titreThese}</td>
              <td className="border p-2">{t.specialite}</td>
              <td className="border p-2">{t.anneeUniversitaire}</td>
              <td className="border p-2">{t.dateSoutenance}</td>
              <td className="border p-2 text-sm text-left">
                {Array.isArray(t.directeurs) && t.directeurs.length > 0
                  ? t.directeurs.map((d, i) => renderDirecteur(d, t.id, i))
                  : "Aucun"}
              </td>
              <td className="border p-2 flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(t)}
                  className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
