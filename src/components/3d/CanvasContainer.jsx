import React, { useEffect, useRef } from 'react';
import { SceneManager } from './SceneManager';
import { useFestival } from '../../context/FestivalContext';

export default function CanvasContainer({ sceneManagerRef }) {
  const containerRef = useRef(null);
  const { krathongs, setSelectedKrathong, focusKrathongId } = useFestival();

  useEffect(() => {
    if (!containerRef.current) return;

    const manager = new SceneManager(containerRef.current, (krathongData) => {
      setSelectedKrathong(krathongData);
    });

    if (sceneManagerRef) {
      sceneManagerRef.current = manager;
    }

    return () => {
      manager.destroy();
      if (sceneManagerRef) {
        sceneManagerRef.current = null;
      }
    };
  }, []);

  // Sync krathongs when krathongs list updates
  useEffect(() => {
    if (sceneManagerRef && sceneManagerRef.current) {
      sceneManagerRef.current.syncKrathongs(krathongs);
    }
  }, [krathongs, sceneManagerRef]);

  // Focus camera when target id changes
  useEffect(() => {
    if (focusKrathongId && sceneManagerRef && sceneManagerRef.current) {
      sceneManagerRef.current.focusOnKrathong(focusKrathongId);
    }
  }, [focusKrathongId, sceneManagerRef]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none"
    />
  );
}
