import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Image, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store';
import { TreeMode, TREE_CONFIG } from '../types';

const Star = () => {
  const ref = useRef<THREE.Mesh>(null);
  const { mode, animationSpeed } = useStore();
  
  // Flat Star Geometry
  const starGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const points = 5;
    const outerRadius = 1;
    const innerRadius = 0.4;
    for (let i = 0; i < points * 2; i++) {
        const r = (i % 2 === 0) ? outerRadius : innerRadius;
        const angle = (i / (points * 2)) * Math.PI * 2;
        const x = Math.cos(angle - Math.PI / 2) * r;
        const y = Math.sin(angle - Math.PI / 2) * r;
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
    }
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 1 });
  }, []);

  const homePos = useMemo(() => new THREE.Vector3(0, TREE_CONFIG.height / 2 + 0.5, 0), []);
  const dispersePos = useMemo(() => new THREE.Vector3((Math.random()-0.5)*20, (Math.random()-0.5)*20+10, (Math.random()-0.5)*20), []);

  useFrame((state, delta) => {
    if (ref.current) {
      const isDispersed = mode === TreeMode.DISPERSE;
      const target = isDispersed ? dispersePos : homePos;
      ref.current.position.lerp(target, delta * (isDispersed ? 2 : 3) * animationSpeed);
      
      const scale = (isDispersed ? 0.5 : 1) + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      ref.current.scale.lerp(new THREE.Vector3(scale, scale, scale), delta * 5);

      if (isDispersed) {
          ref.current.rotation.x += delta;
          ref.current.rotation.y += delta;
      } else {
          ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0, delta * 2);
          ref.current.rotation.y += 0.02;
      }
    }
  });

  return (
    <mesh ref={ref} geometry={starGeometry} position={[0, TREE_CONFIG.height / 2 + 0.5, 0]}>
        <meshStandardMaterial color="#ffd700" emissive="#ffaa00" emissiveIntensity={2} roughness={0.2} metalness={0.8} />
    </mesh>
  );
};

const Polaroid = React.forwardRef<THREE.Group, { position: [number, number, number]; url: string, index: number, isHovered: boolean, isLocked: boolean }>(({ position, url, index, isHovered, isLocked }, ref) => {
  const { mode, animationSpeed, isHandDetected } = useStore();
  const internalRef = useRef<THREE.Group>(null);
  React.useImperativeHandle(ref, () => internalRef.current!);

  const randomRotation = useMemo(() => [(Math.random()-0.5)*0.5, (Math.random()-0.5)*0.5, (Math.random()-0.5)*0.5] as [number,number,number], []);
  const originalPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const explodeDir = useMemo(() => originalPos.clone().normalize().multiplyScalar(5 + Math.random() * 5), [originalPos]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
     if (!internalRef.current) return;
     
     if (isLocked) {
         // --- ZOOM TO TOP CENTER ---
         // Fixed relative to camera: Center X (0), Top Y (2.1), Front Z (-6)
         const targetPos = new THREE.Vector3(0, 2.1, -6);
         targetPos.applyMatrix4(state.camera.matrixWorld);

         internalRef.current.position.lerp(targetPos, delta * 10); 
         internalRef.current.scale.lerp(new THREE.Vector3(2.5, 2.5, 2.5), delta * 10);

         // --- BILLBOARD ROTATION (NO TILT) ---
         // Align with camera orientation, then spin 180 to face it
         dummy.quaternion.copy(state.camera.quaternion);
         dummy.rotateY(Math.PI);
         internalRef.current.quaternion.slerp(dummy.quaternion, delta * 15);
     } else {
         const targetPos = mode === TreeMode.DISPERSE ? originalPos.clone().add(explodeDir) : originalPos;
         internalRef.current.position.lerp(targetPos, delta * (mode===TreeMode.DISPERSE?2:3) * animationSpeed);
         internalRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 4);
         
         if (mode === TreeMode.ASSEMBLE) {
             const sway = isHandDetected ? 0 : 0.05; // No sway if hovering
             const targetRot = new THREE.Euler(randomRotation[0], randomRotation[1], randomRotation[2] + Math.sin(state.clock.elapsedTime + index) * sway);
             
             internalRef.current.rotation.x = THREE.MathUtils.lerp(internalRef.current.rotation.x, targetRot.x, delta * 3);
             internalRef.current.rotation.y = THREE.MathUtils.lerp(internalRef.current.rotation.y, targetRot.y, delta * 3);
             internalRef.current.rotation.z = THREE.MathUtils.lerp(internalRef.current.rotation.z, targetRot.z, delta * 3);
         } else {
             internalRef.current.rotation.x += delta;
             internalRef.current.rotation.y += delta;
         }
     }
  });

  const floatInt = (isLocked || isHandDetected) ? 0 : 0.5;

  return (
    <group ref={internalRef} rotation={[randomRotation[0], randomRotation[1], randomRotation[2]]}>
      <Float speed={2} rotationIntensity={floatInt} floatIntensity={floatInt} enabled={mode === TreeMode.ASSEMBLE}>
        <group name="polaroid-group">
          {/* Hitbox */}
          <mesh visible={false} userData={{ photoIndex: index }}><boxGeometry args={[1.5, 1.8, 0.2]} /></mesh>
          {/* Frame */}
          <mesh userData={{ photoIndex: index }}>
             <boxGeometry args={[1.2, 1.5, 0.02]} />
             <meshStandardMaterial color={isHovered || isLocked ? "#ffffee" : "#ffffff"} emissive={isHovered||isLocked?"#ffaa00":"#000000"} emissiveIntensity={isHovered||isLocked?0.2:0} roughness={0.8} />
          </mesh>
          {/* Front Photo */}
          <Image url={url} scale={[1, 1]} position={[0, 0.1, 0.011]} transparent opacity={0.9} />
          {/* Back Photo (Mirrored) */}
          <group rotation={[0, Math.PI, 0]} scale={[-1, 1, 1]} position={[0, 0, -0.011]}>
             <Image url={url} scale={[1, 1]} position={[0, 0.1, 0]} transparent opacity={0.9} />
          </group>
          <Text position={[0, -0.55, 0.02]} fontSize={0.1} color="black" anchorX="center" anchorY="middle" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff">
            {`Memory #${index + 1}`}
          </Text>
        </group>
      </Float>
    </group>
  );
});

