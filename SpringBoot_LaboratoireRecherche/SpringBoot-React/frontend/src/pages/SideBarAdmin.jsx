import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  PlusCircleIcon,
  ArrowRightOnRectangleIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline";

const SidebarAdmin = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-150 ${
      isActive(path) ? "bg-purple-700 text-white" : "text-gray-300 hover:bg-purple-600 hover:text-white"
    }`;

  return (
    <div className="w-64 bg-[#1E1E2F] text-white flex flex-col p-6 min-h-screen shadow-lg">
      <div className="flex flex-col items-center mb-10">
        <img
          src="/admin_avatar.png"
          alt="Admin Avatar"
          className="rounded-full w-20 h-20 border-2 border-white shadow"
        />
        <h2 className="text-xl font-bold mt-3">Nexx</h2>
        <p className="text-green-400 text-sm">Awesome Admin</p>
      </div>

      <nav className="flex-1 space-y-2 text-sm">
        <div className="text-xs text-gray-400 uppercase tracking-widest mt-4">Dashboard</div>
        <Link to="/admin" className={linkClass("/admin")}> <HomeIcon className="w-5 h-5" /> Dashboard </Link>

        <div className="text-xs text-gray-400 uppercase tracking-widest mt-6">Publications</div>
        <Link to="/admin/publications" className={linkClass("/admin/publications")}> <UserGroupIcon className="w-5 h-5" /> Liste </Link>
        <Link to="/admin/ajouter-publication" className={linkClass("/admin/ajouter-publication")}> <PlusCircleIcon className="w-5 h-5" /> Ajouter </Link>
        <Link to="/admin/modifier-publication" className={linkClass("/admin/modifier-publication/:id")}> <PencilSquareIcon className="w-5 h-5" /> Modifier </Link>

        <div className="text-xs text-gray-400 uppercase tracking-widest mt-6">Auteurs</div>
        <Link to="/admin/auteurs" className={linkClass("/admin/auteurs")}> <UserGroupIcon className="w-5 h-5" /> Liste </Link>
        <Link to="/admin/ajouter-auteur" className={linkClass("/admin/ajouter-auteur")}> <PlusCircleIcon className="w-5 h-5" /> Ajouter </Link>
        <Link to="/admin/modifier-auteur" className={linkClass("/admin/modifier-auteur")}> <PencilSquareIcon className="w-5 h-5" /> Modifier </Link>

        <div className="text-xs text-gray-400 uppercase tracking-widest mt-6">Chercheurs</div>
        <Link to="/admin/chercheurs" className={linkClass("/admin/chercheurs")}> <UserGroupIcon className="w-5 h-5" /> Liste </Link>
        <Link to="/admin/ajouter-chercheur" className={linkClass("/admin/ajouter-chercheur")}> <PlusCircleIcon className="w-5 h-5" /> Ajouter </Link>
        <Link to="/admin/modifier-chercheur" className={linkClass("/admin/modifier-chercheur")}> <PencilSquareIcon className="w-5 h-5" /> Modifier </Link>

        <div className="text-xs text-gray-400 uppercase tracking-widest mt-6">Chapitres</div>
        <Link to="/admin/chapitres" className={linkClass("/admin/chapitres")}> <BookOpenIcon className="w-5 h-5" /> Liste </Link>
        <Link to="/admin/ajouter-chapitre" className={linkClass("/admin/ajouter-chapitre")}> <PlusCircleIcon className="w-5 h-5" /> Ajouter </Link>
        <Link to="/admin/modifier-chapitre" className={linkClass("/admin/modifier-chapitre")}> <PencilSquareIcon className="w-5 h-5" /> Modifier </Link>

        <div className="text-xs text-gray-400 uppercase tracking-widest mt-6">Livres</div>
        <Link to="/admin/livres" className={linkClass("/admin/livres")}> <BookOpenIcon className="w-5 h-5" /> Liste </Link>
        <Link to="/admin/ajouter-livre" className={linkClass("/admin/ajouter-livre")}> <PlusCircleIcon className="w-5 h-5" /> Ajouter </Link>
        <Link to="/admin/modifier-livre" className={linkClass("/admin/modifier-livre")}> <PencilSquareIcon className="w-5 h-5" /> Modifier </Link>

        <div className="text-xs text-gray-400 uppercase tracking-widest mt-6">Thèses</div>
        <Link to="/admin/theses" className={linkClass("/admin/theses")}> <BookOpenIcon className="w-5 h-5" /> Liste </Link>
        <Link to="/admin/ajouter-these" className={linkClass("/admin/ajouter-these")}> <PlusCircleIcon className="w-5 h-5" /> Ajouter </Link>
        <Link to="/admin/modifier-these" className={linkClass("/admin/modifier-these")}> <PencilSquareIcon className="w-5 h-5" /> Modifier </Link>

        <div className="text-xs text-gray-400 uppercase tracking-widest mt-6">Directeurs</div>
        <Link to="/admin/directeurs" className={linkClass("/admin/directeurs")}> <UserGroupIcon className="w-5 h-5" /> Liste </Link>
        <Link to="/admin/ajouter-directeur" className={linkClass("/admin/ajouter-directeur")}> <PlusCircleIcon className="w-5 h-5" /> Ajouter </Link>
        <Link to="/admin/modifier-directeur" className={linkClass("/admin/modifier-directeur")}> <PencilSquareIcon className="w-5 h-5" /> Modifier </Link>

        <button className="mt-10 flex items-center px-4 py-2 text-red-400 hover:text-red-200">
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" /> Déconnexion
        </button>
      </nav>
    </div>
  );
};

export default SidebarAdmin;
