import React, { useEffect, useState } from "react";
import { UserGroupIcon, EnvelopeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const ListeDirecteurs = () => {
  const [directeurs, setDirecteurs] = useState([]);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [directeurToEdit, setDirecteurToEdit] = useState(null);
  const [error, setError] = useState(null);

  const fetchDirecteurs = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8081/api/directeurs", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setDirecteurs(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Erreur chargement directeurs :", err);
        setError("Erreur lors du chargement. Vérifiez votre connexion.");
      });
  };

  useEffect(() => {
    fetchDirecteurs();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const directeur = { nom, prenom };
    fetch("http://localhost:8081/api/directeurs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(directeur),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      })
      .then(() => {
        setNom("");
        setPrenom("");
        fetchDirecteurs();
      })
      .catch((err) => {
        console.error("Erreur ajout directeur :", err);
        alert("Erreur lors de l'ajout.");
      });
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8081/api/directeurs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur suppression");
        fetchDirecteurs();
      })
      .catch((err) => {
        console.error("Erreur suppression :", err);
        alert("Erreur lors de la suppression.");
      });
  };

  return (
    <div className="p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-6 rounded shadow mb-8"
      >
        <h2 className="text-xl font-bold mb-4">Ajouter un directeur</h2>
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Prénom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <div className="flex gap-3">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Ajouter
          </button>
          <button type="reset" className="bg-gray-600 text-white px-4 py-2 rounded">
            Annuler
          </button>
        </div>
      </form>

      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <UserGroupIcon className="w-8 h-8 text-blue-600" />
        Liste des Directeurs
      </h2>

      <div className="flex flex-wrap gap-6">
        {directeurs.map((d) => (
          <div
            key={d.id}
            className="w-[340px] bg-white border rounded-lg shadow-md p-5 space-y-3"
          >
            <div className="flex items-center gap-3">
              <UserGroupIcon className="w-7 h-7 text-blue-600" />
              <div>
                <p className="text-lg font-semibold text-gray-800">{d.nom}</p>
                <p className="text-lg font-semibold text-gray-800">{d.prenom}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => alert("Modifier pas encore implémenté")}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1.5 rounded font-medium flex items-center gap-2"
              >
                <PencilIcon className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => handleDelete(d.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded font-medium flex items-center gap-2"
              >
                <TrashIcon className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeDirecteurs;
