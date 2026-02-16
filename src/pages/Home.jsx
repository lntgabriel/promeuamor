// src/pages/Home.jsx (VERSÃO FINAL COM TUDO INTEGRADO)

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Importe o novo componente que criamos!
import LoveTreeIntro from '../components/LoveTreeIntro'; 
import Hero from '../components/Hero'; 
import HerUniverse from '../components/HerUniverse'; 
import PhotoGallery from '../components/PhotoGallery'; 
import GameZone from '../components/GameZone';
import BottomNav from '../components/BottomNav'; 
import Pets from '../components/Pets'; 
import Heir from '../components/VirtualSon';



const Home = () => {
  // Novo estado para controlar a tela de abertura
  const [showLoveTree, setShowLoveTree] = useState(true); 
  
  const [activeTab, setActiveTab] = useState('story');
  const [showNav, setShowNav] = useState(false); 
  const [storyFinished, setStoryFinished] = useState(false);

  const handleFinishStory = () => {
      setStoryFinished(true);
      setTimeout(() => {
        setShowNav(true);
        setActiveTab('universe');
      }, 500); 
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'universe': return <HerUniverse />;
      case 'gallery': return <><PhotoGallery /><Pets /></>;
      case 'game': return <GameZone />;
      default: return <HerUniverse />;
      case 'streak': return <Heir />;

    }
  };

  // Se a tela da árvore estiver ativa, mostre-a.
  if (showLoveTree) {
    return <LoveTreeIntro onFinish={() => setShowLoveTree(false)} />;
  }

  // Se não, o site continua normal...
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