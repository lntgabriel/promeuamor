// src/components/GameZone.jsx (VERSÃO DEUS - QUIZ DINÂMICO + MURAL + 6 JOGOS)

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowLeft, Gamepad2, Brain, Gift, Heart, Sparkles, Music, X, Cat, ShoppingBag, PenTool, MessageSquare, Send, Trash2, HelpCircle, MousePointer2, Lock, User, Ghost } from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from '../firebase'; 
import { collection, addDoc, onSnapshot, orderBy, query, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';

const themeColor = "#FACC15"; 

// ===============================================
// 🧠 POOL DE PERGUNTAS (SÓ O FILÉ DO ZAP)
// ===============================================
const ALL_QUESTIONS = [
  // Extreme
  { q: "O que vc estava comendo no dia 09/01 às 22:31?", opts: ["Torrada", "Escondidinho", "Cachorro quente"], a: 2 },
  { q: "Quais eram os ingredientes exatos do seu cachorro quente no dia 09/01?", opts: ["Salsicha e batata palha", "Salsicha, purê e milho", "Só salsicha e ketchup"], a: 0 },
  { q: "No dia 16/11, vc mandou mensagem às 00:37 dizendo que ia comer o quê?", opts: ["Pizza", "Sorvete do BK", "Açaí"], a: 1 },
  { q: "Em que dia vc avisou que derrubou Danone no chão enquanto fazia torrada?", opts: ["17/10 às 19:19", "18/10 às 12:37", "21/10 às 17:41"], a: 0 },
  { q: "Às 20:42 do dia 19/01, o que vc estava comendo?", opts: ["Escondidinho de carne", "Lasanha", "Arroz e feijão"], a: 0 },
  { q: "Qual o horário da madrugada que vc arrumava o quarto enquanto eu terminava o site (14/02)?", opts: ["03:00", "05:45", "06:12"], a: 2 },
  { q: "qual gíria vc usou para descrever os noia que queria bater nos velho do cedesp no dia (17/10)?", opts: ["Uns cão", "Esses mlk folgado", "Esse povo"], a: 1 },
  { q: "qual o horário exato que vc pediu minha playlist (09/09)?", opts: ["18:56", "19:40", "20:31"], a: 1 },
  { q: "vc tem o boné mas não a roupa", opts: ["Luigi", "Mario", "Wario"], a: 1 },
  { q: "qual o estilo que eu disse que minha blusa nova tinha?", opts: ["viado", "maconheiro", "estiloso"], a: 1 },
  { q: "O que a gente concorda que é ruim puro?", opts: ["eu sem vc", "açai", "sorvete"], a: 0 },
  { q: "Nível de amor que o Gabriel sente?", opts: ["10%", "100%", "Infinito n tem nem palavras pra descrever"], a: 2 }
];

// ===============================================
// 1. MURAL DO AMOR (FIREBASE)
// ===============================================
const LoveWall = () => {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const [author, setAuthor] = useState("gabriel"); 

  useEffect(() => {
    const q = query(collection(db, "love_notes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesData = [];
      querySnapshot.forEach((doc) => { notesData.push({ ...doc.data(), id: doc.id }); });
      setNotes(notesData);
    });
    return () => unsubscribe();
  }, []);

  const addNote = async () => {
    if (!input.trim()) return;
    const colors = ["#fef3c7", "#ffe4e6", "#dbeafe", "#f3e8ff", "#dcfce7"];
    await addDoc(collection(db, "love_notes"), {
      text: input, author, createdAt: new Date(),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: Math.floor(Math.random() * 10) - 5
    });
    setInput("");
  };

  const deleteNote = async (id) => await deleteDoc(doc(db, "love_notes", id));

  return (
    <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: '#222', padding: '20px', borderRadius: '20px', border: '1px solid #444' }}>
        <h3 style={{ color: '#fff', fontFamily: "'Lobster', cursive", marginBottom: '15px' }}>Deixe um recadinho:</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button onClick={() => setAuthor("gabriel")} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: author === 'gabriel' ? `2px solid ${themeColor}` : '1px solid #444', background: author === 'gabriel' ? `${themeColor}20` : 'transparent', color: author === 'gabriel' ? themeColor : '#888', cursor: 'pointer' }}>gabriel</button>
          <button onClick={() => setAuthor("sther")} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: author === 'sther' ? '2px solid #f87171' : '1px solid #444', background: author === 'sther' ? '#f8717120' : 'transparent', color: author === 'sther' ? '#f87171' : '#888', cursor: 'pointer' }}>a pessoa mais linda do mundo (vc)</button>
        </div>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escreva algo fofo..." style={{ width: '100%', height: '80px', borderRadius: '10px', background: '#333', border: 'none', padding: '10px', color: '#fff', resize: 'none', marginBottom: '10px' }}/>
        <button onClick={addNote} style={{ width: '100%', padding: '12px', background: themeColor, color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Send size={18} /> Postar</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px', paddingBottom: '50px' }}>
        <AnimatePresence>
          {notes.map(note => (
            <motion.div key={note.id} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1, rotate: note.rotate }} exit={{ scale: 0.5, opacity: 0 }} style={{ background: note.color, padding: '15px', borderRadius: '5px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', color: '#333', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '140px', position: 'relative' }}>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.4', margin: 0, fontFamily: "'Comic Sans MS', sans-serif" }}>"{note.text}"</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: '5px', marginTop: '10px' }}>
                <div style={{ fontSize: '0.7rem', color: '#666' }}><strong>{note.author}</strong></div>
                <button onClick={() => deleteNote(note.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.5 }}><Trash2 size={14} color="#000" /></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ===============================================
// 2. QUIZ DINÂMICO (SÓ OS MELHORES)
// ===============================================
const QuizGame = ({ onWin }) => {
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [curr, setCurr] = useState(0);

  useEffect(() => {
    // Embaralha todas e pega 10
    const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
    setSessionQuestions(shuffled);
  }, []);

  const handle = (i) => {
    if (i === sessionQuestions[curr].a) {
      if (curr < sessionQuestions.length - 1) setCurr(curr + 1); 
      else onWin("wowwwwwwwwwwwwwwwwwwww");
    } else {
      alert("outraoturaoutra");
    }
  };

  if (sessionQuestions.length === 0) return <p>Carregando perguntas...</p>;

  return (
    <div style={{ width: '100%', maxWidth: '400px', background: '#222', padding: '20px', borderRadius: '20px', border: '1px solid #444' }}>
      <p style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '10px' }}>Pergunta {curr + 1}/10</p>
      <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '20px', minHeight: '60px' }}>{sessionQuestions[curr].q}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sessionQuestions[curr].opts.map((opt, i) => (
          <motion.button key={i} onClick={() => handle(i)} whileTap={{ scale: 0.95 }} style={{ padding: '12px', borderRadius: '10px', border: 'none', background: '#333', color: '#fff', cursor: 'pointer', textAlign: 'left' }}>{opt}</motion.button>
        ))}
      </div>
    </div>
  );
}

