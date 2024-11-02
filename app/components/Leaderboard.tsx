'use client';

import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import defaultBuildings from '../data/defaultBuilding.json';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  const loadSimulationData = () => {
    const data = localStorage.getItem('simulationResults') || '[]';
    setSimulationData(JSON.parse(data));
  };

  useEffect(() => {
    loadSimulationData();
  }, []);

  const calculatePercentImprovement = (result: SimulationResult): string => {
    const resultHeating = result.heating_demand || 0;
    const resultCooling = result.cooling_demand || 0;
    const resultTotalDemand = resultHeating + resultCooling;

    const defaultBuilding = defaultBuildings.find(
      (building: DefaultBuilding) => building.X1_Type === result.building_type
    );

    if (defaultBuilding) {
      const defaultHeating = defaultBuilding.Y1_Heating || 0;
      const defaultCooling = defaultBuilding.Y2_Cooling || 0;
      const defaultTotalDemand = defaultHeating + defaultCooling;

      if (defaultTotalDemand > 0) {
        const percentImprovement = (((defaultTotalDemand - resultTotalDemand) / defaultTotalDemand) * 100).toFixed(2);
        return percentImprovement;
      }
    }

    return '0';
  };

  const labels = simulationData.map((result) => result.building_type);
  const data = {
    labels,
    datasets: [
      {
        label: 'Percent Improvement',
        data: simulationData.map((result) => parseFloat(calculatePercentImprovement(result))),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Building Energy Efficiency Improvements',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Percent Improvement (%)',
        },
      },
    },
  };

  return (
    <div style={{ width: '90%', height: '500px', margin: '20px auto' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
