'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Home.module.css'; // You can create a separate CSS file for the leaderboard if needed
import defaultBuildings from '../data/defaultBuilding.json';

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
        return `${percentImprovement}%`;
      }
    }

    return 'N/A';
  };

  const sortedSimulationData = simulationData.slice().sort((a, b) => {
    const improvementA = parseFloat(calculatePercentImprovement(a).replace('%', '')) || 0;
    const improvementB = parseFloat(calculatePercentImprovement(b).replace('%', '')) || 0;
    return improvementB - improvementA;
  });

  const clearSimulationData = () => {
    localStorage.removeItem('simulationResults');
    setSimulationData([]);
  };

  return (
    <div className={styles.leaderboardContainer}>
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
                <td>{calculatePercentImprovement(result)}</td>
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
  
      {/* Move Clear Results button below the table */}
      <div className={styles.refreshButton}>
        <button
          onClick={clearSimulationData}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginTop: '20px' }}
        >
          Clear Results
        </button>
      </div>
    </div>
  );  
}
