// src/components/HerUniverse.jsx (VERSÃO FINAL COM TEXTOS PERSONALIZADOS)

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, Crown, Music, Tv, Gamepad2 } from 'lucide-react';

// Destaques Amarelos (A cor favorita dela!)
const themeColor = "#FACC15"; 

// ========================================================
// ITENS DO "UNIVERSO" DELA - AGORA COM A NOSSA CARA
// ========================================================
const items = [
  { 
    id: 1, name: "The Weeknd", subtitle: "often é a sua cara",
    type: "Música", 
    icon: <Music/>,
    spotifyId: "4PhsKqMdgMEUSstTDAmMpg", 
    image: "/icons/theweeknd.png", 
    desc: "não tem como ouvir e não lembrar de você, igualzinho a você. Essa música é o puro suco do que a gente conversa né? KAKAKAKAKAKA"
  },
  { 
    id: 2, name: "Weak Hero Class 1", subtitle: "sua série favoritaaaaaaaaaa",
    type: "Série", 
    icon: <Tv/>,
    image: "/icons/weakhero.png",
    desc: "é sua série favoritaaaaaaaaaa, e eu não imaginava q vc ia me fazer gostar de séries coreanas KAKAKKAKAK."
  },
  { 
    id: 3, name: "Nossa Família", subtitle: "Nossos filhos",
    type: "Amor", 
    icon: <Heart />, // Usando o ícone do Lucide
    image: "/pets/fred-cama.jpg", // Foto do Fred pra começar
    desc: "a gente sabe que a casa não é a mesma sem eles"
  },
  { 
    id: 4, name: "Brawl Stars", subtitle: "vc é a melhor jogadora de todas aqui",
    type: "Game", 
    icon: <Gamepad2/>,
    image: "/icons/brawlstars.png", 
    desc: "vc fica impressionada e com raiva ao mesmo tempo KAKAKAKAKA. Você joga muito, me carrega sempre. Mas o melhor de tudo é ser o melhor casal de todosodstosodsodo"
  },
  { 
    id: 5, name: "Tokyo Revengers", subtitle: "chifuyu vccvcvcvcvcvcvc",
    type: "Anime", 
    icon: <Tv/>,
    image: "/icons/tokyo.png",
    desc: "vc combina demais com a vibe da Toman. Você ia botar ordem la meu amor"
  },
  { 
    id: 6, name: "Roblox", subtitle: "viciotrauma",
    type: "Game",
    icon: <Gamepad2/>,
    image: "/icons/roblox.png",
    desc: "nossos jogos de madrugada não seriam a mesma coisa sem a gente estressados por causa dele, ou vc sendo banida por uma foto da igreja KAKAKAKAKAKA"
  },
  { 
    id: 7, name: "Coraline", subtitle: "vcieueueuaueauu",
    type: "Filme", 
    icon: <Tv/>,
    image: "/icons/coraline.png",
    desc: "."
  }
];


// Adicionei os jogos de vocês e outras coisas que ela gosta!
const satellites = [
  { name: "Minecraft", emoji: "⛏️" },
  { name: "Genshin", emoji: "✨" },
  { name: "Pintar", emoji: "🎨" }, { name: "Tom & Jerry", emoji: "🐭" },
  { name: "Garfield", emoji: "🐱" }, { name: "Música", emoji: "🎵" }, { name: "TikTok", emoji: "📱" },
];


