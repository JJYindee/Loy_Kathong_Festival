import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CONTESTANTS } from '../utils/initialData';
import { festivalAudio } from '../utils/audioSynth';
import confetti from 'canvas-confetti';
import {
  seedInitialKrathongs,
  subscribeToKrathongs,
  saveKrathongToFirestore,
  incrementVoteInFirestore
} from '../services/firebase';

const FestivalContext = createContext();

export function FestivalProvider({ children }) {
  const [krathongs, setKrathongs] = useState(() => {
    const saved = localStorage.getItem('loy_krathong_contestants');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CONTESTANTS;
      }
    }
    return INITIAL_CONTESTANTS;
  });

  const [selectedKrathong, setSelectedKrathong] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [focusKrathongId, setFocusKrathongId] = useState(null);

  // Single vote restriction (1 user = 1 vote only)
  const [votedKrathongId, setVotedKrathongId] = useState(() => {
    return localStorage.getItem('loy_krathong_single_voted_id') || null;
  });

  // Sync with Firestore Real-time Database
  useEffect(() => {
    // 1. Seed initial 20 krathongs if Firestore is empty
    seedInitialKrathongs();

    // 2. Subscribe to real-time Firestore updates
    const unsubscribe = subscribeToKrathongs(
      (items) => {
        if (items && items.length > 0) {
          setKrathongs(items);
        }
      },
      (err) => {
        console.warn('Fallback to local cache due to Firestore listener error:', err);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Sync to localStorage as offline fallback
  useEffect(() => {
    localStorage.setItem('loy_krathong_contestants', JSON.stringify(krathongs));
  }, [krathongs]);

  useEffect(() => {
    if (votedKrathongId) {
      localStorage.setItem('loy_krathong_single_voted_id', votedKrathongId);
    } else {
      localStorage.removeItem('loy_krathong_single_voted_id');
    }
  }, [votedKrathongId]);

  const toggleMusic = () => {
    if (isPlayingMusic) {
      festivalAudio.stop();
      setIsPlayingMusic(false);
    } else {
      festivalAudio.start();
      setIsPlayingMusic(true);
    }
  };

  // Vote rule: 1 person can vote only 1 time in total!
  const voteKrathong = async (id) => {
    if (votedKrathongId) {
      return {
        success: false,
        message: 'คุณได้ใช้สิทธิ์โหวตไปแล้ว (สามารถโหวตได้ 1 คน 1 ครั้ง)'
      };
    }

    // Optimistic UI update
    setKrathongs(prev =>
      prev.map(item => (item.id === id ? { ...item, votes: item.votes + 1 } : item))
    );
    setVotedKrathongId(id);

    if (selectedKrathong && selectedKrathong.id === id) {
      setSelectedKrathong(prev => ({ ...prev, votes: prev.votes + 1 }));
    }

    // Play chime sound & confetti
    festivalAudio.playVoteBell();
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#ff4081', '#00e676', '#ff9100', '#7c4dff']
      });
    } catch (e) {}

    // Atomic update in Firestore
    try {
      await incrementVoteInFirestore(id);
    } catch (err) {
      console.warn('Error incrementing vote in Firestore:', err);
    }

    return { success: true };
  };

  const resetMyVote = () => {
    if (votedKrathongId) {
      setKrathongs(prev =>
        prev.map(item =>
          item.id === votedKrathongId ? { ...item, votes: Math.max(0, item.votes - 1) } : item
        )
      );
    }
    setVotedKrathongId(null);
  };

  const addKrathong = async ({ name, wish, photo, style }) => {
    const newId = `user_${Date.now()}`;
    const newKrathong = {
      id: newId,
      name,
      wish,
      photo,
      style: style || 'pink_lotus',
      votes: 0,
      isUserCreated: true,
      createdAt: Date.now()
    };

    // Optimistically add to scene
    setKrathongs(prev => [newKrathong, ...prev]);
    setFocusKrathongId(newId);
    setSelectedKrathong(newKrathong);
    setIsCreateModalOpen(false);

    // Audio chime & confetti
    festivalAudio.playVoteBell();
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#ffd700', '#ffeb3b', '#ff4081', '#40c4ff']
      });
    } catch (e) {}

    // Persist to Cloud Firestore
    try {
      await saveKrathongToFirestore(newKrathong);
    } catch (err) {
      console.warn('Error saving krathong to Firestore:', err);
    }

    return newKrathong;
  };

  const openKrathongById = (id) => {
    const found = krathongs.find(k => k.id === id);
    if (found) {
      setSelectedKrathong(found);
      setFocusKrathongId(id);
    }
  };

  return (
    <FestivalContext.Provider
      value={{
        krathongs,
        selectedKrathong,
        setSelectedKrathong,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isLeaderboardOpen,
        setIsLeaderboardOpen,
        isHelpOpen,
        setIsHelpOpen,
        isPlayingMusic,
        toggleMusic,
        focusKrathongId,
        setFocusKrathongId,
        votedKrathongId,
        hasVoted: Boolean(votedKrathongId),
        voteKrathong,
        resetMyVote,
        addKrathong,
        openKrathongById
      }}
    >
      {children}
    </FestivalContext.Provider>
  );
}

export function useFestival() {
  const context = useContext(FestivalContext);
  if (!context) {
    throw new Error('useFestival must be used within a FestivalProvider');
  }
  return context;
}
