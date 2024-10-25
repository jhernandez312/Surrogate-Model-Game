'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../components/Home.module.css'; // Import your CSS file
import defaultBuildings from '../data/defaultBuilding.json'; // Path to defaultBuilding.json

export default function Leaderboard() {
  const [simulationData, setSimulationData] = useState([]);

  useEffect(() => {
    // Fetch simulation data from localStorage
    const data = localStorage.getItem('simulationResults') || '[]';
    setSimulationData(JSON.parse(data));
  }, []);

  // Function to calculate percent improvement
  const calculatePercentImprovement = (result) => {
    // Get the total heating and cooling demand from the result, defaulting to 0 if missing
    const resultHeating = result.heating_demand || 0;
    const resultCooling = result.cooling_demand || 0;
    const resultTotalDemand = resultHeating + resultCooling;

    // Find the corresponding building type in the defaultBuildings JSON
    const defaultBuilding = defaultBuildings.find((building) => building.X1_Type === result.building_type);

    if (defaultBuilding) {
      const defaultHeating = defaultBuilding.Y1_Heating || 0;
      const defaultCooling = defaultBuilding.Y2_Cooling || 0;
      const defaultTotalDemand = defaultHeating + defaultCooling;

      // Calculate the percent improvement: ((Default - Result) / Default) * 100
      if (defaultTotalDemand > 0) {
        const percentImprovement = (((defaultTotalDemand - resultTotalDemand) / defaultTotalDemand) * 100).toFixed(2);
        return `${percentImprovement}%`; // Add percent sign here
      }
    }

    // If no default building or zero default demand, return N/A
    return 'N/A';
  };

  // Sort the simulation data based on percent improvement
  const sortedSimulationData = simulationData.slice().sort((a, b) => {
    const improvementA = parseFloat(calculatePercentImprovement(a).replace('%', '')) || 0;
    const improvementB = parseFloat(calculatePercentImprovement(b).replace('%', '')) || 0;
    return improvementB - improvementA; // Sort in descending order
  });

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
          </tbody>
        </table>
      </div>
    </div>
  );
}
