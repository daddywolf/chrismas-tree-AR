import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';
import { TreeMode, TREE_CONFIG } from '../types';

const ChristmasTree: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const { mode, treeColor, particleCount, animationSpeed, isHandDetected } = useStore();
  const currentRotationSpeed = useRef(0.05);
  
  // 1. Generate positions
  const { positions, randomPositions } = useMemo(() => {
    const count = particleCount;
    const pos = new Float32Array(count * 3);
    const randPos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Tree Shape (Cone)
      const y = Math.random() * TREE_CONFIG.height; 
      const radiusAtHeight = (1 - y / TREE_CONFIG.height) * TREE_CONFIG.radius;
      const angle = i * 2.39996 + (Math.random() * 0.5); 
      const r = Math.sqrt(Math.random()) * radiusAtHeight; 
      
      const x = r * Math.cos(angle);
      const z = r * Math.sin(angle);
      const yPos = y - TREE_CONFIG.height / 2;

      pos[i * 3] = x;
      pos[i * 3 + 1] = yPos;
      pos[i * 3 + 2] = z;

      // Explosion positions
      const rExplode = 15 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      randPos[i * 3] = rExplode * Math.sin(phi) * Math.cos(theta);
      randPos[i * 3 + 1] = rExplode * Math.sin(phi) * Math.sin(theta);
      randPos[i * 3 + 2] = rExplode * Math.cos(phi);
    }
    return { positions: pos, randomPositions: randPos };
  }, [particleCount]);

  // 2. Generate colors
  const colors = useMemo(() => {
      const count = particleCount;
      const cols = new Float32Array(count * 3);
      const colorObj = new THREE.Color();
      const baseColor = new THREE.Color(treeColor);
      const secondaryColor = new THREE.Color('#aaddaa'); 

      for (let i = 0; i < count; i++) {
          const yPos = positions[i * 3 + 1];
          const mixFactor = (yPos + TREE_CONFIG.height / 2) / TREE_CONFIG.height;

          if (Math.random() > 0.95) {
             const lightColors = ['#ffaa00', '#ff0000', '#0088ff', '#ffffff'];
             colorObj.set(lightColors[Math.floor(Math.random() * lightColors.length)]);
             colorObj.multiplyScalar(3); 
          } else {
            colorObj.copy(baseColor).lerp(secondaryColor, mixFactor * 0.3);
          }
          
          cols[i * 3] = colorObj.r;
          cols[i * 3 + 1] = colorObj.g;
          cols[i * 3 + 2] = colorObj.b;
      }
      return cols;
  }, [positions, treeColor, particleCount]);

  const currentPositions = useMemo(() => new Float32Array(positions), [positions]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const positionsAttribute = pointsRef.current.geometry.attributes.position;
    if (positionsAttribute.count !== particleCount) return;

    const isDispersed = mode === TreeMode.DISPERSE;
    const speed = (isDispersed ? 2 : 3) * animationSpeed;

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const targetX = isDispersed ? randomPositions[idx] : positions[idx];
      const targetY = isDispersed ? randomPositions[idx + 1] : positions[idx + 1];
      const targetZ = isDispersed ? randomPositions[idx + 2] : positions[idx + 2];

      currentPositions[idx] += (targetX - currentPositions[idx]) * delta * speed;
      currentPositions[idx + 1] += (targetY - currentPositions[idx + 1]) * delta * speed;
      currentPositions[idx + 2] += (targetZ - currentPositions[idx + 2]) * delta * speed;

      if (!isDispersed) {
          const time = state.clock.elapsedTime;
          currentPositions[idx + 1] += Math.sin(time * 2 + i) * 0.02; // Shimmer
      }
    }
    positionsAttribute.needsUpdate = true;
    
    // Stop idle rotation if hand is interacting
    const targetRotationSpeed = isHandDetected ? 0 : 0.05;
    currentRotationSpeed.current = THREE.MathUtils.lerp(currentRotationSpeed.current, targetRotationSpeed, delta * 3);
    pointsRef.current.rotation.y += delta * currentRotationSpeed.current;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={currentPositions.length / 3} array={currentPositions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.12} vertexColors transparent opacity={0.9} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
};

export default ChristmasTree;