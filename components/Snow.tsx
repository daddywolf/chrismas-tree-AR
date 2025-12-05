import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Snow: React.FC = () => {
  const count = 1000;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = new THREE.Object3D();
  
  // Initialize positions
  const particles = useRef(new Array(count).fill(0).map(() => ({
      position: new THREE.Vector3(
          (Math.random() - 0.5) * 30,
          Math.random() * 20,
          (Math.random() - 0.5) * 30
      ),
      velocity: Math.random() * 0.05 + 0.02,
      scale: Math.random() * 0.5 + 0.2
  })));

  useFrame(() => {
     if(!mesh.current) return;
     
     particles.current.forEach((p, i) => {
         p.position.y -= p.velocity;
         // Reset if too low
         if(p.position.y < -10) {
             p.position.y = 20;
             p.position.x = (Math.random() - 0.5) * 30;
             p.position.z = (Math.random() - 0.5) * 30;
         }
         
         dummy.position.copy(p.position);
         dummy.scale.set(p.scale, p.scale, p.scale);
         dummy.rotation.x += 0.01;
         dummy.rotation.y += 0.01;
         
         dummy.updateMatrix();
         mesh.current!.setMatrixAt(i, dummy.matrix);
     });
     mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[0.1, 0]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
    </instancedMesh>
  );
};

export default Snow;
