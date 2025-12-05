import { create } from 'zustand';
import { TreeMode } from './types';

interface AppState {
  mode: TreeMode;
  rotationY: number; // Accumulated rotation from Face Yaw
  pitchX: number;
  isAiReady: boolean;
  isHandDetected: boolean;
  isFaceDetected: boolean;
  isPinching: boolean;
  pinchCursor: { x: number; y: number }; // NDC [-1, 1] for Raycasting
  cursorPosition: { x: number; y: number }; // Screen [0, 1] for UI
  faceTranslation: { x: number; y: number }; // Parallax translation
  treeColor: string;
  particleCount: number;
  animationSpeed: number;
  titleText: string;
  subtitleText: string;
  hoveredPhotoId: number | null;
  
  // Actions
  setMode: (mode: TreeMode) => void;
  setAiReady: (ready: boolean) => void;
  setHandDetected: (detected: boolean) => void;
  setFaceDetected: (detected: boolean) => void;
  setIsPinching: (pinching: boolean) => void;
  setPinchCursor: (x: number, y: number) => void;
  setCursorPosition: (x: number, y: number) => void;
  setFaceTranslation: (x: number, y: number) => void;
  updateRotation: (deltaY: number, deltaX: number) => void;
  setTreeColor: (color: string) => void;
  setParticleCount: (count: number) => void;
  setAnimationSpeed: (speed: number) => void;
  setTitleText: (text: string) => void;
  setSubtitleText: (text: string) => void;
  setHoveredPhotoId: (id: number | null) => void;
}

export const useStore = create<AppState>((set) => ({
  mode: TreeMode.ASSEMBLE,
  rotationY: 0,
  pitchX: 0,
  isAiReady: false,
  isHandDetected: false,
  isFaceDetected: false,
  isPinching: false,
  pinchCursor: { x: 0, y: 0 },
  cursorPosition: { x: 0.5, y: 0.5 },
  faceTranslation: { x: 0, y: 0 },
  treeColor: '#2f5e41',
  particleCount: 25000,
  animationSpeed: 1.5,
  titleText: 'HOLOGRAPHIC XMAS',
  subtitleText: 'AR AI Experience',
  hoveredPhotoId: null,

  setMode: (mode) => set({ mode }),
  setAiReady: (ready) => set({ isAiReady: ready }),
  setHandDetected: (detected) => set({ isHandDetected: detected }),
  setFaceDetected: (detected) => set({ isFaceDetected: detected }),
  setIsPinching: (pinching) => set({ isPinching: pinching }),
  setPinchCursor: (x, y) => set({ pinchCursor: { x, y } }),
  setCursorPosition: (x, y) => set({ cursorPosition: { x, y } }),
  setFaceTranslation: (x, y) => set({ faceTranslation: { x, y } }),
  updateRotation: (deltaY, deltaX) =>
    set((state) => ({
      rotationY: state.rotationY + deltaY,
      pitchX: Math.max(-0.5, Math.min(0.5, state.pitchX + deltaX)),
    })),
  setTreeColor: (color) => set({ treeColor: color }),
  setParticleCount: (count) => set({ particleCount: count }),
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  setTitleText: (text) => set({ titleText: text }),
  setSubtitleText: (text) => set({ subtitleText: text }),
  setHoveredPhotoId: (id) => set({ hoveredPhotoId: id }),
}));