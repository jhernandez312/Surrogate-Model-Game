import styles from './RunButton.module.css';

// Define the type for formData based on the expected structure
interface FormData {
  relativeCompactness: number;
  surfaceArea: number;
  roofArea: number;
  overallHeight: number;
  orientation: number;
  glazingArea: number;
  glazingAreaDistribution: number;
}

interface RunButtonProps {
  formData: FormData;
}

export default function RunButton({ formData }: RunButtonProps) {
  const handleRun = async () => {
    try {
      const response = await fetch('http://localhost:5000/predict', { // URL of the Flask API
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
