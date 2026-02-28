// src/components/HerUniverse.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, Crown, Music, Tv, Gamepad2, Star } from 'lucide-react';

const themeColor = "#FACC15"; 

// ========================================================
// DADOS (Mantive os seus, só ajustei para o novo visual)
// ========================================================
const items = [
  { 
    id: 1, name: "The Weeknd", subtitle: "o dono da sua playlist",
    type: "Música", icon: <Music size={18}/>,
    spotifyId: "4PhsKqMdgMEUSstTDAmMpg", 
    image: "/icons/theweeknd.png", // Tenha certeza que essa img existe!
    desc: "Não tem como ouvir e não lembrar de você. Essa música é o puro suco do que a gente conversa né? KAKAKAKAKAKA."
  },
  { 
    id: 2, name: "Weak Hero Class", subtitle: "sua obsessão",
    type: "Série", icon: <Tv size={18}/>,
    image: "/icons/weakhero.png",
    desc: "É sua série favoritaaaaaaaaaa, e eu não imaginava q vc ia me fazer gostar de séries coreanas KAKAKKAKAK."
  },
  { 
    id: 3, name: "Nossa Família", subtitle: "Nossos filhos",
    type: "Amor", icon: <Heart size={18}/>,
    image: "/pets/fred-cama.jpeg", 
    desc: "a gente tem tantos e tantos filhos, e olha q vamos ter muito mais, nao da pra por todo mundo na mesma foto mas pelo menos coloquei o fred e o bred que importam muito pra nós"
  },
  { 
    id: 4, name: "Brawl Stars", subtitle: "melhor jogadora",
    type: "Game", icon: <Gamepad2 size={18}/>,
    image: "/icons/brawlstars.png", 
    desc: "Vc fica impressionada e com raiva ao mesmo tempo KAKAKAKAKA. Você joga muito, me carrega sempre. Mas o melhor de tudo é ser o melhor casal do planeta."
  },
  { 
    id: 5, name: "Tokyo Revengers", subtitle: "chifuyu lover",
    type: "Anime", icon: <Tv size={18}/>,
    image: "/icons/tokyo.png",
    desc: "Vc ia bater em todo mundo lá meu amor."
  },
  { 
    id: 6, name: "Roblox", subtitle: "vício da madrugada",
    type: "Game", icon: <Gamepad2 size={18}/>,
    image: "/icons/roblox.png",
    desc: "Nossos jogos de madrugada não seriam a mesma coisa sem a gente estressados ou vc sendo banida por uma foto da igreja KAKAKAKAKAKA."
  },
  { 
    id: 7, name: "Coraline", subtitle: "o outro mundo",
    type: "Filme", icon: <Tv size={18}/>,
    image: "/icons/coraline.png",
    desc: "Você ama esse filme e eu amo vc"
  }
];

const satellites = [
  { name: "Minecraft", emoji: "⛏️" }, { name: "Genshin", emoji: "✨" },
  { name: "Pintar", emoji: "🎨" }, { name: "Tom & Jerry", emoji: "🐭" },
  { name: "Garfield", emoji: "🐱" }, { name: "TikTok", emoji: "📱" },
  { name: "Açaí", emoji: "💜" }, { name: "Dormir", emoji: "💤" }
];

