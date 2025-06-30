import React, { useEffect, useState } from "react";
import AjouterChapitre from "./AjouterChapitre";
import EditChapitre from "./EditChapitre";

const ListeChapitres = () => {
  const [chapitres, setChapitres] = useState([]);
  const [chapitreToEdit, setChapitreToEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  const fetchChapitres = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8081/api/chapitres", {
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
        console.log("✅ Données reçues des chapitres :", data); // 🔍 log global
        if (Array.isArray(data)) {
          data.forEach((chap, index) => {
            console.log(`➡️ Chapitre ${index + 1} :`, chap);
            console.log(`   Auteurs :`, chap.auteurs); // 🔍 log des auteurs
          });
          setChapitres(data);
          setError(null);
        } else {
          setChapitres([]);
          setError("Format de données inattendu");
        }
      })
      .catch((err) => {
        console.error("❌ Erreur lors de la récupération des chapitres :", err);
        setError("Impossible de charger les chapitres. Vérifiez votre connexion ou authentification.");
        setChapitres([]);
      });
  };

  useEffect(() => {
    fetchChapitres();
  }, []);

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8081/api/chapitres/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erreur HTTP suppression ${res.status}`);
        }
        fetchChapitres();
      })
      .catch((err) => {
        alert("Erreur lors de la suppression, voir la console.");
        console.error("❌ Erreur suppression chapitre :", err);
      });
  };

  const handleEdit = (chapitre) => {
    setChapitreToEdit(chapitre);
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setChapitreToEdit(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Liste des chapitres</h2>

      {!chapitreToEdit && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? "Fermer le formulaire" : "Ajouter un chapitre"}
        </button>
      )}

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {showForm && (
        <div className="bg-gray-50 p-4 rounded shadow mb-4">
          <h3 className="text-lg font-semibold mb-2">Ajouter un chapitre</h3>
          <AjouterChapitre
            onChapitreAdded={() => {
              fetchChapitres();
              setShowForm(false);
            }}
          />
        </div>
      )}

      {chapitreToEdit && (
        <EditChapitre
          chapitre={chapitreToEdit}
          onChapitreUpdated={() => {
            fetchChapitres();
            setChapitreToEdit(null);
          }}
          onCancel={handleCancelEdit}
        />
      )}

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Intitulé</th>
            <th className="border p-2">Livre (ISBN)</th>
            <th className="border p-2">Maison / Année</th>
            <th className="border p-2">Pages</th>
            <th className="border p-2">Auteurs</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {chapitres.map((c, index) => (
            <tr key={c.id || index} className="bg-white">
              <td className="border p-2">{c.intituleChapitre || ""}</td>
              <td className="border p-2">
                {c.titreLivre || ""} ({c.isbn || ""})
              </td>
              <td className="border p-2">
                {c.maisonEdition || ""} - {c.anneePublication || ""}
              </td>
              <td className="border p-2">
                {c.pageDebut || 0} à {c.pageFin || 0}
              </td>
              <td className="border p-2 text-sm">
                {/* 🔍 log individuel si nécessaire */}
                {Array.isArray(c.auteurs) && c.auteurs.length > 0
                  ? c.auteurs.map((a, i) =>
                      a ? `${a.nom || ""} ${a.prenom || ""}` : "Auteur inconnu"
                    ).join(", ")
                  : "Aucun auteur"}
              </td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
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

export default ListeChapitres;
