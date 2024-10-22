'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import FormInput from './components/FormInput';
import Previewer from './components/Previewer';
import RunButton from './components/RunButton';
import styles from './components/Home.module.css';

// Define the interface with numbers for relevant fields
interface FormData {
  state: string;
  buildingUse: string;
  relativeCompactness: number;
  surfaceArea: number;
  roofArea: number;
  overallHeight: number;
  orientation: number;
  glazingArea: number;
  glazingAreaDistribution: number;
}

export default function Home() {
  // Initialize form data with number values for the numeric fields
  const [formData, setFormData] = useState<FormData>({
    state: 'Georgia',
    buildingUse: 'Office',
    relativeCompactness: 0,
    surfaceArea: 0,
    roofArea: 0,
    overallHeight: 0,
    orientation: 0,
    glazingArea: 0,
    glazingAreaDistribution: 0,
  });

  // Ensure that numerical values are correctly parsed to numbers
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'state' || name === 'buildingUse' ? value : Number(value),
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData); // Handle form submission
  };

  return (
    <div className={styles.container}>
      <h1>Your Energy Bill Predictor</h1>
      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <FormInput
            label="Where is your house?"
            name="state"
            value={formData.state}
            onChange={handleChange}
            readOnly
          />
          <FormInput
            label="What is this building used for?"
            name="buildingUse"
            value={formData.buildingUse}
            onChange={handleChange}
            readOnly
          />

          <h3>Detailed settings</h3>

          <FormInput
            label="Relative Compactness:"
            name="relativeCompactness"
            value={formData.relativeCompactness.toString()} // Convert to string for input value
            onChange={handleChange}
          />
          <FormInput
            label="Surface Area:"
            name="surfaceArea"
            value={formData.surfaceArea.toString()} // Convert to string for input value
            onChange={handleChange}
          />
          <FormInput
            label="Roof Area:"
            name="roofArea"
            value={formData.roofArea.toString()} // Convert to string for input value
            onChange={handleChange}
          />
          <FormInput
            label="Overall Height:"
            name="overallHeight"
            value={formData.overallHeight.toString()} // Convert to string for input value
            onChange={handleChange}
          />
          <FormInput
            label="Orientation:"
            name="orientation"
            value={formData.orientation.toString()} // Convert to string for input value
            onChange={handleChange}
          />
          <FormInput
            label="Glazing Area:"
            name="glazingArea"
            value={formData.glazingArea.toString()} // Convert to string for input value
            onChange={handleChange}
          />
          <FormInput
            label="Glazing Area Distribution:"
            name="glazingAreaDistribution"
            value={formData.glazingAreaDistribution.toString()} // Convert to string for input value
            onChange={handleChange}
          />
        </form>

        <div className={styles.previewSection}>
          <Previewer />
          <RunButton formData={formData} />
        </div>
      </div>
    </div>
  );
}