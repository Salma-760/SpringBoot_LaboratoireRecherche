import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

// Fusion des menus
const menuItems = {
  "Actualités": [
    { name: "Toutes les actualités", link: "/actualites" },
    { name: "Tous les événements", link: "/evenements" },
  ],
  "Présentation": [
    { name: "Notre équipe", link: "/equipe" },
    { name: "Notre mission", link: "/missions" },
  ],
  "Recherche": [
    { name: "Projets", link: "/projets" },
    { name: "Publications", link: "/publications" },
  ],
  "Publications": [
    { name: "Articles récents", link: "/articles" },
    { name: "Revues scientifiques", link: "/revues" },
  ],
  "Formation": [
    { name: "Cours en ligne", link: "/cours" },
    { name: "Ateliers", link: "/ateliers" },
    { name: "Ajouter étudiant", link: "/ajouteretudiant" },
  ],
  "Emplois": [
    { name: "Offres d'emploi", link: "/offres" },
    { name: "Stages", link: "/stages" },
  ],
  "Esai": [
    { name: "Crud Publications", link: "/crudpublication" },
    { name: "Liste Publications", link: "/listepublication" },
  ],
};

const menuColors = {
  "Actualités": "bg-[#6C4F99]",
  "Présentation": "bg-[#3F8F3F]",
  "Recherche": "bg-[#4676B2]",
  "Publications": "bg-[#5B3D8C]",
  "Formation": "bg-[#F28C10]",
  "Emplois": "bg-[#3C8DC9]",
  "Esai": "bg-[#8C2E4F]",
};

export default function Barre() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleMouseEnter = (item) => {
    setActiveMenu(item);
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => setActiveMenu(null), 20000);
    setTimeoutId(id);
  };

  const handleClick = (item) => {
    setActiveMenu(activeMenu === item ? null : item);
    if (timeoutId) clearTimeout(timeoutId);
  };

  return (
    <div>
      <nav className="relative w-full bg-gray-800 shadow-lg p-4">
        <ul className="flex justify-center items-center space-x-8 text-lg font-semibold text-white relative">
          <li className="flex-shrink-0">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Accueil"
              onClick={() => setActiveMenu(null)}
            >
              <FaHome size={22} />
            </Link>
          </li>

          {Object.keys(menuItems).map((item) => (
            <li
              key={item}
              className="relative group"
              onMouseEnter={() => handleMouseEnter(item)}
              onClick={() => handleClick(item)}
            >
              <div
                className={`absolute bottom-0 left-0 w-full h-1 transition-all duration-300 ${activeMenu === item ? "opacity-0" : "bg-gray-400"}`}
              ></div>

              <div className="px-4 py-2 cursor-pointer">{item}</div>

              {activeMenu === item && (
                <>
                  <div className={`absolute top-0 left-0 w-full h-1 transition-all duration-300 ${menuColors[item] || "bg-blue-500"}`} />
                  <ul className="absolute left-0 mt-2 w-56 bg-white border border-gray-300 shadow-lg rounded-md overflow-hidden z-10">
                    {menuItems[item].map(({ name, link }, index) => (
                      <li key={`${name}-${index}`} className="hover:bg-gray-200">
                        <Link
                          to={link}
                          className="block px-4 py-2 text-gray-800 hover:text-gray-900"
                        >
                          {name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
