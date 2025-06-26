import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import ProtectedRoute from './components/ProtectedRoute';
import ChercheurPage from './pages/ChercheurPage';
import AdminPage from './pages/AdminPage';

// Pages publiques
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

import AjouterPublication from "./pages/AjouterPublication";
import ModifierPublication from "./pages/ModifierPublication";
import ListePublication from "./pages/ListePublication";
import AjouterAuteur from "./pages/AjouterAuteur";
import EditAuteur from "./pages/EditAuteur";
import ListeAuteurs from "./pages/ListeAuteurs";
import AjouterChercheur from "./pages/AjouterChercheur";
import EditChercheur from "./pages/EditChercheur";
import ListeChercheurs from "./pages/ListeChercheurs";
import AjouterChapitre from "./pages/AjouterChapitre";
import EditChapitre from "./pages/EditChapitre";
import ListeChapitres from "./pages/ListeChapitres";
import AjouterLivre from "./pages/AjouterLivre";
import EditLivre from "./pages/EditLivre";
import ListeLivres from "./pages/ListeLivres";
import AjouterThese from "./pages/AjouterThese";
import EditThese from "./pages/EditThese";
import ListeTheses from "./pages/ListeTheses";
import AjouterDirecteur from "./pages/AjouterDirecteur";
import EditDirecteur from "./pages/EditDirecteur";
import ListeDirecteurs from "./pages/ListeDirecteurs";

// Espace Chercheur
import DashboardAccueilChercheur from './pages/chercheur/DashboardAccueilChercheur';
import PublicationsChercheur from './pages/chercheur/PublicationsChercheur';
import AjouterPublicationChercheur from './pages/chercheur/AjouterPublicationChercheur';
import ProfilChercheur from './pages/chercheur/ProfilChercheur';

function App() {
  return (
    <Router>
      <Routes>

        {/* Layout Public */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
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

          {/* Nouvelles pages */}
          <Route path="AjouterPublication" element={<AjouterPublication />} />
          <Route path="ModifierPublication" element={<ModifierPublication />} />
          <Route path="ModifierPublication/:id" element={<ModifierPublication />} />
          <Route path="ListePublication" element={<ListePublication />} />
          <Route path="AjouterAuteur" element={<AjouterAuteur />} />
          <Route path="EditAuteur" element={<EditAuteur />} />
          <Route path="ListeAuteurs" element={<ListeAuteurs />} />
          <Route path="AjouterChercheur" element={<AjouterChercheur />} />
          <Route path="EditChercheur" element={<EditChercheur />} />
          <Route path="ListeChercheurs" element={<ListeChercheurs />} />
          <Route path="AjouterChapitre" element={<AjouterChapitre />} />
          <Route path="EditChapitre" element={<EditChapitre />} />
          <Route path="ListeChapitres" element={<ListeChapitres />} />
          <Route path="AjouterLivre" element={<AjouterLivre />} />
          <Route path="EditLivre" element={<EditLivre />} />
          <Route path="ListeLivres" element={<ListeLivres />} />
          <Route path="AjouterThese" element={<AjouterThese />} />
          <Route path="EditThese" element={<EditThese />} />
          <Route path="ListeTheses" element={<ListeTheses />} />
          <Route path="AjouterDirecteur" element={<AjouterDirecteur />} />
          <Route path="EditDirecteur" element={<EditDirecteur />} />
          <Route path="ListeDirecteurs" element={<ListeDirecteurs />} />
        </Route>

        {/* Layout Chercheur */}
        <Route
          path="/chercheur"
          element={
            <ProtectedRoute allowedRoles={['CHERCHEUR', 'ADMIN']}>
              <ChercheurPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardAccueilChercheur />} />
          <Route path="publications" element={<PublicationsChercheur />} />
          <Route path="ajouter-publication" element={<AjouterPublicationChercheur />} />
          <Route path="profil" element={<ProfilChercheur />} />
        </Route>

        {/* Layout Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
