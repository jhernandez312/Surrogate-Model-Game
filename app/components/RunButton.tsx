import { useState, useEffect } from 'react';
import styles from './RunButton.module.css';

interface FormValues {
  relativeCompactness: number;
  surfaceArea: number;
  roofArea: number;
  overallHeight: number;
  orientation: number;
  glazingArea: number;
  glazingAreaDistribution: number;
}

interface RunButtonProps {
  formData: FormValues;
}

export default function RunButton({ formData }: RunButtonProps) {
  const [attemptCount, setAttemptCount] = useState(1);

  // Load attempt count from localStorage when the component mounts
  useEffect(() => {
    const storedAttempt = localStorage.getItem('attemptCount');
    if (storedAttempt) {
      setAttemptCount(Number(storedAttempt));
    }
  }, []);

  const handleRun = async () => {
    try {
      const response = await fetch('https://surrogate-model-game-1-vagb.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      const heatingDemand = data.prediction; // Assuming this is the heating load prediction from the API
      const buildingType = 'Office'; // You can replace this with dynamic data if needed

      // Store the result in localStorage for the leaderboard
      const newResult = {
        building_type: buildingType,
        heating_demand: heatingDemand,
        attempt: attemptCount,  // Store the attempt number with the result
      };

      const existingResults = JSON.parse(localStorage.getItem('simulationResults') || '[]');
      existingResults.push(newResult);
      localStorage.setItem('simulationResults', JSON.stringify(existingResults));

      alert(`Predicted Heating Load: ${heatingDemand} (Attempt ${attemptCount})`);

      // Increment the attempt counter and store in localStorage
      const nextAttempt = attemptCount + 1;
      setAttemptCount(nextAttempt);
      localStorage.setItem('attemptCount', nextAttempt.toString()); // Save the new count to localStorage
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to predict');
    }
  };

  return (
    <button onClick={handleRun} className={styles.runButton}>
      Run (Attempt {attemptCount})
    </button>
  );
}
