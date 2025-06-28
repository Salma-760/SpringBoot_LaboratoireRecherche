import React from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token"); // supprime le token
        navigate("/"); // redirige vers la page d'accueil ou login
    };

    return (
        <div>
            <h1>Page Admin</h1>
            {/* ... contenu Admin ... */}
            <button onClick={handleLogout} className="btn-logout">
                Déconnexion
            </button>
        </div>
    );
=======
import SidebarAdmin from "./SideBarAdmin"; // à créer
import { Outlet } from "react-router-dom";

const AdminPage = () => {
  return (
    <div className="flex">
      <SidebarAdmin />
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet /> {/* Pour afficher les pages internes */}
      </main>
    </div>
  );
>>>>>>> b5af526d34fc44be4eb472631b6e4dbd4c058764
};

export default AdminPage;
