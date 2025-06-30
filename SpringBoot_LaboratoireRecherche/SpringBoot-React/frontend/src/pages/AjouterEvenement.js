import React, { useState } from "react";

const AjouterEvenement = ({ refresh }) => {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [lieu, setLieu] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8081/api/evenements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ titre, description, lieu, dateDebut, dateFin, imageUrl })
    })
      .then(() => {
        refresh();
        setTitre(""); setDescription(""); setLieu(""); setDateDebut(""); setDateFin(""); setImageUrl("");
      })
      .catch(err => console.error("Erreur ajout:", err));
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded shadow mb-4">
      <h2 className="text-lg font-bold mb-2">Ajouter un événement ENSA</h2>
      <input value={titre} onChange={e => setTitre(e.target.value)} placeholder="Titre" className="block w-full my-1 p-2 border" required />
      <input value={lieu} onChange={e => setLieu(e.target.value)} placeholder="Lieu" className="block w-full my-1 p-2 border" required />
      <input type="datetime-local" value={dateDebut} onChange={e => setDateDebut(e.target.value)} className="block w-full my-1 p-2 border" required />
      <input type="datetime-local" value={dateFin} onChange={e => setDateFin(e.target.value)} className="block w-full my-1 p-2 border" required />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="block w-full my-1 p-2 border" required />
      <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="URL de l’image" className="block w-full my-1 p-2 border" />
      <button type="submit" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Ajouter</button>
    </form>
  );
};

export default AjouterEvenement;
