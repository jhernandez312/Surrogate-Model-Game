'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../components/Home.module.css'; // Import your CSS file

export default function Leaderboard() {
  const [simulationData, setSimulationData] = useState([]);

  useEffect(() => {
    // Fetch simulation data from localStorage
    const data = localStorage.getItem('simulationResults') || '[]';
    setSimulationData(JSON.parse(data));
  }, []);

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
            </tr>
          </thead>
          <tbody>
            {simulationData.map((result, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{result.building_type}</td>
                <td>{result.heating_demand}</td>
                <td>{result.cooling_demand}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
