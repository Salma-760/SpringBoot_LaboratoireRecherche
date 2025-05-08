import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Logo from "./components/Logo";
import Footer from "./components/Footer";
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


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Affichage du Logo */}
        <Logo />

        {/* Navbar collée au Logo */}
        <div className="relative z-10">
          <Navbar />
        </div>

        {/* Contenu principal avec flex-grow pour remplir l'espace */}
        <div className="flex-grow">
          <Routes>
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
          </Routes>
        </div>

        {/* Footer toujours en bas */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
