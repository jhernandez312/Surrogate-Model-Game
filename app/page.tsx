'use client'; // Add this line at the top

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
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
  Length: number;
  Width: number;
  Building_Shape: string;
  Orientation: number;
  Floor_Height: number;
  Building_Stories: number;
  WWR: number;
  energy_code: string;
  hvac_category: string;
  Building_Height: number;
  Wall_Area: number;
  Total_Glazing_Area: number;
  Roof_Area: number;
}

export default function Home() {
  // Find the initial default values from the "SmallOffice" type in defaultBuilding.json
  const initialBuilding = defaultBuildings.find(
    (building) => building.X1_Type === 'SmallOffice'
  );

  const [formData, setFormData] = useState<FormData>({
    Building_Type: initialBuilding?.X1_Type || 'SmallOffice',
    Length: initialBuilding?.X13_Length || 50,
    Width: initialBuilding?.X14_Width || 30,
    Building_Shape: initialBuilding?.X2_Shape || 'Wide rectangle',
    Orientation: initialBuilding?.X3_Orientation || 0,
    Floor_Height: initialBuilding?.X15_FloorHeight || 3,
    Building_Stories: initialBuilding?.X5_Stories || 2,
    WWR: initialBuilding?.X8_WWR || 20, // Convert to percentage
    energy_code: initialBuilding?.X10_EnergyCode || 'ComStock 90.1-2007',
    hvac_category: initialBuilding?.X12_HVAC || 'Small Packaged Unit',
    Building_Height: 0,
    Wall_Area: 0,
    Total_Glazing_Area: 0,
    Roof_Area: initialBuilding?.X9_RoofArea || 0,
  });


  const [color, setColor] = useState("#58afef");

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };
  const calculateDependentVariables = () => {
    const { Length, Width, Floor_Height, Building_Stories, WWR, Building_Shape } = formData;
  
    console.log('Recalculating dependent variables for:', { Length, Width, Floor_Height, Building_Stories, WWR, Building_Shape });
  
    let Building_Height = 0,
      Wall_Area = 0,
      Total_Glazing_Area = 0,
      Roof_Area = 0;
  
    if (Building_Shape === 'Wide rectangle') {
      Roof_Area = Length * Width;
      Building_Height = Floor_Height * Building_Stories;
      Wall_Area = 2 * (Length + Width) * Building_Height;
      Total_Glazing_Area = Wall_Area * (WWR);
    } else if (Building_Shape === 'L shape') {
      Roof_Area = 5 * (Length * Width) / 9;
      Building_Height = Floor_Height * Building_Stories;
      Wall_Area = 2 * (Length + Width) * Building_Height;
      Total_Glazing_Area = Wall_Area * (WWR);
    } else if (Building_Shape === 'T shape') {
      Roof_Area = 5 * (Length * Width) / 9;
      Building_Height = Floor_Height * Building_Stories;
      Wall_Area = 2 * (Length + Width) * Building_Height;
      Total_Glazing_Area = Wall_Area * (WWR);
    }
  
    setFormData((prevData) => ({
      ...prevData,
      Building_Height,
      Wall_Area,
      Total_Glazing_Area,
      Roof_Area,
    }));
  };
  
  

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedBuildingType = e.target.value;
  
    // Find the corresponding building type in defaultBuildings JSON
    const selectedBuilding = defaultBuildings.find(
      (building) => building.X1_Type === selectedBuildingType
    );
  
    if (selectedBuilding) {
      // Update formData with default building settings
      setFormData({
        ...formData,
        Building_Type: selectedBuilding.X1_Type,
        Building_Shape: selectedBuilding.X2_Shape,
        Orientation: selectedBuilding.X3_Orientation,
        Floor_Height: selectedBuilding.X15_FloorHeight,
        Building_Stories: selectedBuilding.X5_Stories,
        WWR: selectedBuilding.X8_WWR, // Convert to percentage
        energy_code: selectedBuilding.X10_EnergyCode,
        hvac_category: selectedBuilding.X12_HVAC,
        Length: selectedBuilding.X13_Length,
        Width: selectedBuilding.X14_Width,
        Roof_Area: selectedBuilding.X9_RoofArea,
        Wall_Area: selectedBuilding.X6_WallArea,
        Total_Glazing_Area: selectedBuilding.X7_WindowArea,
      });
    }
  };  
  
  useEffect(() => {
    calculateDependentVariables();  // Recalculate dependent values when any independent variable changes
  }, [
    formData.Building_Type, 
    formData.Building_Shape, 
    formData.Length, 
    formData.Width, 
    formData.Floor_Height, 
    formData.Building_Stories, 
    formData.WWR
  ]);
  
  

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className={styles.container}>
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
          onChange={handleChange} // Call the new handler function
          options={defaultBuildings.map((building) => building.X1_Type)}
        />

          <FormSelect
            label="Building Shape:"
            name="Building_Shape"
            value={formData.Building_Shape}
            onChange={handleChange}
            options={['Wide rectangle', 'L shape', 'T shape']}
          />
          <FormInput label="Length (m):" name="Length" value={formData.Length.toString()} onChange={handleChange} />
          <FormInput label="Width (m):" name="Width" value={formData.Width.toString()} onChange={handleChange} />
          <FormInput label="Orientation (degrees):" name="Orientation" value={formData.Orientation.toString()} onChange={handleChange} />
          <FormInput label="Floor Height (m):" name="Floor_Height" value={formData.Floor_Height.toString()} onChange={handleChange} />
          <FormInput
            label="Building Stories:"
            name="Building_Stories"
            value={formData.Building_Stories.toString()}
            readOnly // Keep this read-only so only the slider changes the value
          />

          {/* Handle the slider separately to update Building_Stories */}
          <input
            type="range"
            name="Building_Stories"
            min="1"
            max="14"
            value={formData.Building_Stories}
            onChange={(e) => setFormData({ ...formData, Building_Stories: Number(e.target.value) })} // Directly update the Building_Stories value
            style={{ width: '100%', marginTop: '1px' }} // Add your styling here
          />
          <FormInput
            label="Window to Wall Ratio (WWR):"
            name="WWR"
            value={formData.WWR.toString()}
            readOnly // Keep this read-only so only the slider changes the value
          />

          {/* Handle the slider separately to update WWR */}
          <input
            type="range"
            name="WWR"
            min="0.1"
            max="76.1"
            step="0.1"
            value={formData.WWR}
            onChange={(e) => setFormData({ ...formData, WWR: Number(e.target.value) })} // Directly update the WWR value
            style={{ width: '100%', marginTop: '1px' }}
          />
          <FormSelect label="Energy Code:" name="energy_code" value={formData.energy_code} onChange={handleChange} options={['ComStock 90.1-2007', 'ComStock DOE Ref 1980-2004', 'ComStock 90.1-2004', 'ComStock DOE Ref Pre-1980']} />
          <FormSelect label="HVAC Category:" name="hvac_category" value={formData.hvac_category} onChange={handleChange} options={['Small Packaged Unit', 'Multizone CAV/VAV', 'Zone-by-Zone', 'Residential Style Central Systems']} />
        </form>

        <div className={styles.previewSection}>
          <Canvas style={{ height: 400, width: '100%' }}>
            <ambientLight />
            <Previewer
              width={formData.Roof_Area / 10 || 1}
              height={formData.Building_Height / 10 || 1}
              depth={formData.Roof_Area / 10 || 1}
              modelPath="courtyard.glb"
              color={color}
              specificPartColor={'#7bc379'}
            />
          </Canvas>

          <RunButton formData={formData} />
        </div>
      </div>
    </div>
  );
}
