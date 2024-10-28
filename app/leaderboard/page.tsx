'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../components/Home.module.css'; // Import your CSS file
import defaultBuildings from '../data/defaultBuilding.json'; // Path to defaultBuilding.json

// Define an interface for the simulation results
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

export default function Leaderboard() {
  // Use the interface to type the state
  const [simulationData, setSimulationData] = useState<SimulationResult[]>([]);

  // Function to load simulation data from localStorage
  const loadSimulationData = () => {
    const data = localStorage.getItem('simulationResults') || '[]';
    setSimulationData(JSON.parse(data));
  };

  useEffect(() => {
    loadSimulationData(); // Load data when the component is mounted
  }, []);

  // Function to calculate percent improvement
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
        return `${percentImprovement}%`;
      }
    }

    return 'N/A';
  };

  // Sort the simulation data based on percent improvement
  const sortedSimulationData = simulationData.slice().sort((a, b) => {
    const improvementA = parseFloat(calculatePercentImprovement(a).replace('%', '')) || 0;
    const improvementB = parseFloat(calculatePercentImprovement(b).replace('%', '')) || 0;
    return improvementB - improvementA;
  });

  // Function to clear all simulation results from localStorage and the state
  const clearSimulationData = () => {
    localStorage.removeItem('simulationResults'); // Remove the data from localStorage
    setSimulationData([]); // Clear the state
  };

  return (
    <div className={styles.leaderboardContainer}>
      {/* Go Back button at the top right */}
      <div className={styles.topRightButton}>
        <Link href="/">
          <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
            Go Back
          </button>
        </Link>
      </div>

      {/* Clear button to remove all simulation results */}
      <div className={styles.refreshButton}>
        <button
          onClick={clearSimulationData} // Call the function to clear results
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginBottom: '20px' }}
        >
          Clear Results
        </button>
      </div>

      <div className={styles.centeredTable}>
        <table className={styles.leaderboardTable}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Building Type</th>
              <th>Heating Demand</th>
              <th>Cooling Demand</th>
              <th>Percent Improvement</th>
            </tr>
          </thead>
          <tbody>
            {sortedSimulationData.map((result, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{result.building_type}</td>
                <td>{result.heating_demand || 0}</td>
                <td>{result.cooling_demand || 0}</td>
                <td>{calculatePercentImprovement(result)}</td> {/* Percent improvement logic */}
              </tr>
            ))}
            {sortedSimulationData.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>No simulation results available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