export const Gallery = () => {
    const { isPinching, pinchCursor, setHoveredPhotoId, hoveredPhotoId } = useStore();
    const { camera, raycaster } = useThree();
    const itemsRef = useRef<(THREE.Group | null)[]>([]);
    const [lockedId, setLockedId] = useState<number | null>(null);

    const photos = useMemo(() => {
        const temp = [];
        const count = 12;
        for(let i=0; i<count; i++) {
            const y = (i / count) * (TREE_CONFIG.height * 0.7) - (TREE_CONFIG.height * 0.3);
            const r = ((1 - (y + TREE_CONFIG.height/2)/TREE_CONFIG.height) * TREE_CONFIG.radius) + 0.5;
            const angle = i * (Math.PI / 1.5);
            temp.push({ position: [Math.cos(angle)*r, y, Math.sin(angle)*r] as [number,number,number], url: `https://picsum.photos/seed/${i + 123}/300/300`, id: i });
        }
        return temp;
    }, []);

    useFrame(() => {
        if (isPinching) {
             if (lockedId === null && hoveredPhotoId !== null) setLockedId(hoveredPhotoId);
        } else {
             if (lockedId !== null) setLockedId(null);
        }

        // Disable raycasting if we have a lock to prevent jitter
        if (lockedId === null) {
            raycaster.setFromCamera(new THREE.Vector2(pinchCursor.x, pinchCursor.y), camera);
            const meshes: THREE.Object3D[] = [];
            itemsRef.current.forEach(group => group?.traverse(c => { if(c instanceof THREE.Mesh && c.userData.photoIndex !== undefined) meshes.push(c); }));
            
            const intersects = raycaster.intersectObjects(meshes);
            setHoveredPhotoId(intersects.length > 0 ? intersects[0].object.userData.photoIndex : null);
        } else {
            setHoveredPhotoId(lockedId);
        }
    });

    return (
        <group>
            {photos.map((p, i) => (
                <Polaroid key={p.id} ref={(el) => { itemsRef.current[i] = el; }} position={p.position} url={p.url} index={i} isHovered={hoveredPhotoId === i} isLocked={lockedId === i} />
            ))}
        </group>
    );
};

export const Decorations = () => ( <> <Star /> <Gallery /> </> );