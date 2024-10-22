import styles from './RunButton.module.css';

// Renaming FormData to avoid conflict with the built-in FormData type
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
  const handleRun = async () => {
    try {
      const response = await fetch('https://surrogate-model-game-1-vagb.onrender.com//predict', { // URL of the Flask API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      alert(`Predicted Heating Load: ${data.prediction}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to predict');
    }
  };

  return (
    <button onClick={handleRun} className={styles.runButton}>
      Run
    </button>
  );
}
