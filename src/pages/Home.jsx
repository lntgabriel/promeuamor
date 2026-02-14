// src/pages/Home.jsx (VERSÃO CORRIGIDA)

import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import HerUniverse from '../components/HerUniverse';
import PhotoGallery from '../components/PhotoGallery';
import GameZone from '../components/GameZone';
import BottomNav from '../components/BottomNav';
import Pets from '../components/Pets';
import { AnimatePresence, motion } from 'framer-motion';

const Home = () => {
  const [activeTab, setActiveTab] = useState('story');
  const [showNav, setShowNav] = useState(false);
  const [storyFinished, setStoryFinished] = useState(false);

  // Função mágica que o Hero vai chamar quando o filme acabar
  const handleFinishStory = () => {
    setStoryFinished(true);
    // Pequeno delay para a transição ficar suave
    setTimeout(() => {
      setShowNav(true);
      setActiveTab('universe');
    }, 500); // Meio segundo de respiro
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'universe':
        return <HerUniverse />;
      case 'gallery':
        return (
          <>
            <PhotoGallery />
            <Pets />
          </>
        );
      case 'game':
        return <GameZone />;
      default:
        return <HerUniverse />; // Tela padrão
    }
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
      <AnimatePresence>
        {!storyFinished && (
          <motion.div
            key="hero-story"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Hero onFinish={handleFinishStory} />
          </motion.div>
        )}
      </AnimatePresence>

      {storyFinished && renderContent()}
      
      {showNav && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}
    </div>
  );
};

export default Home;