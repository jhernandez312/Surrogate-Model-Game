'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Canvas } from '@react-three/fiber';
import FormInput from './components/FormInput';
import Previewer from './components/Previewer';
import RunButton from './components/RunButton';
import styles from './components/Home.module.css';
import FormSelect from './components/FormSelect';

interface FormData {
  Building_Type: string;
  Building_Area: number;
  Building_Shape: string;
  Aspect_Ratio: number;
  Orientation: number;
  Building_Height: number;
  Building_Stories: number;
  Building_Perimeter: number;
  Wall_Area: number;
  Total_Glazing_Area: number;
  Window_to_Wall_Ratio: number;
  Roof_Area: number;
  energy_code: string;
  hvac_category: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    Building_Type: 'Residential',
    Building_Area: 0,
    Building_Shape: 'Rectangular',
    Aspect_Ratio: 1,
    Orientation: 0,
    Building_Height: 0,
    Building_Stories: 2,
    Building_Perimeter: 0,
    Wall_Area: 0,
    Total_Glazing_Area: 0,
    Window_to_Wall_Ratio: 0,
    Roof_Area: 0,
    energy_code: 'Default',
    hvac_category: 'Default',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['Building_Type', 'Building_Shape', 'energy_code', 'hvac_category'].includes(name) ? value : Number(value),
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData); // Handle form submission
  };

  return (
    <div className={styles.container}>
      <h1>Building Energy Predictor</h1>
      <div className={styles.content}>
      <form onSubmit={handleSubmit} className={styles.form}>
          <FormSelect
            label="Building Type:"
            name="Building_Type"
            value={formData.Building_Type}
            onChange={handleChange}
            options={['SmallHotel', 'Retail', 'Office', 'Warehouse', 'StripMall', 'Outpatient', 'FullServiceRestaurant', 'QuickServiceRestaurant', 'LargeHotel', 'PrimarySchool', 'Hospital', 'SecondarySchool']}
          />
          <FormSelect
            label="Building Shape:"
            name="Building_Shape"
            value={formData.Building_Shape}
            onChange={handleChange}
            options={ ['Wide rectangle', 'L shape', 'Square', 'Narrow rectangle', 'Courtyard', 'H shape', 'E shape', 'T shape', 'U shape', 'Cross shape']}
          />
          <FormInput
            label="Building Area (m²):"
            name="Building_Area"
            value={formData.Building_Area.toString()}
            onChange={handleChange}
          />
          <FormInput
            label="Aspect Ratio:"
            name="Aspect_Ratio"
            value={formData.Aspect_Ratio.toString()}
            onChange={handleChange}
          />
          <FormInput
            label="Orientation (degrees):"
            name="Orientation"
            value={formData.Orientation.toString()}
            onChange={handleChange}
          />
          <FormInput
            label="Building Height (m):"
            name="Building_Height"
            value={formData.Building_Height.toString()}
            onChange={handleChange}
          />
          <FormInput
            label="Building Stories:"
            name="Building_Stories"
            value={formData.Building_Stories.toString()}
            onChange={handleChange}
          />
          <FormInput
            label="Building Perimeter (m):"
            name="Building_Perimeter"
            value={formData.Building_Perimeter.toString()}
            onChange={handleChange}
          />
          <FormInput
            label="Wall Area (m²):"
            name="Wall_Area"
            value={formData.Wall_Area.toString()}
            onChange={handleChange}
          />
          <FormInput
            label="Total Glazing Area (m²):"
            name="Total_Glazing_Area"
            value={formData.Total_Glazing_Area.toString()}
            onChange={handleChange}
          />
          <FormInput
            label="Window to Wall Ratio:"
            name="Window_to_Wall_Ratio"
            value={formData.Window_to_Wall_Ratio.toString()}
            onChange={handleChange}
          />
          <FormInput
            label="Roof Area (m²):"
            name="Roof_Area"
            value={formData.Roof_Area.toString()}
            onChange={handleChange}
          />
          <FormSelect
            label="Energy Code:"
            name="energy_code"
            value={formData.energy_code}
            onChange={handleChange}
            options={['ComStock 90.1-2007', 'ComStock DOE Ref 1980-2004', 'ComStock 90.1-2004', 'ComStock DOE Ref Pre-1980']}
          />

          <FormSelect
            label="HVAC Category:"
            name="hvac_category"
            value={formData.hvac_category}
            onChange={handleChange}
            options={['Small Packaged Unit', 'Multizone CAV/VAV', 'Zone-by-Zone', 'Residential Style Central Systems']}
          />

        </form>

        <div className={styles.previewSection}>
          {/* Add the Three.js Canvas here */}
          <Canvas style={{ height: 400, width: '100%' }}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Previewer
              width={formData.Building_Area / 10 || 1} // Example mapping
              height={formData.Building_Height / 10 || 1}
              depth={formData.Roof_Area / 10 || 1}
            />
          </Canvas>
          <RunButton formData={formData} />
        </div>
      </div>
    </div>
  );
}
