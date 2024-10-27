'use client';

import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useDrag } from '@use-gesture/react';

interface PreviewerProps {
  width: number;
  height: number;
  depth: number;
  modelPath: string; // Add model path prop
}

const Previewer: React.FC<PreviewerProps> = ({ width, height, depth, modelPath }) => {
  const modelRef = useRef<THREE.Group>(null!);
  const outlineRef = useRef<THREE.LineSegments>(null!);
  const { camera, scene } = useThree();

  // Set camera position to ensure it looks down enough to see the ground
  camera.position.set(0, 20, 1);
  scene.background = new THREE.Color(0xd3d3d3);

  // Load the GLTF model
  const gltf = useLoader(GLTFLoader, modelPath);

  // Drag interaction using `useDrag`
  const bind = useDrag(
    ({ offset: [x, y] }) => {
      if (modelRef.current) {
        modelRef.current.rotation.y = x / 100;
        modelRef.current.rotation.x = y / 100;
      }
    },
    { pointerEvents: true }
  );

  // Ensure the model scales based on the input width, height, depth
  useEffect(() => {
    if (gltf.scene && modelRef.current) {
      modelRef.current.scale.set(width / 10, height / 10, depth / 10);
    }
  }, [width, height, depth, gltf]);

  return (
    <>
      {/* Loaded GLTF model */}
      <primitive object={gltf.scene} ref={modelRef} {...bind()} />
    </>
  );
};

export default Previewer;