// ===============================================
// 3. JOGO DA COBRINHA (SNAKE AMOR)
// ===============================================
const SnakeGame = ({ onWin }) => {
  const CANVAS_SIZE = 280;
  const GRID_SIZE = 20;
  const [snake, setSnake] = useState([[5, 5]]);
  const [food, setFood] = useState([10, 10]);
  const [dir, setDir] = useState([0, -1]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (gameOver) return;
    const move = setInterval(() => {
      setSnake(prev => {
        const head = [prev[0][0] + dir[0], prev[0][1] + dir[1]];
        if (head[0] < 0 || head[0] >= CANVAS_SIZE/GRID_SIZE || head[1] < 0 || head[1] >= CANVAS_SIZE/GRID_SIZE || prev.some(s => s[0] === head[0] && s[1] === head[1])) {
          setGameOver(true);
          return prev;
        }
        const newSnake = [head, ...prev];
        if (head[0] === food[0] && head[1] === food[1]) {
          setScore(s => s + 1);
          setFood([Math.floor(Math.random() * 14), Math.floor(Math.random() * 14)]);
          if (score + 1 >= 10) { clearInterval(move); onWin("craquecraqueucuauruq"); }
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 200);
    return () => clearInterval(move);
  }, [dir, food, gameOver]);

  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ color: themeColor }}>Pontos: {score} / 10</p>
      <div style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, background: '#111', position: 'relative', border: '2px solid #333', margin: '10px 0' }}>
        {snake.map((s, i) => <div key={i} style={{ position: 'absolute', width: GRID_SIZE, height: GRID_SIZE, background: themeColor, left: s[0]*GRID_SIZE, top: s[1]*GRID_SIZE, borderRadius: i === 0 ? '4px' : '2px' }} />)}
        <div style={{ position: 'absolute', width: GRID_SIZE, height: GRID_SIZE, background: '#f87171', left: food[0]*GRID_SIZE, top: food[1]*GRID_SIZE, borderRadius: '50%' }}><Heart size={12} color="white" fill="white" /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px', width: '150px', margin: '20px auto' }}>
        <button onClick={() => setDir([0, -1])} style={{ gridColumn: '2', padding: '10px', background: '#333', border: 'none', color: '#fff' }}>↑</button>
        <button onClick={() => setDir([-1, 0])} style={{ gridRow: '2', padding: '10px', background: '#333', border: 'none', color: '#fff' }}>←</button>
        <button onClick={() => setDir([0, 1])} style={{ gridRow: '2', gridColumn: '2', padding: '10px', background: '#333', border: 'none', color: '#fff' }}>↓</button>
        <button onClick={() => setDir([1, 0])} style={{ gridRow: '2', gridColumn: '3', padding: '10px', background: '#333', border: 'none', color: '#fff' }}>→</button>
      </div>
      {gameOver && <button onClick={() => { setGameOver(false); setSnake([[5,5]]); setScore(0); }} style={{ color: themeColor }}>Tentar de Novo</button>}
    </div>
  );
};

