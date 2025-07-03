import React, { useEffect, useState } from "react";

const ListePublicationPubliques = () => {
  const [publications, setPublications] = useState([]);

  const fetchPublications = () => {
    fetch("http://localhost:8081/api/publications")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur HTTP " + res.status);
        return res.json();
      })
      .then((data) => (Array.isArray(data) ? setPublications(data) : setPublications([])))
      .catch((err) => console.error("Erreur fetchPublications:", err.message));
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Liste des Publications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publications.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">
              Aucune publication trouvée.
            </p>
          )}

          {publications.map((pub) => (
            <div
              key={pub.id}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col hover:shadow-xl transition h-full"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-blue-700">{pub.titre}</h3>
                <p><span className="font-semibold">Journal:</span> {pub.journal || "-"}</p>
                <p><span className="font-semibold">Indexation:</span> {Array.isArray(pub.baseIndexation) ? pub.baseIndexation.join(", ") : pub.baseIndexation || "-"}</p>
                <p><span className="font-semibold">Année:</span> {pub.annee || "-"}</p>
                <p><span className="font-semibold">Volume:</span> {pub.volume || "-"} | <span className="font-semibold">Pages:</span> {pub.pages || "-"}</p>
                <p><span className="font-semibold">DOI:</span> {pub.doi || "-"}</p>
                <p><span className="font-semibold">Résumé:</span> {pub.resume || "-"}</p>
                <p><span className="font-semibold">Statut:</span> {pub.statut || "-"}</p>
                <p><span className="font-semibold">Auteurs:</span> {Array.isArray(pub.auteurs) ? pub.auteurs.map((a) => `${a.prenom} ${a.nom}`).join(", ") : "-"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListePublicationPubliques;