const HerUniverse = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [hearts, setHearts] = useState([]);

  const spawnHearts = (e) => {
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    if (!clientX) return;

    const newHeart = { id: Date.now(), x: clientX, y: clientY };
    setHearts(prev => [...prev, newHeart]);
    setTimeout(() => setHearts(prev => prev.filter(h => h.id !== newHeart.id)), 1000);
  };

  return (
    <div style={{ 
      backgroundColor: '#0a0a0a', padding: '6rem 0 8rem 0', minHeight: '100vh', 
      position: 'relative', overflow: 'hidden', 
      background: 'radial-gradient(circle at top, #282800 0%, #000000 100%)' 
    }}>
      
      <AnimatePresence>
        {hearts.map(h => (
            <motion.div
                key={h.id}
                initial={{ opacity: 1, y: h.y, x: h.x, scale: 0 }}
                animate={{ opacity: 0, y: h.y - 150, x: h.x + (Math.random()*40-20), scale: 2 }}
                exit={{ opacity: 0 }}
                style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9999, top: 0, left: 0, color: themeColor }}
            >
                <Heart fill={themeColor} size={20} />
            </motion.div>
        ))}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '3rem', padding: '0 20px' }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${themeColor}`, borderRadius: '20px', padding: '6px 16px', marginBottom: '10px', background: `${themeColor}10` }}>
             <Crown size={16} color={themeColor} fill={themeColor}/> 
             <span style={{ fontSize: '0.8rem', color: themeColor, textTransform: 'uppercase', fontWeight: 'bold' }}>Coisas de você</span>
        </div>
        <h2 style={{ fontFamily: "'Lobster', cursive", fontSize: '3.5rem', color: '#fff', margin: 0, textShadow: `0 0 20px ${themeColor}50` }}>
            Seu Universo
        </h2>
      </motion.div>

      <div style={{ padding: '0 20px', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {items.map((item) => (
            <motion.div
               key={item.id}
               layoutId={`card-${item.id}`}
               whileTap={{ scale: 0.98 }}
               whileHover={{ y: -5 }}
               onClick={(e) => { setSelectedItem(item); spawnHearts(e); }}
               initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
               style={{
                   position: 'relative', cursor: 'pointer',
                   background: 'rgba(255, 255, 255, 0.03)',
                   backdropFilter: 'blur(10px)',
                   borderRadius: '24px', padding: '1rem',
                   border: `1px solid ${themeColor}40`,
                   display: 'flex', alignItems: 'center', gap: '1rem',
                   boxShadow: `0 8px 30px rgba(0,0,0,0.4), 0 0 10px ${themeColor}15`
               }}
            >
                <div style={{ 
                    width: '70px', height: '70px', borderRadius: '18px', background: '#000',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    overflow: 'hidden', padding: item.icon ? '0px' : '5px', border: '1px solid #333'
                }}>
                   {item.icon ? <div style={{color: themeColor}}>{item.icon}</div> : <img src={item.iconImg || item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: "'Poppins', sans-serif", fontWeight: '700', color: '#fff' }}>
                        {item.name}
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.subtitle}</p>
                </div>
                <div style={{ color: themeColor }}><Sparkles size={18}/></div>
            </motion.div>
        ))}
      </div>

      <div style={{ marginTop: '4rem', padding: '0 20px', maxWidth: '600px', margin: '4rem auto 0 auto' }}>
          <h3 style={{textAlign: 'center', color: '#888', marginBottom: '1.5rem', fontFamily: "'Poppins', sans-serif", fontWeight: '400'}}>E muito mais...</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
              {satellites.map((s, i) => (
                  <motion.div
                    key={i} onClick={(e) => spawnHearts(e)} whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                    style={{
                        padding: '8px 12px', background: '#111', borderRadius: '16px', border: '1px solid #333',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        cursor: 'pointer'
                    }}
                  >
                      <span style={{ fontSize: '1.2rem' }}>{s.emoji}</span>
                      <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{s.name}</span>
                  </motion.div>
              ))}
          </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedItem(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9998, backdropFilter: 'blur(5px)' }} />
            <motion.div
              layoutId={`card-${selectedItem.id}`}
              initial={{ y: '100%' }} animate={{ y: '0%' }} exit={{ y: '100%' }} transition={{type: 'spring', damping: 25, stiffness: 180}}
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, height: '90vh',
                background: '#121212', borderTopLeftRadius: '30px', borderTopRightRadius: '30px',
                zIndex: 9999, overflowY: 'auto', borderTop: `2px solid ${themeColor}`,
                boxShadow: `0 -10px 50px ${themeColor}30`, maxWidth: '600px', margin: '0 auto'
              }}
            >
                <div style={{ width: '100%', height: '40vh', position: 'relative' }}>
                    <img src={selectedItem.image} style={{ width: '100%', height: '100%', objectFit: 'cover', borderTopLeftRadius: '28px', borderTopRightRadius: '28px' }} />
                    <button onClick={() => setSelectedItem(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(0,0,0,0.6)', borderRadius: '50%', padding: '10px', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
                    <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '100px', background: 'linear-gradient(to top, #121212, transparent)' }} />
                </div>
                <div style={{ padding: '0 30px 50px 30px', position: 'relative', top: '-50px' }}>
                    <h2 style={{ fontFamily: "'Lobster', cursive", fontSize: '3rem', margin: 0, lineHeight: 1, color: themeColor, textShadow: `0 0 10px ${themeColor}50` }}>{selectedItem.name}</h2>
                    <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1rem', color: '#ccc', lineHeight: '1.7', marginTop: '20px' }}>{selectedItem.desc}</p>
                    {selectedItem.spotifyId && (
                        <div style={{ marginTop: '30px', border: `1px solid ${themeColor}40`, padding: '5px', borderRadius: '12px', background: '#000' }}>
                             <iframe style={{ borderRadius: '8px' }} src={`https://open.spotify.com/embed/track/${selectedItem.spotifyId}?utm_source=generator&theme=0`} width="100%" height="152" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                        </div>
                    )}
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HerUniverse;