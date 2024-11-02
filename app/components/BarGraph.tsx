'use client';

import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import styles from './Home.module.css';
import defaultBuildings from '../data/defaultBuilding.json';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

interface SimulationResult {
  building_type: string;
  heating_demand?: number;
  cooling_demand?: number;
}

interface DefaultBuilding {
  X1_Type: string;
  Y1_Heating?: number;
  Y2_Cooling?: number;
}

export default function BarGraph() {
  const [simulationData, setSimulationData] = useState<SimulationResult[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Detect if dark mode is enabled
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener('change', handleChange);

    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  const loadSimulationData = () => {
    const data = localStorage.getItem('simulationResults') || '[]';
    setSimulationData(JSON.parse(data));
  };

  useEffect(() => {
    loadSimulationData();
  }, []);

  const calculateTotalEnergyDemand = (result: SimulationResult): number => {
    const resultHeating = result.heating_demand || 0;
    const resultCooling = result.cooling_demand || 0;
    return resultHeating + resultCooling;
  };

  const calculatePercentImprovement = (result: SimulationResult): string => {
    const resultTotalDemand = calculateTotalEnergyDemand(result);

    const defaultBuilding = defaultBuildings.find(
      (building: DefaultBuilding) => building.X1_Type === result.building_type
    );

    if (defaultBuilding) {
      const defaultHeating = defaultBuilding.Y1_Heating || 0;
      const defaultCooling = defaultBuilding.Y2_Cooling || 0;
      const defaultTotalDemand = defaultHeating + defaultCooling;

      if (defaultTotalDemand > 0) {
        return (((defaultTotalDemand - resultTotalDemand) / defaultTotalDemand) * 100).toFixed(2);
      }
    }
    return '0';
  };

  const labels = simulationData.map((_result, index) => `Attempt ${index + 1}`);
  const dataValues = simulationData.map((result) => calculateTotalEnergyDemand(result));
  const improvementValues = simulationData.map((result) => calculatePercentImprovement(result));

  const data = {
    labels,
    datasets: [
      {
        label: 'Energy Demand (kWh)',
        data: dataValues,
        backgroundColor: dataValues.map((value) => (value < 0 ? 'rgba(255, 99, 132, 0.6)' : 'rgba(75, 192, 192, 0.6)')), // Red for negative, green for positive
        borderColor: dataValues.map((value) => (value < 0 ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)')), // Darker border for each color
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? '#ededed' : '#171717', // Change text color based on theme
        },
      },
      title: {
        display: true,
        text: 'Building Energy Demand in kWh',
        color: isDarkMode ? '#ededed' : '#171717', // Change title color based on theme
      },
      datalabels: {
        display: true,
        color: (context) => {
          const improvement = parseFloat(improvementValues[context.dataIndex]);
          return improvement < 0 ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)'; // Red for negative, green for positive
        },
        formatter: (_value, context) => `${improvementValues[context.dataIndex]}%`, // Display percent improvement
        anchor: 'end',
        align: 'top',
        font: {
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? '#ededed' : '#171717', // Change x-axis ticks color based on theme
        },
        title: {
          display: true,
          text: 'Attempt Number',
          color: isDarkMode ? '#ededed' : '#171717', // Change x-axis title color based on theme
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Energy Demand (kWh)',
          color: isDarkMode ? '#ededed' : '#171717', // Change y-axis title color based on theme
        },
        ticks: {
          color: isDarkMode ? '#ededed' : '#171717', // Change y-axis ticks color based on theme
        },
      },
    },
  };

  return (
    <div className={styles.barGraphContainer}>
      <Bar data={data} options={options} />
    </div>
  );
}
