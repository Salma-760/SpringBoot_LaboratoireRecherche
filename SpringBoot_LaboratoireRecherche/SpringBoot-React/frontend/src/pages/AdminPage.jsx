import React from "react";
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
};

export default AdminPage;
