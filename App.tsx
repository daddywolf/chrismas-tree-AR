import React, { Suspense } from 'react';
import Scene from './components/Scene';
import Overlay from './components/Overlay';
import GestureController from './components/GestureController';

function App() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      <GestureController />
      <Overlay />
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </main>
  );
}

export default App;
