import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Il faut enregistrer les composants de Chart.js que l'on va utiliser
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ActiviteAnnuelleChart = ({ data }) => {
    // Préparer les données pour le graphique
    // On trie les années pour un affichage chronologique
    const labels = Object.keys(data).sort((a, b) => a - b);
    const chartDataValues = labels.map(year => data[year]);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Nombre de Publications',
                data: chartDataValues,
                backgroundColor: 'rgba(59, 130, 246, 0.5)', // Bleu semi-transparent
                borderColor: 'rgba(59, 130, 246, 1)', // Bleu plein
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: 'Activité Annuelle',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    // S'assurer que les ticks de l'axe Y sont des entiers
                    stepSize: 1,
                }
            }
        }
    };

    return <Bar options={options} data={chartData} />;
};

export default ActiviteAnnuelleChart;