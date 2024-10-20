"use client"; // Add this line to mark the component as a Client Component

import { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  state: string;
  buildingUse: string;
  buildingShape: string;
  buildingAge: string;
  squareFootage: string;
  ceilingHeight: string;
  wallArea: string;
  wwr: string; // Window to Wall Ratio
  orientation: string;
  energyCode: string;
  hvacCategory: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    state: 'Georgia',
    buildingUse: 'Office',
    buildingShape: '',
    buildingAge: '',
    squareFootage: '',
    ceilingHeight: '',
    wallArea: '',
    wwr: '',
    orientation: '',
    energyCode: '',
    hvacCategory: '',
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
    console.log(formData); // You can handle the form submission here
  };

  return (
    <div className="container">
      <h1>Your Energy Bill Predictor</h1>
      <div className="content">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Where is your house?</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              readOnly
            />
          </div>

          <div className="form-group">
            <label>What this building used for?</label>
            <input
              type="text"
              name="buildingUse"
              value={formData.buildingUse}
              onChange={handleChange}
              readOnly
            />
          </div>

          <h3>Detailed settings</h3>

          <div className="form-group">
            <label>Building Shape:</label>
            <input
              type="text"
              name="buildingShape"
              value={formData.buildingShape}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Building Age:</label>
            <input
              type="text"
              name="buildingAge"
              value={formData.buildingAge}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Square Footage:</label>
            <input
              type="text"
              name="squareFootage"
              value={formData.squareFootage}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Ceiling Height:</label>
            <input
              type="text"
              name="ceilingHeight"
              value={formData.ceilingHeight}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Wall Area:</label>
            <input
              type="text"
              name="wallArea"
              value={formData.wallArea}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>WWR (Window to Wall Ratio):</label>
            <input
              type="text"
              name="wwr"
              value={formData.wwr}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Orientation:</label>
            <input
              type="text"
              name="orientation"
              value={formData.orientation}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Energy Code:</label>
            <input
              type="text"
              name="energyCode"
              value={formData.energyCode}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>HVAC Category:</label>
            <input
              type="text"
              name="hvacCategory"
              value={formData.hvacCategory}
              onChange={handleChange}
            />
          </div>
        </form>

        <div className="preview-section">
          <div className="previewer">
            <p>Building Geometry Previewer</p>
          </div>

          <button type="submit" className="run-button">Run</button>
        </div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: Arial, sans-serif;
        }
        h1 {
          margin-bottom: 20px;
        }
        .content {
          display: flex;
          justify-content: space-between;
          width: 100%;
          max-width: 1000px;
        }
        .form {
          display: flex;
          flex-direction: column;
          width: 40%;
        }
        .form-group {
          margin-bottom: 10px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
        }
        .form-group input {
          padding: 5px;
          width: 100%;
          border: 1px solid #ccc; /* Added border */
          border-radius: 4px;
          box-shadow: none;
        }
        h3 {
          margin-top: 20px;
          font-size: 18px;
          font-weight: normal;
        }
        .preview-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 55%;
        }
        .previewer {
          margin-top: 20px;
          width: 100%;
          height: 400px;
          background-color: #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ccc;
          color: #666;
          font-size: 18px;
        }
        .run-button {
          padding: 10px 20px;
          margin-top: 20px;
          background-color: #0070f3;
          color: white;
          border: none;
          cursor: pointer;
          align-self: center;
        }
        .run-button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
}