// ===============================================
// 4. LOVE CLICKER (RECORDE NO BANCO)
// ===============================================
const LoveClicker = ({ onWin }) => {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [active, setActive] = useState(false);
  const [player, setPlayer] = useState(null); 
  const [highScore, setHighScore] = useState({ count: 0, holder: "Ninguém" });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "game_records", "love_clicker"), (doc) => {
      if (doc.exists()) setHighScore(doc.data());
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (active && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      finishGame();
    }
  }, [timeLeft, active]);

  const finishGame = async () => {
    if (clicks > highScore.count) {
      await setDoc(doc(db, "game_records", "love_clicker"), { count: clicks, holder: player });
      confetti({ particleCount: 150, spread: 100 });
      alert(`NOVO RECORDE! ${clicks} beijos!`);
    }
    onWin(`Fez ${clicks} beijos!`);
    setActive(false);
  };

  if (!player) {
    return (
      <div style={{ textAlign: 'center', background: '#222', padding: '30px', borderRadius: '20px' }}>
        <h3>Quem você é?</h3>
        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
          <button onClick={() => setPlayer("Gabriel")} style={{ flex: 1, padding: '15px', background: themeColor, border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>Gabriel</button>
          <button onClick={() => setPlayer("Sther")} style={{ flex: 1, padding: '15px', background: '#f87171', border: 'none', borderRadius: '10px', fontWeight: 'bold', color: '#fff' }}>Sther</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ color: themeColor }}>🏆 Recorde: {highScore.count} ({highScore.holder})</p>
      <p style={{ fontSize: '1.5rem' }}>{timeLeft}s</p>
      <h2 style={{ fontSize: '3rem', margin: '10px 0' }}>{clicks}</h2>
      <motion.button whileTap={{ scale: 0.7 }} onClick={() => { if(!active) setActive(true); setClicks(clicks + 1); }} style={{ width: '150px', height: '150px', borderRadius: '50%', background: '#f87171', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Heart fill="white" size={60} color="white" />
      </motion.button>
    </div>
  );
};

// ===============================================
// 5. JOGO DA VELHA E OUTROS
// ===============================================
const TicTacToe = ({ onWin }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const checkWinner = (squares) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let i=0; i<lines.length; i++) {
      const [a,b,c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return squares.every(Boolean) ? "Empate" : null;
  };
  const handleClick = (i) => {
    if (checkWinner(board) || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = isXNext ? '❤️' : '☁️';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    const result = checkWinner(newBoard);
    if (result) setTimeout(() => onWin(result === "Empate" ? "nois" : result === "❤️" ? "Sther" : "Gabriel"), 500);
  };
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ marginBottom: '15px' }}>{isXNext ? 'Sther (❤️)' : 'Gabriel (☁️)'}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#333', padding: '10px', borderRadius: '15px' }}>
        {board.map((val, i) => (<div key={i} onClick={() => handleClick(i)} style={{ width: '80px', height: '80px', background: '#111', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', cursor: 'pointer' }}>{val}</div>))}
      </div>
    </div>
  );
};

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================
const GameZone = () => {
  const [game, setGame] = useState(null);
  const [winner, setWinner] = useState(null);

  const handleWin = (name) => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    setWinner(name || "Você");
  };

  const reset = () => { setGame(null); setWinner(null); };

  if (winner) {
    return (
      <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
        <Trophy size={100} color={themeColor} />
        <h2 style={{ color: '#fff', fontSize: '2.5rem', fontFamily: "'Lobster', cursive" }}>{winner} Venceu!</h2>
        <h3 style={{ color: themeColor, fontSize: '1.5rem', margin: '20px 0' }}>GANHOU UM BEIJÃO! 😘</h3>
        <button onClick={reset} style={{ padding: '12px 30px', borderRadius: '50px', background: themeColor, border: 'none', fontWeight: 'bold' }}>Voltar</button>
      </div>
    );
  }

  if (game) {
    return (
      <div style={{ minHeight: '100vh', padding: '6rem 20px 100px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button onClick={reset} style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}><ArrowLeft /> Voltar</button>
        {game === 'wall' && <LoveWall />}
        {game === 'quiz' && <QuizGame onWin={(n) => handleWin(n)} />}
        {game === 'velha' && <TicTacToe onWin={(w) => handleWin(w)} />}
        {game === 'click' && <LoveClicker onWin={(res) => handleWin(res)} />}
        {game === 'snake' && <SnakeGame onWin={(n) => handleWin(n)} />}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '6rem 20px 100px 20px', backgroundColor: '#0a0a0a' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <Gamepad2 size={40} color={themeColor} />
        <h2 style={{ fontFamily: "'Lobster', cursive", fontSize: '3.5rem', color: '#fff' }}>joguinhosss</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', maxWidth: '400px', margin: '0 auto' }}>
        <GameCard title="Mural de Recados" icon={<MessageSquare />} desc="Mensagens salvas no banco" onClick={() => setGame('wall')} color="#8b5cf6" />
        <GameCard title="Quizzzzzzzzz" icon={<Brain />} desc="Perguntas" onClick={() => setGame('quiz')} color="#e11d48" />
        <GameCard title="jogo da cobrinha" icon={<Ghost />} desc="jogo da cobra" onClick={() => setGame('snake')} color="#f59e0b" />
        <GameCard title="Jogo da Velha só q só tem como ganhar" icon={<X />} desc="❤️ vs ☁️" onClick={() => setGame('velha')} color="#10b981" />
        <GameCard title="beijosbeijosbiejos" icon={<MousePointer2 />} desc="recorde de beijos" onClick={() => setGame('click')} color="#ec4899" />
      </div>
    </div>
  );
};

const GameCard = ({ title, icon, desc, onClick, color }) => (
  <motion.div whileTap={{ scale: 0.98 }} onClick={onClick} style={{ background: '#1a1a1a', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px', border: `1px solid ${color}80`, cursor: 'pointer' }}>
    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#fff' }}>{icon}</div>
    <div><h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>{title}</h3><p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>{desc}</p></div>
  </motion.div>
);

export default GameZone;