// src/components/Hero.jsx (VERSÃO FINAL E CORRIGIDA)

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react'; 
import DrawingHeart from './DrawingHeart';

// ==================================================================================
// 🎬 NOSSA HISTÓRIA (ROTEIRO 100% PERSONALIZADO)
// ==================================================================================

const timeline = [
  // --- ATO 1: O CHARME ---
  { type: 'intro', duration: 4000 },
  
  { type: 'short-text', text: "oiii bebe", duration: 2500 },
  { type: 'short-text', text: "eu so quero q vc saiba algumas coisas", duration: 3000 },
  
  // Primeira foto: Impacto
  { 
    type: 'image', 
    src: '/capa.jpg', 
    caption: "sabia q vc é a mulher mais linda do mundo?", 
    duration: 5000 
  },

  { type: 'short-text', text: "vc sabia que", duration: 2500 },
  { type: 'short-text', text: "voce é a pessoa mais especial de todas?", duration: 3000 },

  // --- ATO 2: ELOGIOS & ELA ---
  { 
    type: 'image', 
    src: '/fotos-dela/foto-12.jpg', 
    caption: "além de ser a mais gostosa", 
    duration: 4000 
  },
  { type: 'short-text', text: "vc é a mais legal, e engraçada de todas e mais intelignete", duration: 3000 },
  { 
    type: 'image', 
    src: '/fotos-dela/foto-2.jpg', 
    caption: "e voce é tudo pra mim", 
    duration: 4000 
  },
  { 
    type: 'image', 
    src: '/fotos-dela/foto-3.jpg', 
    caption: "KAKAKAKAKAKKAK de qualquer jeito vc é linda", 
    duration: 4000 
  },
  
  // --- ATO 3: A FAMÍLIA (PETS) ---
  { type: 'short-text', text: "e não é só sobre nós", duration: 2500 },
  { type: 'short-text', text: "é sobre vc e tudo ao seu redor", duration: 2500 },
  
  { 
    type: 'image', 
    src: '/pets/bred.jpg', 
    caption: "o Bred", 
    duration: 3000 
  },
  { 
    type: 'image', 
    src: '/pets/valente.jpg', 
    caption: "o Valente", 
    duration: 3000 
  },
  { 
    type: 'image', 
    src: '/pets/billy.jpg', 
    caption: "o Billy", 
    duration: 3000 
  },
  // Homenagem ao Trevo
  { 
    type: 'image', 
    src: '/pets/trevo.jpg', 
    caption: "E o Trevo Trevo Trevo", 
    duration: 5000 
  },

  // --- ATO 4: MOMENTOS DIVERTIDOS/ALEATÓRIOS ---
  { type: 'short-text', text: "e as pessoas q vc também deixa feliz", duration: 3000 },
  { 
    type: 'image', 
    src: '/momentos/aleatoria-1.jpg', // Atenção: jpeg aqui
    duration: 3500 
  },
  { 
    type: 'image', 
    src: '/fotos-dela/foto-5.jpg', 
    duration: 4000 
  },
  { 
    type: 'image', 
    src: '/momentos/aleatoria-3.jpg', 
    duration: 4000 
  },
  { 
    type: 'image', 
    src: '/momentos/aleatoria-4.jpg', 
    duration: 4000 
  },
  { 
    type: 'image', 
    src: '/momentos/aleatoria-5.jpg', 
    duration: 4000 
  },
  { 
    type: 'image', 
    src: '/momentos/aleatoria-6.jpg', 
    duration: 4000 
  },
  { 
    type: 'image', 
    src: '/momentos/aleatoria-7.jpg', 
    duration: 4000 
  },

  // --- ATO 5: O GRAND FINALE (TEXTÃO) ---
  { type: 'short-text', text: "mas antes de continuar", duration: 2500 },
  { type: 'short-text', text: "le isso aqui rapidinho", duration: 3000 },

  { 
    type: 'long-text', 
    title: "Para o amor da minha vida",
    paragraphs: [
      "eu não sou muito bom palavras neKAKAKAKAKAKA, mas eu queria que você soubesse, meu amor, que cada segundo com você, até nas calls de madrugada, são os melhores da minha vida.",
        "Você chegou e meu deus, transformou tudo. Me deu um propósito novo, uma vontade de ser melhor a cada dia, pra gente poder logo logo ter nossa casa, nossos filhos, nosso cachorro e nosso gato.",
        "Obrigado por ser minha melhor amiga, minha m, e o amor da minha vida. Eu não vejo a hora de te abraçar, te beijar e fazer tudo que a gente sempre conversa.",
        "Eu te amo muito, muito, muito. Pra sempre.",
    ]
  },

  // Abertura do site
  { type: 'short-text', text: "agora sim meu amor", duration: 2000 },
  { type: 'short-text', text: "é um pouquinho sobre voce", duration: 3000 },
];


