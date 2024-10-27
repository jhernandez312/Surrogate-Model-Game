'use client'; // Marks this as a React client component.

import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useDrag } from '@use-gesture/react';
import { PerspectiveCamera } from '@react-three/drei';

interface PreviewerProps {
  width: number;
  height: number;
  depth: number;
  modelPath: string; // Path to the 3D model file (GLTF format)
  color: string; // Added color prop to change the model color dynamically
  specificPartColor: string; // Color for specific part(s) of the model
}

const Previewer: React.FC<PreviewerProps> = ({ width, height, depth, modelPath, color, specificPartColor }) => {
  const modelRef = useRef<THREE.Group>(null!);
  const gridRef = useRef<THREE.GridHelper>(null!); // Reference to the grid
  const { scene } = useThree();
  scene.background = new THREE.Color(0xd3d3d3); // Set the scene background to a light grey

  // Load the GLTF model
  const gltf = useLoader(GLTFLoader, modelPath);

  // Drag interaction using `useDrag`
  const bind = useDrag(
    ({ offset: [x, y] }) => {
      if (modelRef.current) {
        modelRef.current.rotation.y = x / 100; // Rotate the model on the Y-axis
        modelRef.current.rotation.x = y / 100; // Rotate the model on the X-axis
        if (gridRef.current) {
          gridRef.current.rotation.y = x / 100; // Move grid with the model
          gridRef.current.rotation.x = y / 100; // Move grid with the model
        }
      }
    },
    { pointerEvents: true }
  );

  // Ensure the model scales based on the input width, height, depth
  useEffect(() => {
    if (gltf.scene && modelRef.current) {
      modelRef.current.scale.set(width / 10, height / 10, depth / 10); // Scale the model based on dimensions
    }
  }, [width, height, depth, gltf]);

  // Add a grid underneath the model
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.position.set(0, -1, 0); // Position the grid slightly below the model
    }
  }, []);

  // Apply color change to specific parts of the model
  useEffect(() => {
    if (gltf.scene && modelRef.current) {
      gltf.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;

          // Check if it's a specific part by name, index, or other identifier
          if (mesh.name === 'specificPartName' || mesh.uuid === 'specificUUID') {
            // Change the color of this specific part
            mesh.material = new THREE.MeshStandardMaterial({ color: new THREE.Color(specificPartColor) });
          } else {
            // Set general color for the rest of the model
            mesh.material = new THREE.MeshStandardMaterial({ color: new THREE.Color(color) });
          }
        }
      });
    }
  }, [color, specificPartColor, gltf]);

  return (
    <>
      {/* Perspective Camera setup */}
      <PerspectiveCamera
        makeDefault // Make this camera the default one used by the renderer
        fov={50} // Field of view
        aspect={width / height} // Aspect ratio (usually width / height)
        near={0.1} // Near clipping plane
        far={10000} // Far clipping plane
        position={[0, 5, 30]} // Camera position
      />

      {/* Grid helper underneath the model with a lighter color */}
      <gridHelper ref={gridRef} args={[100, 100, 0x333333, 0x777777]} />

      {/* Render the loaded GLTF model with drag interaction */}
      <primitive object={gltf.scene} ref={modelRef} {...bind()} />
    </>
  );
};

export default Previewer;
