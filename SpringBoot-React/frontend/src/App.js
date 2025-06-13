import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import des composants de la structure de la page
import Navbar from "./components/NavBar";
import Logo from "./components/Logo";
import Footer from "./components/Footer";
import ProtectedRoute from './components/ProtectedRoute'; // Import de la route protégée

// Import des pages publiques
import Home from "./pages/Home";
import About from "./pages/About";
import Actualites from "./pages/Actualités";
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

// Import des pages protégées
import AdminPage from './pages/AdminPage';
import ChercheurPage from './pages/ChercheurPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Le composant Logo contient la logique de connexion */}
        <Logo />

        {/* La barre de navigation */}
        <div className="relative z-10">
          <Navbar />
        </div>

        {/* Le contenu principal de la page */}
        <main className="flex-grow">
          <Routes>
            {/* --- Routes Publiques --- */}
            {/* Tout le monde peut accéder à ces pages */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/actualites" element={<Actualites />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/ateliers" element={<Ateliers />} />
            <Route path="/cours" element={<Cours />} />
            <Route path="/equipe" element={<Equipe />} />
            <Route path="/evenements" element={<Evenements />} />
            <Route path="/missions" element={<Missions />} />
            <Route path="/offres" element={<Offres />} />
            <Route path="/projets" element={<Projets />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/revues" element={<Revues />} />
            <Route path="/stages" element={<Stages />} />
            <Route path="/AjouterEtudiant" element={<AjouterEtudiant />} />

            {/* --- Routes Protégées --- */}
            {/* Seuls les utilisateurs avec les bons rôles peuvent accéder à ces pages */}

            {/* Route pour la page Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            {/* Route pour la page Chercheur */}
            <Route
              path="/chercheur"
              element={
                <ProtectedRoute allowedRoles={['CHERCHEUR', 'ADMIN']}>
                  <ChercheurPage />
                </ProtectedRoute>
              }
            />

            {/* Vous pouvez ajouter une page "Non autorisé" ou une page 404 si vous le souhaitez */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </main>

        {/* Le pied de page */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;