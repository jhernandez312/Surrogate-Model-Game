'use client';

import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import styles from './Home.module.css';
import defaultBuildings from '../data/defaultBuilding.json';
import { Context } from 'chartjs-plugin-datalabels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

interface SimulationResult {
  building_type: string;
  heating_demand?: number | [number, null];
  cooling_demand?: number | [number, null];
}

interface DefaultBuilding {
  X1_Type: string;
  Y1_Heating?: number;
  Y2_Cooling?: number;
}

export default function BarGraph() {
  const [simulationData, setSimulationData] = useState<SimulationResult[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener('change', handleChange);

    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  const loadSimulationData = () => {
    const data = JSON.parse(localStorage.getItem('simulationResults') || '[]');

    // Ensure that heating_demand and cooling_demand are numeric values, not arrays
    const cleanedData = data.map((entry: SimulationResult) => ({
      ...entry,
      heating_demand: Array.isArray(entry.heating_demand) ? entry.heating_demand[0] : entry.heating_demand,
      cooling_demand: Array.isArray(entry.cooling_demand) ? entry.cooling_demand[0] : entry.cooling_demand,
    }));

    setSimulationData(cleanedData);
  };

  useEffect(() => {
    loadSimulationData();
  }, []);

  const calculateHeatingImprovement = (result: SimulationResult): string => {
    const resultHeating = typeof result.heating_demand === 'number' ? result.heating_demand : 0;

    const defaultBuilding = defaultBuildings.find(
      (building: DefaultBuilding) => building.X1_Type === result.building_type
    );

    if (defaultBuilding) {
      const defaultHeating = defaultBuilding.Y1_Heating || 0;

      if (defaultHeating > 0) {
        const improvement = -((defaultHeating - resultHeating) / defaultHeating) * 100;
        return Math.round(improvement).toString();
      }
    }

    return '0';
  };

  const calculateCoolingImprovement = (result: SimulationResult): string => {
    const resultCooling = Number(result.cooling_demand) || 0; // Ensure resultCooling is a number

    const defaultBuilding = defaultBuildings.find(
      (building: DefaultBuilding) => building.X1_Type === result.building_type
    );

    if (defaultBuilding) {
      const defaultCooling = defaultBuilding.Y2_Cooling || 0;

      if (defaultCooling > 0) {
        const improvement = -((defaultCooling - resultCooling) / defaultCooling) * 100;
        return Math.round(improvement).toString();
      }
    }

    return '0';
  };

  const labels = simulationData.map((_result, index) => `Attempt ${index + 1}`);
  const heatingValues = simulationData.map((result) => result.heating_demand || 0);
  const coolingValues = simulationData.map((result) => result.cooling_demand || 0);
  const heatingImprovementValues = simulationData.map((result) => calculateHeatingImprovement(result));
  const coolingImprovementValues = simulationData.map((result) => calculateCoolingImprovement(result));

  const data = {
    labels,
    datasets: [
      {
        label: 'Heating Demand (kWh)',
        data: heatingValues,
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red for heating
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Cooling Demand (kWh)',
        data: coolingValues,
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue for cooling
        borderColor: 'rgba(54, 162, 235, 1)',
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
          color: isDarkMode ? '#ededed' : '#171717',
          boxWidth: 20,
          padding: 15,
        },
      },
      title: {
        display: true,
        text: 'Building Heating and Cooling Demand in kWh',
        color: isDarkMode ? '#ededed' : '#171717',
      },
      datalabels: {
        display: true,
        color: (context: Context) => {
          const improvement =
            context.dataset.label === 'Heating Demand (kWh)'
              ? parseFloat(heatingImprovementValues[context.dataIndex])
              : parseFloat(coolingImprovementValues[context.dataIndex]);
          return improvement < 0 ? 'green' : improvement > 0 ? 'red' : 'black';
        },
        formatter: (value: number, context: Context) => {
          const improvement =
            context.dataset.label === 'Heating Demand (kWh)'
              ? heatingImprovementValues[context.dataIndex]
              : coolingImprovementValues[context.dataIndex];
          return `${improvement}%`;
        },
        anchor: 'end' as const,
        align: 'end' as const,
        offset: -5,
        font: {
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? '#ededed' : '#171717',
        },
        title: {
          display: true,
          text: 'Attempt Number',
          color: isDarkMode ? '#ededed' : '#171717',
        },
        barPercentage: 0.9, // Controls the width of individual bars
        categoryPercentage: 0.5, // Controls the space between groups of bars
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Energy Demand (kWh) / m²',
          color: isDarkMode ? '#ededed' : '#171717',
        },
        ticks: {
          color: isDarkMode ? '#ededed' : '#171717',
        },
      },
    },
  };

  const clearResults = () => {
    localStorage.removeItem('simulationResults');
    setSimulationData([]);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '500vw', // Makes the container height responsive to viewport width
        maxHeight: '300px', // Limits the max height on larger screens
      }}
      className={styles.barGraphContainer}
    >
      <Bar data={data} options={{ ...options, responsive: true, maintainAspectRatio: false }} />
      <button onClick={loadSimulationData} className={styles.refreshButton}>
        <FontAwesomeIcon icon={faSyncAlt} style={{ marginRight: '8px' }} />
        Visualization
      </button>
      <button onClick={clearResults} className={styles.clearButton}>Clear Results</button>
    </div>
  );

}