// Componente de Partículas de Fundo (Estrelas)
const StarBackground = () => {
    // Cria 20 estrelas em posições aleatórias
    const stars = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 3 + 2
    }));

    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {stars.map(s => (
                <motion.div
                    key={s.id}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: s.duration, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                        position: 'absolute', top: s.top, left: s.left,
                        width: s.size, height: s.size, borderRadius: '50%',
                        background: '#fff', boxShadow: `0 0 ${s.size * 2}px ${themeColor}`
                    }}
                />
            ))}
        </div>
    )
}

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
      backgroundColor: '#050505', minHeight: '100vh', 
      position: 'relative', paddingBottom: '120px',
      background: 'radial-gradient(circle at 50% 0%, #1a1a00 0%, #000000 100%)' 
    }}>
      
      <StarBackground />

      {/* TÍTULO FLUTUANTE */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', paddingTop: '4rem', paddingBottom: '2rem', position: 'relative', zIndex: 10 }}
      >
        <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            border: `1px solid ${themeColor}30`, borderRadius: '50px', 
            padding: '8px 20px', marginBottom: '15px', 
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)',
            boxShadow: `0 0 15px ${themeColor}20`
        }}>
             <Crown size={14} color={themeColor} fill={themeColor}/> 
             <span style={{ fontSize: '0.75rem', color: '#fff', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 'bold' }}>O Mundo Dela</span>
        </div>
        <h2 style={{ 
            fontFamily: "'Lobster', cursive", fontSize: '4rem', color: '#fff', margin: 0, 
            textShadow: `0 0 30px ${themeColor}40, 0 0 10px ${themeColor}` 
        }}>
            Seu Universo
        </h2>
        <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '5px' }}>Tudo que faz você ser <b>você</b> ✨</p>
      </motion.div>

      {/* GRID MASONRY / GALERIA */}
      <div style={{ 
          padding: '0 20px', maxWidth: '800px', margin: '0 auto', 
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' // 2 colunas no celular
      }}>
        {items.map((item, index) => (
            <motion.div
               key={item.id}
               layoutId={`card-${item.id}`}
               whileTap={{ scale: 0.95 }}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
               onClick={(e) => { setSelectedItem(item); spawnHearts(e); }}
               style={{
                   position: 'relative', cursor: 'pointer',
                   height: index % 3 === 0 ? '240px' : '180px', // Alturas variadas para ficar dinâmico
                   borderRadius: '24px', overflow: 'hidden',
                   border: `1px solid ${themeColor}20`,
                   background: '#111',
                   gridColumn: index === 0 ? 'span 2' : 'span 1' // O primeiro item ocupa a largura toda (Destaque)
               }}
            >
                {/* Imagem de Fundo com Zoom suave */}
                <motion.img 
                    src={item.image} 
                    alt={item.name}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} 
                />
                
                {/* Degradê para o texto aparecer */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000 0%, transparent 80%)' }} />

                {/* Conteúdo do Card */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '15px' }}>
                    <div style={{ 
                        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4,
                        color: themeColor, fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 'bold' 
                    }}>
                        {item.icon} {item.type}
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: "'Poppins', sans-serif", fontWeight: '700', color: '#fff', lineHeight: 1.1 }}>
                        {item.name}
                    </h3>
                </div>

                {/* Brilho no canto */}
                <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: 6 }}>
                    <Sparkles size={14} color={themeColor} />
                </div>
            </motion.div>
        ))}
      </div>

      {/* SATÉLITES (TAGS) */}
      <div style={{ marginTop: '3rem', padding: '0 20px', maxWidth: '600px', margin: '3rem auto 0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: '1.5rem', opacity: 0.6 }}>
            <div style={{height: 1, width: 30, background: '#fff'}}></div>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Outras Paixões</span>
            <div style={{height: 1, width: 30, background: '#fff'}}></div>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
              {satellites.map((s, i) => (
                  <motion.div
                    key={i} onClick={(e) => spawnHearts(e)} whileHover={{ scale: 1.1, rotate: Math.random() * 10 - 5 }} whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05, type: 'spring' }}
                    style={{
                        padding: '8px 16px', background: 'rgba(255,255,255,0.05)', 
                        borderRadius: '20px', border: '1px solid #333',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        cursor: 'pointer', backdropFilter: 'blur(4px)'
                    }}
                  >
                      <span>{s.emoji}</span>
                      <span style={{ fontSize: '0.85rem', color: '#ddd', fontWeight: '500' }}>{s.name}</span>
                  </motion.div>
              ))}
          </div>
      </div>

      {/* EFEITO DE CORAÇÃOZINHO AO CLICAR */}
      <AnimatePresence>
        {hearts.map(h => (
            <motion.div
                key={h.id}
                initial={{ opacity: 1, y: h.y, x: h.x, scale: 0 }}
                animate={{ opacity: 0, y: h.y - 100, x: h.x + (Math.random()*40-20), scale: 2, rotate: Math.random()*90-45 }}
                exit={{ opacity: 0 }}
                style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9999, top: 0, left: 0, color: themeColor }}
            >
                <Heart fill={themeColor} size={24} />
            </motion.div>
        ))}
      </AnimatePresence>

      {/* MODAL DE DETALHES */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedItem(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9998, backdropFilter: 'blur(8px)' }} />
            <motion.div
              layoutId={`card-${selectedItem.id}`}
              style={{
                position: 'fixed', top: '5%', bottom: '5%', left: '5%', right: '5%',
                background: '#121212', borderRadius: '32px', overflow: 'hidden',
                zIndex: 9999, border: `1px solid ${themeColor}30`,
                boxShadow: `0 0 50px ${themeColor}20`, maxWidth: '500px', margin: '0 auto',
                display: 'flex', flexDirection: 'column'
              }}
            >
                {/* Imagem Grande no Topo */}
                <div style={{ flex: 1, position: 'relative', minHeight: '40%' }}>
                    <img src={selectedItem.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => setSelectedItem(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '8px', border: 'none', color: 'white', cursor: 'pointer', backdropFilter: 'blur(4px)' }}><X /></button>
                    <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '150px', background: 'linear-gradient(to top, #121212 10%, transparent)' }} />
                    
                    <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
                        <div style={{ display: 'inline-flex', gap: 6, background: themeColor, color: '#000', padding: '4px 10px', borderRadius: 10, fontSize: '0.7rem', fontWeight: 'bold', marginBottom: 8 }}>
                           {selectedItem.icon} {selectedItem.type}
                        </div>
                        <h2 style={{ fontFamily: "'Lobster', cursive", fontSize: '2.5rem', margin: 0, lineHeight: 1, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{selectedItem.name}</h2>
                    </div>
                </div>

                {/* Texto e Conteúdo */}
                <div style={{ padding: '25px', background: '#121212', flexShrink: 0 }}>
                    <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.95rem', color: '#ccc', lineHeight: '1.6', margin: 0 }}>
                        {selectedItem.desc}
                    </p>
                    
                    {selectedItem.spotifyId && (
                        <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #333' }}>
                             <iframe style={{ borderRadius: '12px' }} src={`https://open.spotify.com/embed/track/${selectedItem.spotifyId}?utm_source=generator&theme=0`} width="100%" height="80" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
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