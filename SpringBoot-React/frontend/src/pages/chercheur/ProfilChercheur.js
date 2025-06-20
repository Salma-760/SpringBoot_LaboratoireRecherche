import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    FiEdit, FiSave, FiXCircle,
    FiUser, FiMail, FiShield, FiAlertTriangle, FiCheckCircle
} from 'react-icons/fi';


const getInitials = (name = '') => {
    const nameParts = name.trim().split(' ');
    if (nameParts.length > 1) {
        return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    }
    // Si un seul mot, prendre les deux premières lettres
    return name.substring(0, 2).toUpperCase();
};

/**
 * Attribue une couleur de fond Tailwind CSS basée sur le nom.
 * Cela garantit qu'un utilisateur a toujours la même couleur.
 */
const avatarColors = [
    'bg-green-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-teal-500',
];

const getColorForName = (name = '') => {
    // Calcule une somme simple à partir des codes des caractères du nom
    const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    // Utilise le modulo pour choisir une couleur dans le tableau
    return avatarColors[charCodeSum % avatarColors.length];
};


//  Composant Avatar réutilisable ---
const Avatar = ({ name, size = 'large' }) => {
    const sizeClasses = {
        large: 'w-16 h-16 text-2xl',
        medium: 'w-12 h-12 text-xl',
        small: 'w-10 h-10 text-base',
    };

    return (
        <div
            className={`
                ${sizeClasses[size]}
                ${getColorForName(name)} 
                rounded-full 
                flex 
                items-center 
                justify-center 
                font-bold 
                text-white
                flex-shrink-0
            `}
        >
            {getInitials(name)}
        </div>
    );
};


// --- Composant ProfilChercheur-

const ProfilChercheur = () => {
    const { chercheur, setChercheur } = useOutletContext();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ nom: '', email: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        if (chercheur) {
            setFormData({
                nom: chercheur.nom || '',
                email: chercheur.email || '',
            });
        }
    }, [chercheur]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch('/api/utilisateurs/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "La mise à jour a échoué.");
            }
            const updatedChercheur = await response.json();
            setChercheur(updatedChercheur);
            setSuccessMessage("Profil mis à jour avec succès !");
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (chercheur) {
            setFormData({ nom: chercheur.nom, email: chercheur.email });
        }
        setError(null);
        setSuccessMessage(null);
    };

    if (!chercheur) {
        return <div className="text-center p-10">Chargement du profil...</div>;
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">

                <div className="flex items-center gap-4">
                    <Avatar name={chercheur.nom} size="medium" />
                    <h2 className="text-3xl font-bold text-gray-800">{chercheur.nom}</h2>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 transition-colors"
                    >
                        <FiEdit /> Modifier
                    </button>
                )}
            </div>

            {successMessage && (
                <div className="flex items-center gap-3 mb-4 p-3 bg-green-100 text-green-800 border border-green-300 rounded-lg">
                    <FiCheckCircle className="h-5 w-5" /> <span>{successMessage}</span>
                </div>
            )}
            {error && (
                <div className="flex items-center gap-3 mb-4 p-3 bg-red-100 text-red-800 border border-red-300 rounded-lg">
                    <FiAlertTriangle className="h-5 w-5" /> <span>{error}</span>
                </div>
            )}

            {!isEditing ? (

                <div className="space-y-6 text-lg text-gray-700">

                    <div className="flex items-center gap-4">
                        <FiUser className="h-6 w-6 text-slate-400 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-500">Nom</p>
                            <p className="font-medium">{chercheur.nom}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <FiMail className="h-6 w-6 text-slate-400 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-500">Email</p>
                            <p>{chercheur.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <FiShield className="h-6 w-6 text-slate-400 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-500">Rôle</p>
                            <p>
                                <span className="px-3 py-1 bg-cyan-100 text-cyan-800 text-sm font-medium rounded-full">
                                    {chercheur.role}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            ) : (

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <FiUser className="h-5 w-5 text-gray-400" />
                            </span>
                            <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Adresse Email</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <FiMail className="h-5 w-5 text-gray-400" />
                            </span>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500" />
                        </div>
                    </div>
                    <div className="flex justify-end items-center gap-4 pt-4 border-t mt-8">
                        <button type="button" onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                            <FiXCircle /> Annuler
                        </button>
                        <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed">
                            <FiSave /> {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ProfilChercheur;