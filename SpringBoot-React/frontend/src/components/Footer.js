import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="relative bg-gray-900 text-white py-12 overflow-hidden">
            {/* Effet lumineux */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 opacity-10 blur-3xl"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

                    {/* Logo ENSAF avec animation lumineuse */}
                    <div className="flex flex-col items-center md:items-start">
                        <div className="relative group">
                            <img
                                src="/images/ensaf-logo.png"
                                alt="Logo ENSAF"
                                className="h-24 w-24 rounded-full shadow-lg transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-white opacity-10 blur-xl group-hover:opacity-20 transition-all duration-500"></div>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">
                            École Nationale des Sciences Appliquées de Fès
                        </p>
                    </div>

                    {/* Liens utiles avec effet néon */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-300">Liens Utiles</h3>
                        <ul className="space-y-2">
                            {["À propos", "Contact", "Politique de confidentialité"].map((text, index) => (
                                <li key={index}>
                                    <a href="#" className="text-gray-400 relative group transition duration-300">
                                        {text}
                                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-500 transition-all duration-500 group-hover:w-full"></span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Coordonnées */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-300">Coordonnées</h3>
                        <p className="text-gray-400">ENSA Fès</p>
                        <p className="text-gray-400">Route d'Imouzzer, Fès, Maroc</p>
                        <p className="text-gray-400">Tél: +212 5 35 60 05 00</p>
                        <p className="text-gray-400">Email: contact@ensaf.ac.ma</p>
                    </div>
                </div>

                {/* Réseaux sociaux avec animation */}
                <div className="mt-10 border-t border-gray-700 pt-6 text-center">
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Suivez-nous</h3>
                    <div className="flex justify-center space-x-6">
                        {[FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube].map((Icon, index) => (
                            <a
                                key={index}
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-400 transition duration-300 group"
                            >
                                <Icon className="text-3xl transform transition duration-500 group-hover:scale-110 group-hover:rotate-6" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Droits d'auteur */}
                <div className="mt-8 text-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} ENSA Fès. Tous droits réservés.</p>
                </div>
            </div >
        </footer >
    );
};

const App = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Autres composants ici */}
            <div className="flex-grow">
                {/* Contenu de la page */}
            </div>

            {/* Footer toujours en bas */}
            <Footer />
        </div>
    );
};

export default App;
