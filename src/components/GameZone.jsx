// src/components/GameZone.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowLeft, Gamepad2, Brain, Gift, Heart, Sparkles, Music, X, Cat, ShoppingBag, MessageCircle, Send, Trash2, PenTool } from 'lucide-react';
import confetti from 'canvas-confetti';

const themeColor = "#FACC15"; // Amarelo

// ===============================================
// 1. MURAL DO AMOR (NOVA FUNCIONALIDADE)
// ===============================================
const LoveWall = ({ onBack }) => {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const [author, setAuthor] = useState("ele"); // Alternar entre Gabriel e Amor

  // Carregar notas salvas ao iniciar
  useEffect(() => {
    const savedNotes = localStorage.getItem('love_notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      // Notas iniciais de exemplo
      setNotes([
        { id: 1, text: "eeeeeeeeeeeeeba", author: "eu", date: new Date().toLocaleDateString(), color: "#fef3c7" },
        { id: 2, text: "Te amo mais que tudo", author: "eu", date: new Date().toLocaleDateString(), color: "#ffe4e6" }
      ]);
    }
  }, []);

  // Salvar notas sempre que mudar
  useEffect(() => {
    localStorage.setItem('love_notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!input.trim()) return;
    
    const colors = ["#fef3c7", "#ffe4e6", "#dbeafe", "#f3e8ff", "#dcfce7"]; // Amarelo, Rosa, Azul, Roxo, Verde (Pastel)
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomRotate = Math.floor(Math.random() * 10) - 5; // Rotação leve entre -5 e 5 graus

    const newNote = {
      id: Date.now(),
      text: input,
      author: author,
      date: new Date().toLocaleDateString(),
      color: randomColor,
      rotate: randomRotate
    };

    setNotes([newNote, ...notes]);
    setInput("");
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Área de Input */}
      <div style={{ background: '#222', padding: '20px', borderRadius: '20px', border: '1px solid #444' }}>
        <h3 style={{ color: '#fff', fontFamily: "'Lobster', cursive", marginBottom: '15px' }}>Deixe um recadinho:</h3>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button 
            onClick={() => setAuthor("ele")} 
            style={{ flex: 1, padding: '8px', borderRadius: '8px', border: author === 'ele' ? `2px solid ${themeColor}` : '1px solid #444', background: author === 'ele' ? `${themeColor}20` : 'transparent', color: author === 'ele' ? themeColor : '#888', cursor: 'pointer' }}
          >
            Sou o Gabriel
          </button>
          <button 
            onClick={() => setAuthor("Amor da Minha Vida")} 
            style={{ flex: 1, padding: '8px', borderRadius: '8px', border: author !== 'ele' ? '2px solid #e11d48' : '1px solid #444', background: author !== 'ele' ? '#e11d4820' : 'transparent', color: author !== 'ele' ? '#e11d48' : '#888', cursor: 'pointer' }}
          >
            eu ❤️
          </button>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Escreva algo aqui, ${author}...`}
          style={{ width: '100%', height: '80px', borderRadius: '10px', background: '#333', border: 'none', padding: '10px', color: '#fff', fontFamily: 'inherit', resize: 'none', marginBottom: '10px' }}
        />
        <button 
          onClick={addNote}
          style={{ width: '100%', padding: '12px', background: themeColor, color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Send size={18} /> Postar no Mural
        </button>
      </div>

      {/* O Mural (Grid de Post-its) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px', paddingBottom: '50px' }}>
        <AnimatePresence>
          {notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: note.rotate || 0 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05, zIndex: 10, rotate: 0 }}
              style={{
                background: note.color,
                padding: '15px',
                borderRadius: '5px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                color: '#333',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '140px',
                position: 'relative'
              }}
            >
              <p style={{ fontSize: '0.9rem', lineHeight: '1.4', marginBottom: '10px', fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif" }}>
                "{note.text}"
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: '5px' }}>
                <div style={{ fontSize: '0.7rem', color: '#666' }}>
                  <strong>{note.author}</strong><br/>
                  {note.date}
                </div>
                <button 
                  onClick={() => deleteNote(note.id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.5 }}
                >
                  <Trash2 size={14} color="#000" />
                </button>
              </div>
              
              {/* "Alfinete" do Post-it */}
              <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 2px 2px rgba(0,0,0,0.2)' }}></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ===============================================
// 2. JOGO DA MEMÓRIA
// ===============================================
const MemoryGame = ({ onWin }) => {
  const icons = [
    { icon: <Heart />, id: "heart" },
    { icon: <Gamepad2 />, id: "game" },
    { icon: "🍕", id: "pizza" },
    { icon: <Music />, id: "music" },
    { icon: <Cat />, id: "fred" },
    { icon: "🌵", id: "mabel" },
    { icon: "🎸", id: "guitar" },
    { icon: <ShoppingBag />, id: "shopee" }
  ];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);

  useEffect(() => {
    const shuffled = [...icons, ...icons].sort(() => Math.random() - 0.5).map((item, id) => ({ id, item, key: id }));
    setCards(shuffled);
  }, []);

  const handleFlip = (cardKey) => {
    const flippedCard = cards.find(c => c.key === cardKey);
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
            animate={{ rotateY: isFlipped ? 180 : 0, backgroundColor: isFlipped ? themeColor : '#333' }}
            transition={{ duration: 0.4 }}
            style={{ height: '70px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', cursor: 'pointer', border: '1px solid #444', color: '#000', transformStyle: 'preserve-3d' }}
          >
            <div style={{ backfaceVisibility: 'hidden', position: 'absolute', color: '#fff' }}><span style={{ fontSize: '1.5rem' }}>❓</span></div>
            <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}><span>{card.item.icon}</span></div>
          </motion.div>
        );
      })}
    </div>
  );
};

// ===============================================
// 3. QUIZ
// ===============================================
const QuizGame = ({ onWin }) => {
  const questions = [
    { q: "Qual o nome da nossa plantinha (que eu sou pai e você é mãe)?", opts: ["Jurema", "Mabel", "Florzinha"], a: 1 },
    { q: "Qual jogo a gente viciou e eu gastei robux pra ficar bonita?", opts: ["Minecraft", "Free Fire", "Roblox"], a: 2 },
    { q: "Quem é o serzinho que vive me mordendo e arranhando?", opts: ["O Fred", "Um cachorro bravo", "Eu mesma"], a: 0 },
    { q: "Onde a gente se conheceu e passou por vários perrengues?", opts: ["Na rua", "No CEDESP", "No Shopping"], a: 1 },
    { q: "O que a gente concorda que é ruim puro (sem adicionais)?", opts: ["Açaí", "Sorvete", "Chocolate"], a: 0 },
    { 
    q: "Qual comida ela postou que estava comendo (a primeira do dia) às 20:42?", 
    opts: ["Pizza de ontem", "Escondidinho de carne", "Torrada com Danone"], 
    a: 1
  },
  
  ];
  const [curr, setCurr] = useState(0);
  const handle = (i) => {
    if (i === questions[curr].a) {
      if (curr < questions.length - 1) setCurr(curr + 1); else onWin();
    } else {
      alert("tenta de novoooooooooo");
    }
  };
  return (
    <div style={{ width: '100%', maxWidth: '400px', background: '#222', padding: '20px', borderRadius: '20px', border: '1px solid #444' }}>
      <p style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '10px' }}>Pergunta {curr + 1}/{questions.length}</p>
      <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '20px', minHeight: '50px' }}>{questions[curr].q}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {questions[curr].opts.map((opt, i) => (
          <motion.button key={i} onClick={() => handle(i)} whileHover={{ backgroundColor: '#444' }} whileTap={{ scale: 0.95 }} style={{ padding: '12px', borderRadius: '10px', border: 'none', background: '#333', color: '#fff', cursor: 'pointer', textAlign: 'left', fontSize: '1rem' }}>{opt}</motion.button>
        ))}
      </div>
    </div>
  );
};

// ===============================================
// 4. JOGO DA VELHA
// ===============================================
const TicTacToe = ({ onWin }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const checkWinner = (squares) => {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };
  const handleClick = (i) => {
    if (checkWinner(board) || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    if (checkWinner(newBoard)) setTimeout(onWin, 500);
  };
  const reset = () => { setBoard(Array(9).fill(null)); setIsXNext(true); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px', background: '#444', padding: '5px', borderRadius: '10px' }}>
        {board.map((val, i) => (
          <motion.div key={i} onClick={() => handleClick(i)} whileTap={{ scale: 0.9 }} style={{ width: '80px', height: '80px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', cursor: 'pointer', borderRadius: '5px', color: val === 'X' ? '#FACC15' : '#E11D48' }}>{val}</motion.div>
        ))}
      </div>
      <button onClick={reset} style={{ padding: '8px 20px', borderRadius: '20px', background: '#333', color: '#fff', border: 'none' }}>Reiniciar Jogo</button>
    </div>
  );
};

// ===============================================
// 5. MAIN COMPONENT
// ===============================================
const GameZone = () => {
  const [game, setGame] = useState(null);
  const [won, setWon] = useState(false);
  const handleWin = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setWon(true);
  };
  const reset = () => { setGame(null); setWon(false); };

  if (won) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} style={{ color: themeColor, marginBottom: '20px' }}><Trophy size={80} /></motion.div>
        <h2 style={{ color: '#fff', fontSize: '2rem', fontFamily: "'Lobster', cursive" }}>Parabéns, meu amor!</h2>
        <p style={{ color: '#ccc', marginTop: '10px' }}>Você mandou muito bem!</p>
        <h3 style={{ color: themeColor, fontSize: '1.5rem', margin: '20px 0', textTransform: 'uppercase' }}>GANHOU UM BEIJÃO! 😘</h3>
        <button onClick={reset} style={{ padding: '12px 30px', borderRadius: '50px', background: themeColor, color: '#000', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>Voltar ao Arcade</button>
      </motion.div>
    );
  }

  if (game) {
    return (
      <div style={{ minHeight: '100vh', padding: '6rem 20px 100px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button onClick={reset} style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}><ArrowLeft /> Voltar</button>
        <h2 style={{ fontFamily: "'Lobster', cursive", fontSize: '2.5rem', color: themeColor, marginBottom: '2rem', textAlign: 'center' }}>
          {game === 'quiz' ? 'Quizzzzzzzzzzzz' : game === 'memory' ? 'Memóriaaaaaaaaa' : game === 'wall' ? 'mensages' : 'jogodavelhaaaaaa'}
        </h2>
        {game === 'quiz' && <QuizGame onWin={handleWin} />}
        {game === 'memory' && <MemoryGame onWin={handleWin} />}
        {game === 'tictactoe' && <TicTacToe onWin={handleWin} />}
        {game === 'wall' && <LoveWall />}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '6rem 20px 100px 20px', backgroundColor: '#0a0a0a' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <Gamepad2 size={40} color={themeColor} style={{ marginBottom: '10px' }} />
        <h2 style={{ fontFamily: "'Lobster', cursive", fontSize: '3.5rem', color: '#fff', margin: 0, textShadow: `0 0 15px ${themeColor}30` }}>Arcade do Amor</h2>
        <p style={{ color: '#888' }}>Feito pra gente se divertir, bebê!</p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', margin: '0 auto' }}>
        <GameCard title="Mensages" icon={<MessageCircle color="#fff" />} desc="Deixe um recadinho fofo pra mim!" onClick={() => setGame('wall')} color="#8b5cf6" />
        <GameCard title="Quizzzzzzzzzz" icon={<Brain color="#fff" />} desc="Perguntas sobre nossa história" onClick={() => setGame('quiz')} color="#e11d48" />
        <GameCard title="Jogo da Memória" icon={<Heart color="#fff" />} desc="Encontre os pares das coisas que amamos" onClick={() => setGame('memory')} color="#3b82f6" />
        <GameCard title="Jogodavlehaaaaaaa" icon={<X color="#fff" />} desc="Quem ganhar escolhe o filme!" onClick={() => setGame('tictactoe')} color="#10b981" />
        
        <div style={{ background: '#222', borderRadius: '20px', padding: '20px', textAlign: 'center', border: '1px dashed #444', opacity: 0.5 }}>
          <Gift size={30} color="#888" style={{ marginBottom: '10px' }} />
          <h3 style={{ color: '#888', margin: 0, fontSize: '1rem' }}>Em breve...</h3>
          <p style={{ fontSize: '0.8rem', color: '#555' }}>Raspadinha de Beijos</p>
        </div>
      </div>
    </div>
  );
};

const GameCard = ({ title, icon, desc, onClick, color }) => (
  <motion.div whileTap={{ scale: 0.98 }} whileHover={{ y: -5 }} onClick={onClick} style={{ background: '#1a1a1a', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px', border: `1px solid ${color}80`, cursor: 'pointer', boxShadow: `0 4px 15px ${color}10` }}>
    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{icon}</div>
    <div>
      <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: '0.9rem', color: '#888' }}>{desc}</p>
    </div>
  </motion.div>
);

export default GameZone;