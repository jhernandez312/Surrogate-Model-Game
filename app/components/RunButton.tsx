import { useState, useEffect } from 'react';
import styles from './RunButton.module.css';

interface FormValues {
  Building_Type: string;
  Building_Shape: string;
  Orientation: number;
  Building_Height: number;
  Building_Stories: number;
  Wall_Area: number;
  Window_Area: number;
  Roof_Area: number;
  energy_code: string;
  hvac_category: string;
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
    console.log('FormValues:', JSON.stringify(formData)); // Print FormValues to the console
    try {
      const response = await fetch('https://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      const heatingDemand = data.prediction; // Assuming this is the heating load prediction from the API
      const buildingType = formData.Building_Type; // You can replace this with dynamic data if needed

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
