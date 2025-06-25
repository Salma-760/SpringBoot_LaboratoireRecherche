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
import Revues from "./pages/Revues";
import Stages from "./pages/Stages";
import AjouterEtudiant from "./pages/AjouterEtudiant";
import AjouterPublication from "./pages/AjouterPublication";
import ModifierPublication from "./pages/ModifierPublication";
import ListePublication from "./pages/ListePublication";
import AjouterAuteur from "./pages/EditAuteur";
import EditAuteur from "./pages/AjouterAuteur";
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
            <Route path="/revues" element={<Revues />} />
            <Route path="/stages" element={<Stages />} />
            <Route path="/AjouterEtudiant" element={<AjouterEtudiant />} />
            <Route path="/AjouterPublication" element={<AjouterPublication />} />
            <Route path="/ListePublication" element={<ListePublication />} />
            <Route path="/ModifierPublication" element={<ModifierPublication />} />
            <Route path="/ModifierPublication/:id" element={<ModifierPublication />} />
            <Route path="/AjouterAuteur" element={<AjouterAuteur />} />
            <Route path="/EditAuteur" element={<EditAuteur />} />
            <Route path="/ListeAuteurs" element={<ListeAuteurs />} />
            <Route path="/AjouterChercheur" element={<AjouterChercheur />} />
            <Route path="/EditChercheur" element={<EditChercheur />} />
            <Route path="/ListeChercheurs" element={<ListeChercheurs/>} />
            <Route path="/AjouterChapitre" element={<AjouterChapitre/>} />
            <Route path="/EditChapitre" element={<EditChapitre/>} />
            <Route path="/ListeChapitres" element={<ListeChapitres/>} />
            <Route path="/AjouterLivre" element={<AjouterLivre/>} />
            <Route path="/EditLivre" element={<EditLivre/>} />
            <Route path="/ListeLivres" element={<ListeLivres/>} />
            <Route path="/AjouterThese" element={<AjouterThese/>} />
            <Route path="/EditThese" element={<EditThese/>} />
            <Route path="/ListeTheses" element={<ListeTheses/>} />
            <Route path="/AjouterDirecteur" element={<AjouterDirecteur/>} />
            <Route path="/EditDirecteur" element={<EditDirecteur/>} />
            <Route path="/ListeDirecteurs" element={<ListeDirecteurs/>} />
          </Routes>
        </div>

        {/* Footer toujours en bas */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