const Hero = ({ onFinish }) => {
  const [index, setIndex] = useState(0);
  const currentSlide = timeline[index];

  const handleNext = () => {
    if (index < timeline.length - 1) {
      setIndex(prev => prev + 1);
    } else {
      // Quando a timeline acabar, ele chama a função mágica do Home.jsx!
      if (onFinish) {
        onFinish();
      }
    }
  };
  
  useEffect(() => {
    if (currentSlide.type === 'long-text') return; // Espera clique no botão

    const time = currentSlide.duration || 3000;
    const timer = setTimeout(() => handleNext(), time);
    return () => clearTimeout(timer);
  }, [index, currentSlide]);

  // --- O FILME RODANDO ---
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, background: '#000', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
    }}>
      {/* Efeito de Estrelas no Fundo */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
        {[...Array(20)].map((_, i) => (
          <motion.div key={i}
             animate={{ y: [0, -30, 0], opacity: [0.2, 0.7, 0.2] }}
             transition={{ duration: Math.random() * 5 + 3, repeat: Infinity, delay: Math.random() }}
             style={{
                 position: 'absolute', width: '2px', height: '2px', background: '#fff', borderRadius: '50%',
                 top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`
             }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {/* Intro Coração */}
        {currentSlide.type === 'intro' && (
          <motion.div key="intro" exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }} transition={{ duration: 1 }}>
            <DrawingHeart />
          </motion.div>
        )}

        {/* Texto Curto */}
        {currentSlide.type === 'short-text' && (
          <motion.h2 
            key={`txt-${index}`}
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(5px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(5px)' }} transition={{ duration: 0.8 }}
            style={{ 
              fontFamily: "'Lobster', cursive", fontSize: '2.5rem', textAlign: 'center', 
              padding: '0 2rem', textShadow: '0 0 25px rgba(248,113,113,0.3)', width: '100%' 
            }}
          >
            {currentSlide.text}
          </motion.h2>
        )}

        {/* Texto Longo Interativo */}
        {currentSlide.type === 'long-text' && (
          <motion.div 
            key="long-text"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
            style={{ 
              width: '100%', height: '100%', display: 'flex', flexDirection: 'column', 
              alignItems: 'center', justifyContent: 'center', padding: '2rem', 
              background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' 
            }}
          >
             <Heart size={32} color="#f87171" style={{ marginBottom: '1.5rem' }} />
             {currentSlide.title && <h3 style={{ fontFamily: "'Lobster', cursive", fontSize: '2rem', marginBottom: '1.5rem', color: '#f87171' }}>{currentSlide.title}</h3>}
             
             <div style={{ textAlign: 'center', maxHeight: '55vh', overflowY: 'auto', marginBottom: '2rem', width: '100%' }}>
                {currentSlide.paragraphs.map((p, idx) => (
                    <p key={idx} style={{ 
                      fontFamily: "'Poppins', sans-serif", fontSize: '1rem', marginBottom: '1rem', 
                      lineHeight: '1.6', color: '#ddd' 
                    }}>{p}</p>
                ))}
             </div>
             
             <motion.button 
                onClick={handleNext} 
                whileTap={{ scale: 0.95 }}
                animate={{ boxShadow: ['0 0 0px #f87171', '0 0 20px #f87171', '0 0 0px #f87171'] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ 
                  padding: '14px 35px', borderRadius: '50px', border: 'none', 
                  background: '#f87171', color: '#fff', fontSize: '1rem', fontWeight: 'bold',
                  display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'
                }}
             >
                Continuar <ArrowRight size={18} />
             </motion.button>
          </motion.div>
        )}

        {/* Imagem Porta-Retrato */}
        {currentSlide.type === 'image' && (
          <motion.div
            key={`img-${index}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleNext}
            style={{ 
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', 
              alignItems: 'center', justifyContent: 'center', padding: '20px' 
            }}
          >
            {/* Fundo Desfocado */}
            <div style={{ 
               position: 'absolute', inset: 0, backgroundImage: `url(${currentSlide.src})`,
               backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(35px) brightness(0.4)', zIndex: -1 
            }} />

            {/* A Imagem em si */}
            <motion.img 
              src={currentSlide.src} 
              alt="Momento"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1, type: 'spring' }}
              style={{
                maxHeight: '65vh', maxWidth: '100%', borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)'
              }}
            />
            
            {currentSlide.caption && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <motion.p 
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                    style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.2rem', fontWeight: '500', fontStyle: 'italic', textShadow: '0 2px 5px rgba(0,0,0,1)' }}
                >
                    "{currentSlide.caption}"
                </motion.p>
                </div>
            )}
            
            <small style={{ position: 'absolute', bottom: 20, opacity: 0.5, fontSize: '0.7rem' }}>Toque para continuar</small>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Progresso */}
      <div style={{ 
        position: 'absolute', bottom: 0, left: 0, height: '3px', background: '#f87171', 
        width: `${((index + 1) / timeline.length) * 100}%`, transition: 'width 0.5s ease' 
      }} />
    </div>
  );
};

export default Hero;