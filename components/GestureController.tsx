import React, { useEffect, useRef } from 'react';
import { FilesetResolver, HandLandmarker, FaceLandmarker } from '@mediapipe/tasks-vision';
import { useStore } from '../store';
import { TreeMode } from '../types';

const GestureController: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { 
    setMode, 
    updateRotation, 
    setAiReady, 
    setHandDetected, 
    setFaceDetected,
    setIsPinching,
    setPinchCursor,
    setCursorPosition,
    setFaceTranslation
  } = useStore();
  
  const lastVideoTime = useRef(-1);
  const requestRef = useRef<number>(0);
  
  // Debounce logic for hand gestures
  const gestureHistory = useRef<string[]>([]);
  const lastMode = useRef<TreeMode>(TreeMode.ASSEMBLE);

  // Smoothing refs
  const cursorSmooth = useRef({ x: 0, y: 0 });
  const faceTranslationSmooth = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let handLandmarker: HandLandmarker | null = null;
    let faceLandmarker: FaceLandmarker | null = null;
    let stream: MediaStream | null = null;

    const setupMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        
        // 1. Hand Tracking (Interaction: Disperse, Assemble, Pinch)
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });

        // 2. Face Tracking (Navigation: Rotate, Parallax)
        faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numFaces: 1
        });

        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: "user"
            } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener('loadeddata', predictWebcam);
        }
        setAiReady(true);
      } catch (error) {
        console.error("Error initializing MediaPipe:", error);
      }
    };

    const predictWebcam = () => {
      if (!handLandmarker || !faceLandmarker || !videoRef.current) return;
      
      const video = videoRef.current;
      if (video.currentTime !== lastVideoTime.current) {
        lastVideoTime.current = video.currentTime;
        const startTimeMs = performance.now();
        
        const handResults = handLandmarker.detectForVideo(video, startTimeMs);
        const faceResults = faceLandmarker.detectForVideo(video, startTimeMs);

        // --- HAND LOGIC ---
        if (handResults.landmarks && handResults.landmarks.length > 0) {
          setHandDetected(true);
          const landmarks = handResults.landmarks[0];
          const wrist = landmarks[0];
          const middleFingerMCP = landmarks[9];

          // Scale Invariant Calculation
          const handScale = Math.sqrt(
             Math.pow(middleFingerMCP.x - wrist.x, 2) +
             Math.pow(middleFingerMCP.y - wrist.y, 2) +
             Math.pow(middleFingerMCP.z - wrist.z, 2)
          );

          // Calculate Finger Extension
          const tips = [4, 8, 12, 16, 20]; 
          let totalTipDist = 0;
          tips.forEach(idx => {
            const tip = landmarks[idx];
            totalTipDist += Math.sqrt(
                Math.pow(tip.x - wrist.x, 2) +
                Math.pow(tip.y - wrist.y, 2) +
                Math.pow(tip.z - wrist.z, 2)
            );
          });
          const avgTipDist = totalTipDist / 5;
          const extensionRatio = avgTipDist / (handScale || 0.1);

          // Detect Open Palm vs Fist
          let detectedGesture: TreeMode | null = null;
          if (extensionRatio > 1.6) detectedGesture = TreeMode.DISPERSE;
          else if (extensionRatio < 1.3) detectedGesture = TreeMode.ASSEMBLE;

          if (detectedGesture) {
              gestureHistory.current.push(detectedGesture);
              if (gestureHistory.current.length > 8) gestureHistory.current.shift();

              const disperseCount = gestureHistory.current.filter(g => g === TreeMode.DISPERSE).length;
              const assembleCount = gestureHistory.current.filter(g => g === TreeMode.ASSEMBLE).length;

              if (disperseCount > 6 && lastMode.current !== TreeMode.DISPERSE) {
                  setMode(TreeMode.DISPERSE);
                  lastMode.current = TreeMode.DISPERSE;
              } else if (assembleCount > 6 && lastMode.current !== TreeMode.ASSEMBLE) {
                  setMode(TreeMode.ASSEMBLE);
                  lastMode.current = TreeMode.ASSEMBLE;
              }
          }

          // Detect Pinch
          const thumbTip = landmarks[4];
          const indexTip = landmarks[8];
          const pinchDistRaw = Math.sqrt(
            Math.pow(thumbTip.x - indexTip.x, 2) +
            Math.pow(thumbTip.y - indexTip.y, 2) +
            Math.pow(thumbTip.z - indexTip.z, 2)
          );
          
          const pinchThreshold = handScale * 0.4; // Generous threshold
          const isPinch = pinchDistRaw < pinchThreshold;
          setIsPinching(isPinch);

          // Cursor Position
          const cursorSource = isPinch ? 
              { x: (thumbTip.x + indexTip.x)/2, y: (thumbTip.y + indexTip.y)/2 } :
              { x: indexTip.x, y: indexTip.y };

          // Map to NDC (Mirrored)
          const targetNDCX = (1 - cursorSource.x) * 2 - 1;
          const targetNDCY = -(cursorSource.y * 2) + 1;

          cursorSmooth.current.x += (targetNDCX - cursorSmooth.current.x) * 0.3;
          cursorSmooth.current.y += (targetNDCY - cursorSmooth.current.y) * 0.3;

          setPinchCursor(cursorSmooth.current.x, cursorSmooth.current.y);
          setCursorPosition((cursorSmooth.current.x + 1) / 2, (1 - cursorSmooth.current.y) / 2);

        } else {
          setHandDetected(false);
          setIsPinching(false);
          gestureHistory.current = [];
        }

        // --- FACE LOGIC ---
        if (faceResults.faceLandmarks && faceResults.faceLandmarks.length > 0) {
            setFaceDetected(true);
            const fl = faceResults.faceLandmarks[0];
            const nose = fl[4];
            const leftEar = fl[234];
            const rightEar = fl[454];
            
            // 1. Rotation (Yaw)
            const midX = (leftEar.x + rightEar.x) / 2;
            const rawYaw = nose.x - midX; // Negative = Look Right (Physically)
            
            const ROTATION_SENSITIVITY = 1.5; 
            const DEADZONE = 0.015;

            if (Math.abs(rawYaw) > DEADZONE) {
                // If I look Right (nose < mid), rawYaw is Negative.
                // I want tree to rotate Right. This means Camera Orbits Left.
                // OrbitControls Azimuth Increasing = Camera Moves Left.
                // So Negative Yaw -> Positive Rotation Input.
                updateRotation(-rawYaw * ROTATION_SENSITIVITY, 0);
            }

            // 2. Parallax Translation
            // Map 0.5 (center) to 0. 
            const targetX = (0.5 - nose.x) * 8; 
            const targetY = (0.5 - nose.y) * 4;
            
            faceTranslationSmooth.current.x += (targetX - faceTranslationSmooth.current.x) * 0.05;
            faceTranslationSmooth.current.y += (targetY - faceTranslationSmooth.current.y) * 0.05;
            
            setFaceTranslation(faceTranslationSmooth.current.x, faceTranslationSmooth.current.y);

        } else {
            setFaceDetected(false);
        }
      }
      requestRef.current = requestAnimationFrame(predictWebcam);
    };

    setupMediaPipe();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (handLandmarker) handLandmarker.close();
      if (faceLandmarker) faceLandmarker.close();
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [setMode, updateRotation, setAiReady, setHandDetected, setFaceDetected, setIsPinching, setPinchCursor, setCursorPosition, setFaceTranslation]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="fixed top-0 left-0 w-full h-full object-cover -z-10 opacity-70" 
      style={{ transform: 'scaleX(-1)' }} 
    />
  );
};

export default GestureController;