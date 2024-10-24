'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import FormInput from './components/FormInput';
import Previewer from './components/Previewer';
import RunButton from './components/RunButton';
import styles from './components/Home.module.css';
import Link from 'next/link';

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
      {/* Centered Title and Leaderboard Link */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Your Energy Bill Predictor</h1>
        <Link href="/leaderboard" className={styles.leaderboardLink}>
          Leaderboard
        </Link>
      </header>

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

          <FormInput
            label="Relative Compactness:"
            name="relativeCompactness"
            value={formData.relativeCompactness.toString()}
            onChange={handleChange}
          />
          <FormInput
            label="Surface Area:"
            name="surfaceArea"
            value={formData.surfaceArea.toString()}
            onChange={handleChange}
          />
          <FormInput
            label="Roof Area:"
            name="roofArea"
            value={formData.roofArea.toString()}
            onChange={handleChange}
          />
          <FormInput
            label="Overall Height:"
            name="overallHeight"
            value={formData.overallHeight.toString()}
            onChange={handleChange}
          />
          <FormInput
            label="Orientation:"
            name="orientation"
            value={formData.orientation.toString()}
            onChange={handleChange}
          />
          <FormInput
            label="Glazing Area:"
            name="glazingArea"
            value={formData.glazingArea.toString()}
            onChange={handleChange}
          />
          <FormInput
            label="Glazing Area Distribution:"
            name="glazingAreaDistribution"
            value={formData.glazingAreaDistribution.toString()}
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
