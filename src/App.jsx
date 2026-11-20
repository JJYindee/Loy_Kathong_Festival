import React, { useRef } from 'react';
import { FestivalProvider } from './context/FestivalContext';
import CanvasContainer from './components/3d/CanvasContainer';
import Header from './components/ui/Header';
import FloatingActions from './components/ui/FloatingActions';
import KrathongModal from './components/ui/KrathongModal';
import CreateKrathongModal from './components/ui/CreateKrathongModal';
import LeaderboardModal from './components/ui/LeaderboardModal';
import HelpModal from './components/ui/HelpModal';

function AppContent() {
  const sceneManagerRef = useRef(null);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-festival-night select-none">
      {/* 3D WebGL Canvas Layer */}
      <CanvasContainer sceneManagerRef={sceneManagerRef} />

      {/* UI Overlay Layers */}
      <Header />
      <FloatingActions sceneManagerRef={sceneManagerRef} />
      
      {/* Modals & Dialogs */}
      <KrathongModal />
      <CreateKrathongModal />
      <LeaderboardModal />
      <HelpModal />
    </div>
  );
}

export default function App() {
  return (
    <FestivalProvider>
      <AppContent />
    </FestivalProvider>
  );
}
