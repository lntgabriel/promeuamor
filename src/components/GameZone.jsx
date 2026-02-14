// src/components/GameZone.jsx (VERSÃO CORRIGIDA E PERSONALIZADA)

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// AQUI ESTAVA FALTANDO O "Sparkles" 👇
import { Trophy, ArrowLeft, Gamepad2, Brain, Gift, Heart, Sparkles, Music } from 'lucide-react';

const themeColor = "#FACC15"; // Amarelo

// ===============================================
// 1. JOGO DA MEMÓRIA - Personalizado para vocês
// ===============================================
const MemoryGame = ({ onWin }) => {
  // Ícones do jogo baseados em coisas que vocês gostam
  const icons = [
    { icon: <Heart />, id: "heart" },          // Amor
    { icon: <Gamepad2 />, id: "game" },       // Jogos
    { icon: "🍕", id: "pizza" },                // Pizza que comeram
    { icon: <Music />, id: "music" },          // The Weeknd / Músicas
    { icon: "😺", id: "cat" },                  // O Fred
    { icon: "🥰", id: "loveface" },             // Carinho
    { icon: "🎸", id: "guitar" },              // Sua guitarra
    { icon: "🖥️", id: "pc" }                   // As calls no PC
  ];
  
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  
  useEffect(() => {
    // Embaralha e duplica os ícones
    const shuffled = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((item, id) => ({ id, item, key: id })); // key única para o React
    setCards(shuffled);
  }, []);

  const handleFlip = (cardKey) => {
    const flippedCard = cards.find(c => c.key === cardKey);
    // Impede de virar a mesma carta, cartas já resolvidas ou mais de 2
    if (flipped.length === 2 || solved.includes(flippedCard.item.id) || flipped.some(f => f.key === cardKey)) return;

    const newFlipped = [...flipped, flippedCard];
    setFlipped(newFlipped);
    
    if (newFlipped.length === 2) {
      if (newFlipped[0].item.id === newFlipped[1].item.id) {
        setSolved([...solved, newFlipped[0].item.id]);
        setFlipped([]);
        if (solved.length + 1 === icons.length) setTimeout(onWin, 500);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', maxWidth: '350px' }}>
      {cards.map(card => {
        const isFlipped = flipped.some(f => f.key === card.key) || solved.includes(card.item.id);
        return (
          <motion.div
            key={card.key}
            onClick={() => handleFlip(card.key)}
            animate={{ 
              rotateY: isFlipped ? 180 : 0, 
              backgroundColor: isFlipped ? themeColor : '#333' 
            }}
            transition={{ duration: 0.4 }}
            style={{
              height: '70px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', cursor: 'pointer', border: '1px solid #444', color: '#000',
              transformStyle: 'preserve-3d' // Essencial para a animação de virar
            }}
          >
            <div style={{ backfaceVisibility: 'hidden', position: 'absolute', color: '#fff' }}>
                <span style={{fontSize: '1rem'}}>❓</span>
            </div>
            <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <span>{card.item.icon}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// ===============================================
// 2. QUIZ - Personalizado para vocês
// ===============================================
const QuizGame = ({ onWin }) => {
  const questions = [
    { q: "Qual a cor favorita dela, que inspirou todo o site?", opts: ["Rosa", "Azul", "Amarelo"], a: 2 },
    { q: "Qual o apelido do personagem de 'Amor Doce' que ela gosta?", opts: ["Garoto do cabelo de fogo", "O rockeirinho", "Jogo do cara de cabelo vermelho"], a: 2 },
    { q: "Qual foi nossa maior conquista juntos até hoje?", opts: ["Virar pro-player de Brawl", "Fazer uma casa gigante no Minecraft", "Ficar 23 horas em call"], a: 2 },
    { q: "Quem eu amo mais nesse universo inteirinho?", opts: ["O Fred", "Minha guitarra", "Você, meu amor"], a: 2 }
  ];
  const [curr, setCurr] = useState(0);

  const handle = (i) => {
    if (i === questions[curr].a) {
        if (curr < questions.length - 1) setCurr(curr + 1);
        else onWin();
    } else {
        alert("KAKAKAKKAKAKA errou! Tenta de novo amor, sei que você sabe.");
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', background: '#222', padding: '20px', borderRadius: '20px', border: '1px solid #444' }}>
      <p style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '10px' }}>Pergunta {curr + 1}/{questions.length}</p>
      <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '20px', minHeight: '50px' }}>{questions[curr].q}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {questions[curr].opts.map((opt, i) => (
            <motion.button 
                key={i} 
                onClick={() => handle(i)} 
                whileHover={{ backgroundColor: '#444' }}
                whileTap={{ scale: 0.95 }}
                style={{ 
                    padding: '12px', 
                    borderRadius: '10px', 
                    border: 'none', 
                    background: '#333', 
                    color: '#fff', 
                    cursor: 'pointer',
                    textAlign: 'left'
                }}
            >
                {opt}
            </motion.button>
        ))}
      </div>
    </div>
  );
}

// ===============================================
// 3. MENU PRINCIPAL (ARCADE) E TELA DE VITÓRIA
// ===============================================
const GameZone = () => {
  const [game, setGame] = useState(null); 
  const [won, setWon] = useState(false);

  const handleWin = () => setWon(true);
  const reset = () => { setGame(null); setWon(false); };

  if (won) {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}
        >
             <motion.div initial={{scale:0}} animate={{scale:1}} transition={{ delay: 0.2, type: 'spring' }} style={{ color: themeColor, marginBottom: '20px' }}><Trophy size={80}/></motion.div>
             <h2 style={{ color: '#fff', fontSize: '2rem', fontFamily: "'Lobster', cursive" }}>Você Venceu, minha campeã!</h2>
             <p style={{ color: '#ccc' }}>Como prêmio, você ganhou o que eu mais quero te dar:</p>
             <h3 style={{ color: themeColor, fontSize: '1.5rem', margin: '10px 0', textTransform: 'uppercase' }}>UM MONTÃO DE BEIJOS MEUS! 😘</h3>
             <button onClick={reset} style={{ padding: '10px 30px', borderRadius: '50px', background: themeColor, color: '#000', border: 'none', fontWeight: 'bold', marginTop: '20px' }}>Jogar de Novo</button>
        </motion.div>
    )
  }

  if (game) {
    return (
        <div style={{ minHeight: '100vh', padding: '6rem 20px 100px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button onClick={reset} style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}><ArrowLeft /> Voltar</button>
            <h2 style={{ fontFamily: "'Lobster', cursive", fontSize: '2.5rem', color: themeColor, marginBottom: '2rem', textAlign: 'center' }}>
                {game === 'quiz' ? 'Quiz do Nosso Amor' : 'Memória da Gente'}
            </h2>
            {game === 'quiz' && <QuizGame onWin={handleWin} />}
            {game === 'memory' && <MemoryGame onWin={handleWin} />}
        </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: '6rem 20px 100px 20px', backgroundColor: '#0a0a0a' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Gamepad2 size={40} color={themeColor} style={{ marginBottom: '10px' }}/>
            <h2 style={{ fontFamily: "'Lobster', cursive", fontSize: '3.5rem', color: '#fff', margin: 0, textShadow: `0 0 15px ${themeColor}30` }}>Arcade do Amor</h2>
            <p style={{ color: '#888' }}>Feito pra gente se divertir, bebê!</p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', margin: '0 auto' }}>
            <GameCard title="Quiz do Casal" icon={<Brain color="#fff"/>} desc="Será que você sabe tudo sobre nós?" onClick={() => setGame('quiz')} color="#e11d48" />
            <GameCard title="Jogo da Memória" icon={<Heart color="#fff"/>} desc="Ache os pares que combinam com a gente" onClick={() => setGame('memory')} color="#3b82f6" />
            <div style={{ background: '#222', borderRadius: '20px', padding: '20px', textAlign: 'center', border: '1px dashed #444', opacity: 0.5 }}>
                <Gift size={30} color="#888" style={{ marginBottom: '10px' }}/>
                <h3 style={{ color: '#888', margin: 0, fontSize: '1rem' }}>Em breve...</h3>
                <p style={{ fontSize: '0.8rem', color: '#555' }}>Raspadinha de Beijos</p>
            </div>
        </div>
    </div>
  );
};

const GameCard = ({ title, icon, desc, onClick, color }) => (
    <motion.div whileTap={{ scale: 0.98 }} whileHover={{ y: -5 }} onClick={onClick} style={{ background: '#1a1a1a', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px', border: `1px solid ${color}80`, cursor: 'pointer', boxShadow: `0 4px 15px ${color}10` }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            {icon}
        </div>
        <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>{title}</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#888' }}>{desc}</p>
        </div>
    </motion.div>
);

export default GameZone;