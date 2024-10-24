'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Canvas } from '@react-three/fiber';
import FormInput from './components/FormInput';
import Previewer from './components/Previewer';
import RunButton from './components/RunButton';
import styles from './components/Home.module.css';
import Link from 'next/link';
import FormSelect from './components/FormSelect';
import defaultBuildings from './data/defaultBuilding.json'; // Adjust the path as necessary


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

  const initialBuilding = defaultBuildings.find((building) => building.X1_Type === 'SmallOffice');

  const [formData, setFormData] = useState<FormData>({
    Building_Type: initialBuilding?.X1_Type || 'SmallOffice',
    Building_Area: initialBuilding?.X2_Area || 0,
    Building_Shape: initialBuilding?.X3_Shape || 'Wide rectangle',
    Aspect_Ratio: initialBuilding?.X4_AspectRatio || 1,
    Orientation: initialBuilding?.X5_Orientation || 0,
    Building_Height: initialBuilding?.X6_Height || 0,
    Building_Stories: initialBuilding?.X7_Stories || 2,
    Building_Perimeter: initialBuilding?.X8_Perimeter || 0,
    Wall_Area: initialBuilding?.X9_WallArea || 0,
    Total_Glazing_Area: initialBuilding?.X10_WindowArea || 0,
    Window_to_Wall_Ratio: initialBuilding?.X11_WWR || 0,
    Roof_Area: initialBuilding?.X12_RoofArea || 0,
    energy_code: initialBuilding?.X13_EnergyCode || 'ComStock 90.1-2007',
    hvac_category: initialBuilding?.X14_HVAC || 'Small Packaged Unit',
  });

  // Function to handle building type selection and auto-populate fields based on JSON data
  const handleBuildingTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedBuildingType = e.target.value;

    // Find the default building data for the selected type
    const selectedBuilding = defaultBuildings.find((building) => building.X1_Type === selectedBuildingType);

    if (selectedBuilding) {
      // Update formData with default building settings
      setFormData({
        Building_Type: selectedBuilding.X1_Type,
        Building_Area: selectedBuilding.X2_Area,
        Building_Shape: selectedBuilding.X3_Shape,
        Aspect_Ratio: selectedBuilding.X4_AspectRatio,
        Orientation: selectedBuilding.X5_Orientation,
        Building_Height: selectedBuilding.X6_Height,
        Building_Stories: selectedBuilding.X7_Stories,
        Building_Perimeter: selectedBuilding.X8_Perimeter,
        Wall_Area: selectedBuilding.X9_WallArea,
        Total_Glazing_Area: selectedBuilding.X10_WindowArea,
        Window_to_Wall_Ratio: selectedBuilding.X11_WWR,
        Roof_Area: selectedBuilding.X12_RoofArea,
        energy_code: selectedBuilding.X13_EnergyCode,
        hvac_category: selectedBuilding.X14_HVAC,
      });
    }
  };

  // Define the missing handleGeneralChange function
  const handleGeneralChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

      {/* Centered Title and Leaderboard Link */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Your Energy Bill Predictor</h1>
        <Link href="/leaderboard" className={styles.leaderboardLink}>
          Leaderboard
        </Link>
      </header>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <FormSelect
            label="Building Type:"
            name="Building_Type"
            value={formData.Building_Type}
            onChange={handleBuildingTypeChange} // Updated to use the new handler
            options={[
              'Warehouse',
              'StripMall',
              'Retail',
              'Office',
              'QuickServiceRestaurant',
              'PrimarySchool',
              'Hospital',
              'SmallOffice', // Default on load
              'OutPatient',
              'LargeOffice',
              'FullServiceRestaurant',
              'SmallHotel',
              'SecondarySchool',
              'LargeHotel',
            ]}
          />
          <FormSelect
            label="Building Shape:"
            name="Building_Shape"
            value={formData.Building_Shape}
            onChange={handleGeneralChange} // Updated to use handleGeneralChange
            options={['Wide rectangle', 'L shape', 'Square', 'Narrow rectangle', 'Courtyard', 'H shape', 'E shape', 'T shape', 'U shape', 'Cross shape']}
          />
          <FormInput
            label="Building Area (m²):"
            name="Building_Area"
            value={formData.Building_Area.toString()}
            onChange={handleGeneralChange} // Updated to use handleGeneralChange
          />
          <FormInput
            label="Aspect Ratio:"
            name="Aspect_Ratio"
            value={formData.Aspect_Ratio.toString()}
            onChange={handleGeneralChange} // Updated to use handleGeneralChange
          />
          <FormInput
            label="Orientation (degrees):"
            name="Orientation"
            value={formData.Orientation.toString()}
            onChange={handleGeneralChange} // Updated to use handleGeneralChange
          />
          <FormInput
            label="Building Height (m):"
            name="Building_Height"
            value={formData.Building_Height.toString()}
            onChange={handleGeneralChange} // Updated to use handleGeneralChange
          />
          <FormInput
            label="Building Stories:"
            name="Building_Stories"
            value={formData.Building_Stories.toString()}
            onChange={handleGeneralChange} // Updated to use handleGeneralChange
          />
          <FormInput
            label="Building Perimeter (m):"
            name="Building_Perimeter"
            value={formData.Building_Perimeter.toString()}
            onChange={handleGeneralChange} // Updated to use handleGeneralChange
          />
          <FormInput
            label="Wall Area (m²):"
            name="Wall_Area"
            value={formData.Wall_Area.toString()}
            onChange={handleGeneralChange} // Updated to use handleGeneralChange
          />
          <FormInput
            label="Total Glazing Area (m²):"
            name="Total_Glazing_Area"
            value={formData.Total_Glazing_Area.toString()}
            onChange={handleGeneralChange} // Updated to use handleGeneralChange
          />
          <FormInput
            label="Window to Wall Ratio:"
            name="Window_to_Wall_Ratio"
            value={formData.Window_to_Wall_Ratio.toString()}
            onChange={handleGeneralChange} // Updated to use handleGeneralChange
          />
          <FormInput
            label="Roof Area (m²):"
            name="Roof_Area"
            value={formData.Roof_Area.toString()}
            onChange={handleGeneralChange} // Updated to use handleGeneralChange
          />
          <FormSelect
            label="Energy Code:"
            name="energy_code"
            value={formData.energy_code}
            onChange={handleGeneralChange} // Updated to use handleGeneralChange
            options={['ComStock 90.1-2007', 'ComStock DOE Ref 1980-2004', 'ComStock 90.1-2004', 'ComStock DOE Ref Pre-1980']}
          />
          <FormSelect
            label="HVAC Category:"
            name="hvac_category"
            value={formData.hvac_category}
            onChange={handleGeneralChange} // Updated to use handleGeneralChange
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
