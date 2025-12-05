export enum TreeMode {
  ASSEMBLE = 'ASSEMBLE',
  DISPERSE = 'DISPERSE',
}

export interface HandGestureState {
  mode: TreeMode;
  rotationVelocity: number; // -1 (left) to 1 (right)
  pitchVelocity: number; // -1 (down) to 1 (up)
  isHandDetected: boolean;
}

export interface PhotoData {
  id: string;
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

export const TREE_CONFIG = {
  particleCount: 25000, // Balanced for performance/visuals
  color: '#2f5e41',
  glowColor: '#4fffa5',
  height: 12,
  radius: 5,
};

export const GESTURE_THRESHOLDS = {
  disperseDistance: 0.15, // Threshold for open palm vs fist based on finger spread
};
