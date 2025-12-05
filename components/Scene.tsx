import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import ChristmasTree from './ChristmasTree';
import { Decorations } from './Decorations';
import Snow from './Snow';
import { useStore } from '../store';

const CameraController = () => {
  const { rotationY, pitchX } = useStore();
  const controlsRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (controlsRef.current) {
        // Map accumulated rotationY (from Face Yaw) to Azimuthal Angle
        const targetAzimuth = -rotationY * 2; 
        const targetPolar = (Math.PI / 2) + (pitchX * 1.5); 
        
        const curAzimuth = controlsRef.current.getAzimuthalAngle();
        const curPolar = controlsRef.current.getPolarAngle();

        controlsRef.current.setAzimuthalAngle(THREE.MathUtils.lerp(curAzimuth, targetAzimuth, delta * 2));
        controlsRef.current.setPolarAngle(THREE.MathUtils.lerp(curPolar, targetPolar, delta * 2));
        controlsRef.current.update();
    }
  });

  return (
    <OrbitControls ref={controlsRef} enableZoom={true} enablePan={false} minPolarAngle={Math.PI/3} maxPolarAngle={Math.PI/1.5} minDistance={10} maxDistance={25} />
  );
};

const Scene: React.FC = () => {
  const { particleCount, faceTranslation } = useStore();

  return (
    <div className="w-full h-screen absolute top-0 left-0">
      <Canvas dpr={[1, 2]} gl={{ alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={50} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 20, -10]} angle={0.3} intensity={2} color="#4fffa5" />

        <group>
            {/* Parallax Group driven by Face Position */}
            <group position={[faceTranslation.x, -4 + faceTranslation.y, 0]}>
                <ChristmasTree key={particleCount} />
                <Decorations />
            </group>
        </group>
        <Snow />
        <CameraController />

        <EffectComposer enableNormalPass={false}>
          <Bloom luminanceThreshold={1.2} mipmapBlur intensity={1.5} radius={0.6} />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default Scene;