import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bars3Icon,
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  PlusCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

const SidebarAdmin = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [openSections, setOpenSections] = useState({});

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `w-full flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-150 ${
      isActive(path)
        ? "bg-purple-700 text-white"
        : "text-gray-300 hover:bg-purple-600 hover:text-white"
    }`;

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const Section = ({ title, icon, basePath, routes }) => (
    <div>
      <button
        onClick={() => toggleSection(basePath)}
        className="w-full flex items-center justify-between px-4 py-2 rounded-md text-gray-300 hover:bg-purple-600 hover:text-white"
      >
        <span className="flex items-center gap-2">
          {icon}
          {isOpen && <span>{title}</span>}
        </span>
        {isOpen &&
          (openSections[basePath] ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          ))}
      </button>
      {isOpen && openSections[basePath] && (
        <div className="ml-6 mt-2 space-y-1">
          {routes.map(({ path, label, Icon }) => (
            <Link key={path} to={path} className={linkClass(path)}>
              <Icon className="w-5 h-5" />
              {isOpen && <span>{label}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-16"
      } bg-[#1E1E2F] text-white flex flex-col p-4 min-h-screen transition-all duration-300 shadow-lg`}
    >
      {/* Toggle Icon */}
      <div className="flex items-center justify-start mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-purple-500"
        >
          <Bars3Icon className="w-6 h-6 text-purple-500" />
        </button>
      </div>

      {/* Admin Avatar & Info (only if open) */}
      {isOpen && (
        <div className="flex flex-col items-center mb-6">
          <img
            src="/admin_avatar.png"
            alt="Admin Avatar"
            className="rounded-full w-16 h-16 border-2 border-purple-500 shadow-md"
          />
          <h2 className="text-lg font-bold mt-2">Nexx</h2>
          <p className="text-green-400 text-sm">Awesome Admin</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-2 text-sm">
        <Link to="/admin" className={linkClass("/admin")}>
          <HomeIcon className="w-5 h-5" />
          {isOpen && <span>Dashboard</span>}
        </Link>

        <Section
          title="Publications"
          icon={<UserGroupIcon className="w-5 h-5" />}
          basePath="publications"
          routes={[
            { path: "/admin/publications", label: "Liste", Icon: UserGroupIcon },
            { path: "/admin/ajouter-publication", label: "Ajouter", Icon: PlusCircleIcon },
          ]}
        />

        <Section
          title="Auteurs"
          icon={<UserGroupIcon className="w-5 h-5" />}
          basePath="auteurs"
          routes={[
            { path: "/admin/auteurs", label: "Liste", Icon: UserGroupIcon },
            { path: "/admin/ajouter-auteur", label: "Ajouter", Icon: PlusCircleIcon },
          ]}
        />

        <Section
          title="Chercheurs"
          icon={<UserGroupIcon className="w-5 h-5" />}
          basePath="chercheurs"
          routes={[
            { path: "/admin/chercheurs", label: "Liste", Icon: UserGroupIcon },
            { path: "/admin/ajouter-chercheur", label: "Ajouter", Icon: PlusCircleIcon },
          ]}
        />

        <Section
          title="Chapitres"
          icon={<BookOpenIcon className="w-5 h-5" />}
          basePath="chapitres"
          routes={[
            { path: "/admin/chapitres", label: "Liste", Icon: BookOpenIcon },
            { path: "/admin/ajouter-chapitre", label: "Ajouter", Icon: PlusCircleIcon },
          ]}
        />

        <Section
          title="Livres"
          icon={<BookOpenIcon className="w-5 h-5" />}
          basePath="livres"
          routes={[
            { path: "/admin/livres", label: "Liste", Icon: BookOpenIcon },
            { path: "/admin/ajouter-livre", label: "Ajouter", Icon: PlusCircleIcon },
          ]}
        />

        <Section
          title="Thèses"
          icon={<BookOpenIcon className="w-5 h-5" />}
          basePath="theses"
          routes={[
            { path: "/admin/theses", label: "Liste", Icon: BookOpenIcon },
            { path: "/admin/ajouter-these", label: "Ajouter", Icon: PlusCircleIcon },
          ]}
        />

        <Section
          title="Directeurs"
          icon={<UserGroupIcon className="w-5 h-5" />}
          basePath="directeurs"
          routes={[
            { path: "/admin/directeurs", label: "Liste", Icon: UserGroupIcon },
            { path: "/admin/ajouter-directeur", label: "Ajouter", Icon: PlusCircleIcon },
          ]}
        />

        {/* Déconnexion */}
        <button className="mt-10 flex items-center w-full px-4 py-2 text-red-400 hover:text-red-200">
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
          {isOpen && <span>Déconnexion</span>}
        </button>
      </nav>
    </div>
  );
};

export default SidebarAdmin;
