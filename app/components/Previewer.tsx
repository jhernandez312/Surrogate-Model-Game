'use client'; // Marks this as a React client component
import React, { useRef, useEffect, useState } from 'react';
import { useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'; // Correctly import GLTFLoader
import { useDrag } from '@use-gesture/react';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

interface GLTFResult extends THREE.Object3D {
  animations: THREE.AnimationClip[];
  scene: THREE.Group;
  scenes: THREE.Group[];
  cameras: THREE.Camera[];
  asset: object;
}

interface PreviewerProps {
  width: number;
  height: number;
  depth: number;
  modelPath: string; // Path to the 3D model file (GLTF format)
  color: string; // Added color prop to change the model color dynamically
  specificPartColor: string; // Color for specific part(s) of the model
  orientation?: [number, number, number]; // Added orientation prop for model rotation (X, Y, Z)
}

const Previewer: React.FC<PreviewerProps> = ({ width, height, depth, modelPath, color, specificPartColor, orientation = [0, 0, 0] }) => {
  const modelRef = useRef<THREE.Group>(null!);
  const gridRef = useRef<THREE.GridHelper>(null!); // Reference to the grid
  const { camera, scene, size } = useThree();
  scene.background = new THREE.Color(0xd3d3d3); // Set the scene background to a light grey

  // Track the camera distance based on the model size
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 5, Math.max(width, height, depth) * 7]);

  // Load the GLTF model and assert the type as GLTFResult
  const gltf = useLoader(GLTFLoader, modelPath) as GLTFResult; // Use correct type assertion

  // Drag interaction using `useDrag`
  const bind = useDrag(
    ({ offset: [x, y] }) => {
      if (modelRef.current) {
        // Slowing down the rotation by increasing the divisor
        modelRef.current.rotation.y = x / 300; // Rotate the model on the Y-axis (slower)
        modelRef.current.rotation.x = y / 300; // Rotate the model on the X-axis (slower)
        if (gridRef.current) {
          gridRef.current.rotation.y = x / 300; // Move grid with the model
          gridRef.current.rotation.x = y / 300; // Move grid with the model
        }
      }
    },
    {} // Removed the invalid `pointerEvents` option
  );

  // Ensure the model scales based on the input width, height, and depth independently
  useEffect(() => {
    if (gltf.scene && modelRef.current) {
      const scaleFactor = 15; // Adjust this value to make the model appear larger
      modelRef.current.scale.set(
        (width / 10) * scaleFactor,
        (height / 10) * scaleFactor,
        (depth / 10) * scaleFactor
      ); // Scale the model independently based on width, height, and depth
      modelRef.current.position.set(0, (height / 10) * scaleFactor, 0); // Adjust the position to keep the model centered

      // Apply the orientation prop to the model's rotation
      modelRef.current.rotation.set(orientation[0], orientation[1], orientation[2]);
    }
  }, [width, height, depth, gltf, orientation]);

  // Dynamically adjust the grid size and position based on the model size
  useEffect(() => {
    if (gridRef.current) {
      const gridSize = Math.max(width, height, depth) * 3; // Scale the grid size dynamically
      gridRef.current.scale.set(gridSize, gridSize, gridSize);
      gridRef.current.position.set(0, -height / 10, 0); // Position the grid slightly below the model
    }
  }, [width, height, depth]);

  // Dynamically update camera position when model size changes
  useEffect(() => {
    const newCameraZ = Math.max(width, height, depth) * 10;
    setCameraPosition([0, newCameraZ, newCameraZ]);
    camera.position.set(0, newCameraZ, newCameraZ);
    camera.updateProjectionMatrix(); // Ensure the camera matrix updates with the new position
  }, [width, height, depth, camera]);

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
      {/* Directional Light for casting shadows */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
      />
      <directionalLight
        position={[-10, -10, -10]}
        intensity={0.2}
      />

      {/* Perspective Camera setup with reduced FOV to prevent warping */}
      <PerspectiveCamera
        makeDefault
        fov={35} // Smaller FOV to reduce warping
        aspect={size.width / size.height} // Aspect ratio based on canvas size
        near={0.1}
        far={10000}
        position={cameraPosition} // Pass the camera position
      />

      {/* Orbit Controls for zoom and rotation with reduced speed */}
      <OrbitControls
        enableZoom={true}
        maxDistance={Math.max(width, height, depth) * 23}
        minDistance={10}
        zoomSpeed={0.5} // Reduced zoom speed for smoother control
        rotateSpeed={0.2} // Reduced rotate speed for smoother control
        panSpeed={0.2} // Reduced pan speed for smoother control
      />

      {/* Grid helper that changes with the camera and model size */}
      <gridHelper ref={gridRef} args={[100, 500, 0x333333, 0x777777]} />

      {/* Render the loaded GLTF model with drag interaction */}
      <primitive object={gltf.scene} ref={modelRef} {...bind()} />
    </>
  );
};

export default Previewer;
