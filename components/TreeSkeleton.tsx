import React, { useMemo } from 'react';
import { TREE_CONFIG } from '../types';

const TreeSkeleton: React.FC = () => {
  // Generate branches procedurally
  const branches = useMemo(() => {
    const b = [];
    const layers = 6;
    const height = TREE_CONFIG.height;
    
    for (let i = 0; i < layers; i++) {
      const y = (i / layers) * (height * 0.7) - height * 0.3;
      const radiusAtHeight = (1 - (i / layers)) * (TREE_CONFIG.radius * 0.6);
      const branchCount = 5 + i;
      
      for (let j = 0; j < branchCount; j++) {
        const angle = (j / branchCount) * Math.PI * 2 + (i * 0.5);
        b.push({
          position: [0, y, 0],
          rotation: [
             (Math.PI / 3) - (i * 0.1), // Angle upwards
             angle, 
             0
          ],
          scale: [0.1, radiusAtHeight, 0.1]
        });
      }
    }
    return b;
  }, []);

  return (
    <group position={[0, -4, 0]}>
      {/* Main Trunk */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.4, 1.2, TREE_CONFIG.height * 0.8, 8]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} />
      </mesh>
      
      {/* Branches */}
      {branches.map((branch, index) => (
        <mesh 
          key={index} 
          position={branch.position as [number, number, number]} 
          rotation={branch.rotation as [number, number, number]}
        >
          {/* Shift cylinder geometry so pivot is at base */}
          <cylinderGeometry args={[0.05, 0.15, branch.scale[1] * 2, 5]} />
          <meshStandardMaterial color="#4e342e" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

export default TreeSkeleton;