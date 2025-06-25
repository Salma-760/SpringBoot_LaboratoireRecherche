import { useState, useEffect } from "react";

const menuItems = {
  "Actualités": [
    { name: "Tous les événements", link: "/pages/Evenements" },
    { name: "Toutes les actualités", link: "/pages/Actualités" },
  ],
  "Présentation": [
    { name: "Notre équipe", link: "/pages/Equipe" },
    { name: "Notre mission", link: "/pages/Missions" },
  ],
  "Recherche": [
    { name: "Projets", link: "/pages/Projets" },
    { name: "Publications", link: "/pages/Publications" },
  ],
  "Publications": [
    { name: "Articles récents", link: "/pages/Articles" },
    { name: "Revues scientifiques", link: "/pages/Revues" },
  ],
  "Formation": [
    { name: "Cours en ligne", link: "/pages/Cours" },
    { name: "Ateliers", link: "/pages/Ateliers" },
    { name: "Ateliers", link: "/pages/ajouter-etudiant" },
  ],
  "Emplois": [
    { name: "Offres d'emploi", link: "/pages/Offres" },
    { name: "Stages", link: "/pages/Stages" },
  ],
   "Esai": [
    { name: "Offres d'emploi", link: "/pages/CrudPublication" },
    { name: "Stages", link: "/pages/ListePublication" },
  ],
};

const menuColors = {
  "Actualités": "bg-[#6C4F99]",
  "Présentation": "bg-[#3F8F3F]",
  "Recherche": "bg-[#4676B2]",
  "Publications": "bg-[#5B3D8C]",
  "Formation": "bg-[#F28C10]",
  "Emplois": "bg-[#3C8DC9]",
};

export default function Barre() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  // Fonction pour ouvrir un menu et réinitialiser le timer
  const handleMouseEnter = (item) => {
    setActiveMenu(item);

    // Annule le timer précédent si la souris revient
    if (timeoutId) clearTimeout(timeoutId);

    // Lance un nouveau timer pour masquer le menu après 20 secondes
    const id = setTimeout(() => {
      setActiveMenu(null);
    }, 10);

    setTimeoutId(id);
  };

  // Fonction pour fermer le menu immédiatement
  const handleClick = (item) => {
    setActiveMenu(activeMenu === item ? null : item);
    if (timeoutId) clearTimeout(timeoutId);
  };

  return (
   <div>
    <nav div className="relative w-full bg-gray-800 shadow-lg p-4">

      
        <ul className="flex justify-center space-x-8 text-lg font-semibold text-white relative">
          {Object.keys(menuItems).map((item) => (
            <li
              key={item}
              className="relative group"
              onMouseEnter={() => handleMouseEnter(item)}
              onClick={() => handleClick(item)}
            >
              {/* Ligne statique en bas */}
              <div
                className={`absolute bottom-0 left-0 w-full h-1 transition-all duration-300 ${activeMenu === item ? "opacity-0" : "bg-gray-400"
                  }`}
              ></div>

              {/* Élément principal cliquable */}
              <div className="px-4 py-2 cursor-pointer">{item}</div>

              {/* Ligne dynamique qui apparaît en haut */}
              {activeMenu === item && (
                <div
                  className={`absolute top-0 left-0 w-full h-1 transition-all duration-300 ${menuColors[item]}`}
                ></div>
              )}

              {/* Liste déroulante */}
              {activeMenu === item && (
                <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-md overflow-hidden z-10">
                  {menuItems[item].map(({ name, link }) => (
                    <li key={name} className="hover:bg-gray-200">
                      <a
                        href={link}
                        className="block px-4 py-2 text-gray-800 hover:text-gray-900"
                      >
                        {name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
