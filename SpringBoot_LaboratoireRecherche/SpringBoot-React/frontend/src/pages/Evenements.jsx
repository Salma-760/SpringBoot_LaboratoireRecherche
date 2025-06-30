import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaChevronRight } from 'react-icons/fa';

const EventSkeleton = () => (
  <div className="flex gap-4 p-4 bg-white rounded-xl shadow-md animate-pulse">
    <div className="flex-shrink-0 w-20 h-20 bg-gray-300 rounded-lg"></div>
    <div className="flex-shrink-0 w-32 h-20 bg-gray-300 rounded-lg hidden sm:block"></div>
    <div className="w-full space-y-3">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

function Evenements() {
  const [evenements, setEvenements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateDebutFiltre, setDateDebutFiltre] = useState('');
  const [titreFiltre, setTitreFiltre] = useState('');

  useEffect(() => {
    const fetchEvenements = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:8081/api/evenements');
        const sortedData = response.data.sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut));
        setEvenements(sortedData);
      } catch (err) {
        setError("Impossible de charger les événements. Veuillez réessayer plus tard.");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchEvenements();
  }, []);

  const filteredEvents = useMemo(() => {
    return evenements.filter(evt => {
      const dateEvt = new Date(evt.dateDebut);
      const debut = dateDebutFiltre ? new Date(dateDebutFiltre) : null;
      const titreOk = titreFiltre.trim() === '' || evt.titre.toLowerCase().includes(titreFiltre.toLowerCase());
      return (!debut || dateEvt >= debut) && titreOk;
    });
  }, [evenements, dateDebutFiltre, titreFiltre]);

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const upcoming = filteredEvents.filter(evt => new Date(evt.dateDebut) >= now);
    const past = filteredEvents.filter(evt => new Date(evt.dateDebut) < now);
    upcoming.sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut));
    return { upcomingEvents: upcoming, pastEvents: past };
  }, [filteredEvents]);

  const EventCard = ({ evt, isUpcoming = false }) => {
    const month = new Date(evt.dateDebut).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase();
    const day = new Date(evt.dateDebut).getDate();

    return (
      <Link to={`/evenement/${evt.id}`} className="group block">
        <article className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition">
          <div className={`w-20 text-center rounded-lg p-2 ${isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
            <p className="font-bold text-sm">{month}</p>
            <p className="font-extrabold text-4xl">{day}</p>
          </div>
          <div className="w-full sm:w-32 h-20 hidden sm:block">
            <img
              src={evt.imageUrl || 'https://via.placeholder.com/150x100?text=Evt'}
              alt={evt.titre}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <div className="flex-grow">
            <h2 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{evt.titre}</h2>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{evt.description}</p>
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <FaMapMarkerAlt className="mr-2" />
              <span>{evt.lieu}</span>
            </div>
          </div>
          <FaChevronRight className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition" />
        </article>
      </Link>
    );
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">Agenda du Laboratoire</h1>
          <p className="text-lg text-gray-600 mt-2">Participez à nos conférences, séminaires et soutenances.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <input
            type="date"
            value={dateDebutFiltre}
            onChange={e => setDateDebutFiltre(e.target.value)}
            className="border px-3 py-2 rounded-md shadow-sm"
          />
          <input
            type="text"
            placeholder="Mot-clé dans le titre"
            value={titreFiltre}
            onChange={e => setTitreFiltre(e.target.value)}
            className="border px-3 py-2 rounded-md shadow-sm"
          />
        </div>

        {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-md mb-8">{error}</p>}

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="space-y-6">
              <EventSkeleton />
              <EventSkeleton />
              <EventSkeleton />
            </div>
          ) : (
            <>
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-green-500 pl-4">À Venir</h2>
                <div className="space-y-6">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map(evt => <EventCard key={evt.id} evt={evt} isUpcoming={true} />)
                  ) : (
                    <div className="bg-white text-center p-8 rounded-lg shadow-sm">
                      <p className="text-gray-500">Aucun événement programmé pour le moment.</p>
                    </div>
                  )}
                </div>
              </section>

              <section className="mt-16">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-gray-400 pl-4">Événements Passés</h2>
                <div className="space-y-6">
                  {pastEvents.length > 0 ? (
                    pastEvents.map(evt => <EventCard key={evt.id} evt={evt} />)
                  ) : (
                    <div className="bg-white text-center p-8 rounded-lg shadow-sm">
                      <p className="text-gray-500">Aucun événement passé à afficher.</p>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Evenements;
