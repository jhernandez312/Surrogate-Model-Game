'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import FormInput from './components/FormInput';
import Previewer from './components/Previewer';
import RunButton from './components/RunButton';
import styles from './components/Home.module.css';

interface FormData {
  state: string;
  buildingUse: string;
  relativeCompactness: string;
  surfaceArea: string;
  roofArea: string;
  overallHeight: string;
  orientation: string;
  glazingArea: string;
  glazingAreaDistribution: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    state: 'Georgia',
    buildingUse: 'Office',
    relativeCompactness: '',
    surfaceArea: '',
    roofArea: '',
    overallHeight: '',
    orientation: '',
    glazingArea: '',
    glazingAreaDistribution: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
            value={formData.relativeCompactness}
            onChange={handleChange}
          />
          <FormInput
            label="Surface Area:"
            name="surfaceArea"
            value={formData.surfaceArea}
            onChange={handleChange}
          />
          <FormInput
            label="Roof Area:"
            name="roofArea"
            value={formData.roofArea}
            onChange={handleChange}
          />
          <FormInput
            label="Overall Height:"
            name="overallHeight"
            value={formData.overallHeight}
            onChange={handleChange}
          />
          <FormInput
            label="Orientation:"
            name="orientation"
            value={formData.orientation}
            onChange={handleChange}
          />
          <FormInput
            label="Glazing Area:"
            name="glazingArea"
            value={formData.glazingArea}
            onChange={handleChange}
          />
          <FormInput
            label="Glazing Area Distribution:"
            name="glazingAreaDistribution"
            value={formData.glazingAreaDistribution}
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
