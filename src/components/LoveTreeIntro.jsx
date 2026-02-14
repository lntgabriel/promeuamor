// src/components/LoveTreeIntro.jsx (Sua nova tela de abertura)

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Play } from 'lucide-react';

const LoveTreeIntro = ({ onFinish }) => {
  // A data que tudo começou... (Ajuste se precisar!)
  const startDate = new Date('2026-01-16T00:00:00');
  const [timeElapsed, setTimeElapsed] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [showButton, setShowButton] = useState(false);

  // Lógica do contador que atualiza a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeElapsed({ d, h, m, s });
    }, 1000);

    // Mostra o botão de "Entrar" depois de uns segundos
    const buttonTimer = setTimeout(() => setShowButton(true), 4000);

    return () => {
      clearInterval(timer);
      clearTimeout(buttonTimer);
    };
  }, []);

  // Lógica das folhas de coração caindo
  const hearts = [...Array(25)].map((_, i) => ({
    id: i,
    x: Math.random() * 100, // Posição horizontal
    duration: Math.random() * 5 + 8, // Duração da queda
    delay: Math.random() * 10, // Atraso para começar a cair
    size: Math.random() * 15 + 10, // Tamanho
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        backgroundColor: '#FDF2F2', // Um fundo bege bem clarinho, igual do vídeo
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Folhas caindo */}
      {hearts.map(h => (
        <motion.div
          key={h.id}
          initial={{ top: '-20%', left: `${h.x}%`, opacity: 0 }}
          animate={{ top: '120%', opacity: [0.8, 1, 0] }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', color: '#e11d48' }}
        >
          <Heart fill="#e11d48" size={h.size} />
        </motion.div>
      ))}

      {/* Conteúdo Principal */}
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 1 }}>
        <p style={{ fontFamily: "'Poppins', sans-serif", color: '#555', fontSize: '1.2rem' }}>Para o amor da minha vida</p>
        
        <img src="https://png.pngtree.com/png-vector/20250226/ourmid/pngtree-tree-heart-pink-and-red-illustration-love-branch-png-image_15604018.png" alt="Árvore do Amor" style={{ maxWidth: '80%', maxHeight: '40vh', margin: '1rem 0' }} />

        <p style={{ fontFamily: "'Poppins', sans-serif", color: '#555', fontSize: '1rem', marginBottom: '0.5rem' }}>Nosso amor começou há...</p>
        <div style={{
          display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'baseline', fontFamily: "'Poppins', sans-serif", fontWeight: 'bold', color: '#333'
        }}>
          <div><span style={{ fontSize: '2.5rem' }}>{String(timeElapsed.d).padStart(2, '0')}</span><small> dias</small></div>
          <div><span style={{ fontSize: '2.5rem' }}>{String(timeElapsed.h).padStart(2, '0')}</span><small>h</small></div>
          <div><span style={{ fontSize: '2.5rem' }}>{String(timeElapsed.m).padStart(2, '0')}</span><small>m</small></div>
          <div><span style={{ fontSize: '2.5rem' }}>{String(timeElapsed.s).padStart(2, '0')}</span><small>s</small></div>
        </div>
      </motion.div>

      {/* Botão de Entrar */}
      <AnimatePresence>
        {showButton && (
          <motion.button
            onClick={onFinish}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              position: 'absolute', bottom: '8%',
              background: '#f87171', color: 'white',
              border: 'none', borderRadius: '50px',
              padding: '12px 30px', fontSize: '1rem',
              fontWeight: 'bold', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '10px'
            }}
          >
            Começar <Play size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LoveTreeIntro;