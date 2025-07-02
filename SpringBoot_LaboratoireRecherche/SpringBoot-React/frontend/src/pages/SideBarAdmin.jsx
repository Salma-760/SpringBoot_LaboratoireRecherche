import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Bars3Icon,
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  PlusCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckBadgeIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [openSections, setOpenSections] = useState({});
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetch("/api/utilisateurs/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setAdmin(data))
      .catch((err) => {
        console.error("Erreur de session admin :", err);
        localStorage.clear();
        navigate("/");
      });
  }, [navigate]);

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `w-full flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-150 ${
      isActive(path)
        ? "bg-red-700 text-white"
        : "text-gray-300 hover:bg-red-600 hover:text-white"
    }`;

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const Section = ({ title, icon, basePath, routes }) => (
    <div>
      <button
        onClick={() => toggleSection(basePath)}
        className="w-full flex items-center justify-between px-4 py-2 rounded-md text-gray-300 hover:bg-red-600 hover:text-white"
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
      <div className="flex items-center justify-start mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-red-500"
        >
          <Bars3Icon className="w-6 h-6 text-red-500" />
        </button>
      </div>

      {isOpen && (
        <div className="flex flex-col items-center mb-6">
          <img
            src={`${process.env.PUBLIC_URL}/images/evenements/utilisateur.jpg`}
            className="rounded-full w-16 h-16 border-2 border-red-500 shadow-md"
          />
          <h2 className="text-lg font-bold mt-2">
            {admin ? `${admin.nom}` : "Admin"}
          </h2>
          <p className="text-red-400 text-sm">Administrateur</p>
        </div>
      )}

      <nav className="flex-1 space-y-2 text-sm">
        <Link to="/admin" className={linkClass("/admin")}>
          <HomeIcon className="w-5 h-5" />
          {isOpen && <span>Dashboard</span>}
        </Link>

        <Section
          title="Tâches"
          icon={<BookOpenIcon className="w-5 h-5" />}
          basePath="taches"
          routes={[
            { path: "/admin/publications", label: "Publications", Icon: BookOpenIcon },
            { path: "/admin/chapitres", label: "Chapitres", Icon: BookOpenIcon },
            { path: "/admin/livres", label: "Livres", Icon: BookOpenIcon },
            { path: "/admin/theses", label: "Thèses", Icon: BookOpenIcon },
            { path: "/admin/ListeEvenements", label: "Événements", Icon: CalendarDaysIcon },
            { path: "/admin/valider-publications", label: "Valider", Icon: CheckBadgeIcon },
          ]}
        />

        <Section
          title="Utilisateurs"
          icon={<UserGroupIcon className="w-5 h-5" />}
          basePath="users"
          routes={[
            { path: "/admin/auteurs", label: "Auteurs", Icon: UserGroupIcon },
            { path: "/admin/chercheurs", label: "Chercheurs", Icon: UserGroupIcon },
            { path: "/admin/directeurs", label: "Directeurs", Icon: UserGroupIcon },
          ]}
        />

        <button
          onClick={handleLogout}
          className="mt-10 flex items-center w-full px-4 py-2 text-red-400 hover:text-red-200"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
          {isOpen && <span>Déconnexion</span>}
        </button>
      </nav>
    </div>
  );
};

export default SidebarAdmin;
