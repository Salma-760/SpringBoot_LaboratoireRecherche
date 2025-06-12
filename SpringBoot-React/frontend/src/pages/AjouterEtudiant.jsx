// AjouterEtudiant.jsx
import React, { useState } from "react";

const AjouterEtudiant = () => {
  const [etudiant, setEtudiant] = useState({ nom: "", email: "" });

  const handleChange = (e) => {
    setEtudiant({ ...etudiant, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8081/etudiants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(etudiant),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Étudiant ajouté avec succès !");
        console.log(data);
      })
      .catch((error) => {
        console.error("Erreur :", error);
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Ajouter un étudiant</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={etudiant.nom}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={etudiant.email}
          onChange={handleChange}
          required
        />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default AjouterEtudiant;
