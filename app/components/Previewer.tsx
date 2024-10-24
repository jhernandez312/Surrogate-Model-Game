'use client';

import React, { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';

interface BoxProps {
  width: number;
  height: number;
  depth: number;
}

// Box component for rendering the 3D box with dynamic size, outline, and draggable interaction
const Previewer: React.FC<BoxProps> = ({ width, height, depth }) => {
  const boxRef = useRef<THREE.Mesh>(null!);
  const outlineRef = useRef<THREE.LineSegments>(null!);
  const { camera, scene } = useThree(); // Access the camera and scene from Three.js

  // Set camera position to ensure it looks down enough to see the ground
  camera.position.set(0, 20, 150); // Move the camera further away from the object to zoom out

  // Set background to light grey
  scene.background = new THREE.Color(0xd3d3d3); // Light grey color

  // Drag interaction using `useDrag`
  const bind = useDrag(
    ({ offset: [x, y] }) => {
      if (boxRef.current) {
        boxRef.current.rotation.y = x / 100; // Adjust rotation based on drag x movement
        boxRef.current.rotation.x = y / 100; // Adjust rotation based on drag y movement
      }
      if (outlineRef.current) {
        outlineRef.current.rotation.y = x / 100;
        outlineRef.current.rotation.x = y / 100;
      }
    },
    { pointerEvents: true } // Enable pointer events for drag
  );

  // Define face colors for the cube (6 sides, each side a different color)
  const faceColors = [
    new THREE.Color(0xff0000), // Red
    new THREE.Color(0x00ff00), // Green
    new THREE.Color(0x0000ff), // Blue
    new THREE.Color(0xffff00), // Yellow
    new THREE.Color(0xff00ff), // Magenta
    new THREE.Color(0x00ffff), // Cyan
  ];

  // Creating materials for each face of the box
  const materials = faceColors.map((color) => new THREE.MeshBasicMaterial({ color }));

  return (
    <>
      {/* Main box mesh with different colors for each face */}
      <mesh ref={boxRef} scale={[width, height, depth]} position={[0, height / 2, 0]} material={materials} {...bind()}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>

      {/* Outline wireframe */}
      <lineSegments ref={outlineRef} scale={[width * 1.01, height * 1.01, depth * 1.01]} position={[0, height / 2, 0]} {...bind()}>
        <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial color="black" />
      </lineSegments>
    </>
  );
};

export default Previewer;
