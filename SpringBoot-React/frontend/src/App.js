import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// --- LAYOUTS ---
// Un layout est un composant qui contient un <Outlet /> pour afficher les routes enfants.
import PublicLayout from "./layouts/PublicLayout";
import ChercheurPage from './pages/ChercheurPage';
import AdminPage from './pages/AdminPage';

// --- COMPOSANTS DE PROTECTION ---
import ProtectedRoute from './components/ProtectedRoute';

// --- PAGES PUBLIQUES ---
import Home from "./pages/Home";
import About from "./pages/About";
import Actualites from "./pages/Actualites";
import ActualiteDetail from "./pages/ActualiteDetail";
import Articles from "./pages/Articles";
import Ateliers from "./pages/Ateliers";
import Cours from "./pages/Cours";
import Equipe from "./pages/Equipe";
import Evenements from "./pages/Evenements";
import Missions from "./pages/Missions";
import Offres from "./pages/Offres";
import Projets from "./pages/Projets";
import Publications from "./pages/Publications";
import Revues from "./pages/Revues";
import Stages from "./pages/Stages";
import AjouterEtudiant from "./pages/AjouterEtudiant";

// --- PAGES DE L'ESPACE CHERCHEUR (qui seront affichées dans l'Outlet de ChercheurPage) ---
import DashboardAccueilChercheur from './pages/chercheur/DashboardAccueilChercheur';
import PublicationsChercheur from './pages/chercheur/PublicationsChercheur';
import AjouterPublicationChercheur from './pages/chercheur/AjouterPublicationChercheur';
import ProfilChercheur from './pages/chercheur/ProfilChercheur';


function App() {
  return (
    <Router>
      <Routes>


        {/* =============== GROUPE 1 : LES ROUTES PUBLIQUES =============== */}
        {/* Toutes les routes ici utiliseront PublicLayout comme structure  */}
        {/* (avec Logo, Navbar publique, et Footer).                   */}
        <Route path="/" element={<PublicLayout />}>

          {/* La route "index" est la page par défaut pour "/" */}
          <Route index element={<Home />} />

          {/* Les autres routes publiques sont des enfants du layout */}
          <Route path="about" element={<About />} />
          <Route path="actualites" element={<Actualites />} />
          <Route path="actualite/:id" element={<ActualiteDetail />} />
          <Route path="articles" element={<Articles />} />
          <Route path="ateliers" element={<Ateliers />} />
          <Route path="cours" element={<Cours />} />
          <Route path="equipe" element={<Equipe />} />
          <Route path="evenements" element={<Evenements />} />
          <Route path="missions" element={<Missions />} />
          <Route path="offres" element={<Offres />} />
          <Route path="projets" element={<Projets />} />
          <Route path="publications" element={<Publications />} />
          <Route path="revues" element={<Revues />} />
          <Route path="stages" element={<Stages />} />
          <Route path="AjouterEtudiant" element={<AjouterEtudiant />} />
        </Route>


        {/* ============= GROUPE 2 : LES ROUTES DU CHERCHEUR ============== */}
        {/* La route parente "/chercheur" est protégée et définit le layout ChercheurPage. */}
        <Route
          path="/chercheur"
          element={
            <ProtectedRoute allowedRoles={['CHERCHEUR', 'ADMIN']}>
              <ChercheurPage />
            </ProtectedRoute>
          }
        >
          {/* Ces routes enfants seront rendues dans l'<Outlet /> de ChercheurPage */}
          <Route index element={<DashboardAccueilChercheur />} />
          <Route path="publications" element={<PublicationsChercheur />} />
          <Route path="ajouter-publication" element={<AjouterPublicationChercheur />} />
          <Route path="profil" element={<ProfilChercheur />} />
        </Route>


        {/* =============================================================== */}
        {/* ============== GROUPE 3 : LES ROUTES DE L'ADMIN =============== */}
        {/* =============================================================== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminPage />
            </ProtectedRoute>
          }
        >
        </Route>

      </Routes>
    </Router>
  );
}

export default App;