import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowLeft, Gamepad2, Brain, Heart, Send, Trash2, HeartPulse, Cat, Dog, MessageSquare, ArrowUp, ArrowDown, ArrowRight, X, Puzzle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from '../firebase'; 
import { collection, addDoc, onSnapshot, orderBy, query, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';

const themeColor = "#FACC15";
const stherColor = "#f472b6"; // Rosa
const gabrielColor = "#3b82f6"; // Azul

// ===============================================
// 🧠 POOL DE PERGUNTAS 
// ===============================================
const ALL_QUESTIONS = [
  // Suas perguntas Extreme originais
  { q: "O que vc estava comendo no dia 09/01 às 22:31?", opts: ["Torrada", "Escondidinho", "Cachorro quente"], a: 2 },
  { q: "Quais eram os ingredientes exatos do seu cachorro quente no dia 09/01?", opts: ["Salsicha e batata palha", "Salsicha, purê e milho", "Só salsicha e ketchup"], a: 0 },
  { q: "No dia 16/11, vc mandou mensagem às 00:37 dizendo que ia comer o quê?", opts: ["Pizza", "Sorvete do BK", "Açaí"], a: 1 },
  { q: "Em que dia vc avisou que derrubou Danone no chão enquanto fazia torrada?", opts: ["17/10 às 19:19", "18/10 às 12:37", "21/10 às 17:41"], a: 0 },
  { q: "Às 20:42 do dia 19/01, o que vc estava comendo?", opts: ["Escondidinho de carne", "Lasanha", "Arroz e feijão"], a: 0 },
  { q: "Qual o horário da madrugada que vc arrumava o quarto enquanto eu terminava o site (14/02)?", opts: ["03:00", "05:45", "06:12"], a: 2 },
  { q: "Qual gíria vc usou para descrever os noia que queria bater nos velho do cedesp no dia (17/10)?", opts: ["Uns cão", "Esses mlk folgado", "Esse povo"], a: 1 },
  { q: "Qual o horário exato que vc pediu minha playlist (09/09)?", opts: ["18:56", "19:40", "20:31"], a: 1 },
  { q: "Vc tem o boné mas não a roupa", opts: ["Luigi", "Mario", "Wario"], a: 1 },
  { q: "Qual o estilo que eu disse que minha blusa nova tinha?", opts: ["viado", "maconheiro", "estiloso"], a: 1 },
  { q: "O que a gente concorda que é ruim puro?", opts: ["eu sem vc", "açai", "sorvete"], a: 0 },
  { q: "Nível de amor que o Gabriel sente?", opts: ["10%", "100%", "Infinito n tem nem palavras pra descrever"], a: 2 },

  // As 10 novas perguntas extraídas do WhatsApp
  { q: "qual animal a gente concordou que nós somos no dia 18/01?", opts: ["Gatinhos", "Ursos polares", "Morceguinhos"], a: 1 },
  { q: "Sua mãe sumiu no shopping no dia 06/01. Onde ela estava?", opts: ["No play center", "Na loja de roupas", "Na praça de alimentação"], a: 0 },
  { q: "Qual foi o sabor do gloss de R$ 14,99 que você comprou?", opts: ["Morango", "Melancia", "Tutti Frutti"], a: 2 },
  { q: "qual unha sua quebrou no dia 08/01?", opts: ["Dedão da mão direita", "Indicador da mão esquerda", "Dedinho da mão direita"], a: 0 },
  { q: "no dia 17/01, você fez uma receita que ficou igual a qual doce?", opts: ["Fini Dentaduras", "Fini Beijos", "Bala de Ursinho"], a: 1 },
  { q: "qual o sabor do Cup Noodles que você comprou na loja 'japoreana' no dia 19/01?", opts: ["Carne com queijo", "Frutos do mar", "Galinha caipira picante"], a: 2 },
  { q: "no bolo Red Velvet que você ia comer, do que era a massa e a calda?", opts: ["Massa de beterraba e calda de morango", "Massa de morango e calda de chocolate", "Massa de cereja e calda de morango"], a: 0 }
];

// ===============================================
// 1. MURAL DO AMOR (COM MODAL)
// ===============================================
const LoveWall = () => {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const [author, setAuthor] = useState("gabriel"); 
  const [selectedNote, setSelectedNote] = useState(null);

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

  const deleteNote = async (e, id) => {
      e.stopPropagation();
      await deleteDoc(doc(db, "love_notes", id));
      if(selectedNote && selectedNote.id === id) setSelectedNote(null);
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: '#222', padding: '20px', borderRadius: '20px', border: '1px solid #444' }}>
        <h3 style={{ color: '#fff', fontFamily: "'Lobster', cursive", marginBottom: '15px' }}>Deixe um recadinho:</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button onClick={() => setAuthor("gabriel")} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: author === 'gabriel' ? `2px solid ${gabrielColor}` : '1px solid #444', background: author === 'gabriel' ? `${gabrielColor}20` : 'transparent', color: author === 'gabriel' ? gabrielColor : '#888', cursor: 'pointer' }}>Gabriel</button>
          <button onClick={() => setAuthor("sther")} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: author === 'sther' ? `2px solid ${stherColor}` : '1px solid #444', background: author === 'sther' ? `${stherColor}20` : 'transparent', color: author === 'sther' ? stherColor : '#888', cursor: 'pointer' }}>Sther</button>
        </div>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} maxLength={1000} placeholder="Escreva algo fofo (sem limites mds)..." style={{ width: '100%', height: '80px', borderRadius: '10px', background: '#333', border: 'none', padding: '10px', color: '#fff', resize: 'none', marginBottom: '10px', fontFamily: 'inherit' }}/>
        <button onClick={addNote} style={{ width: '100%', padding: '12px', background: themeColor, color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Send size={18} /> Postar</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px', paddingBottom: '50px' }}>
        <AnimatePresence>
          {notes.map(note => (
            <motion.div key={note.id} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1, rotate: note.rotate }} exit={{ scale: 0.5, opacity: 0 }} onClick={() => setSelectedNote(note)} style={{ background: note.color, padding: '15px', borderRadius: '5px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', color: '#333', display: 'flex', flexDirection: 'column', minHeight: '150px', cursor: 'pointer', position: 'relative' }}>
              <div style={{ flex: 1, overflow: 'hidden', marginBottom: '10px' }}>
                 <p style={{ fontSize: '0.9rem', lineHeight: '1.4', margin: 0, fontFamily: "'Comic Sans MS', sans-serif", wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>"{note.text}"</p>
                 {note.text.length > 50 && <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '5px' }}>Ler tudo...</p>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px dashed rgba(0,0,0,0.2)', paddingTop: '5px' }}>
                <div style={{ fontSize: '0.75rem', color: note.author === 'gabriel' ? gabrielColor : stherColor }}><strong>{note.author}</strong></div>
                <button onClick={(e) => deleteNote(e, note.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.5 }}><Trash2 size={14} color="#000" /></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedNote && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }} onClick={() => setSelectedNote(null)}>
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} style={{ background: selectedNote.color, padding: '30px', borderRadius: '15px', width: '100%', maxWidth: '500px', color: '#333', position: 'relative', maxHeight: '80vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setSelectedNote(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} color="#000" /></button>
                    <p style={{ fontSize: '1.2rem', lineHeight: '1.6', fontFamily: "'Comic Sans MS', sans-serif", wordBreak: 'break-word', whiteSpace: 'pre-wrap', marginTop: '10px' }}>"{selectedNote.text}"</p>
                    <div style={{ textAlign: 'right', marginTop: '20px', fontSize: '1.1rem', color: selectedNote.author === 'gabriel' ? gabrielColor : stherColor }}><strong>- {selectedNote.author}</strong></div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ===============================================
// 2. JOGO DA VELHA GLOBAL
// ===============================================
const TicTacToe = ({ onWin }) => {
    const [gameState, setGameState] = useState(null);
    const [localPlayer, setLocalPlayer] = useState(null); 
    const docRef = doc(db, "game_records", "tic_tac_toe_global");

    useEffect(() => {
        const unsub = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setGameState(docSnap.data());
                const winner = checkWinner(docSnap.data().board);
                if (winner && !docSnap.data().winner) {
                     onWin(winner === "Empate" ? "Deu empate!" : `O time ${winner} venceu!`);
                     updateDoc(docRef, { winner });
                }
            } else {
                setDoc(docRef, { board: Array(9).fill(null), isXNext: true, winner: null, players: {} });
            }
        });
        return () => unsub();
    }, [onWin]);
    
    const checkWinner = (squares) => {
      const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      for (let i=0; i<lines.length; i++) {
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
      }
      return squares.every(Boolean) ? "Empate" : null;
    };

    const choosePlayer = async (name, symbol) => {
        setLocalPlayer({ name, symbol });
        await updateDoc(docRef, { [`players.${symbol}`]: name });
    };

    const handleClick = async (i) => {
        if (!localPlayer) { alert("Escolha seu time primeiro!"); return; }
        if ((gameState.isXNext && localPlayer.symbol !== '❤️') || (!gameState.isXNext && localPlayer.symbol !== '☁️')) {
             alert("Calma! Não é sua vez."); return;
        }
        if (gameState.winner || gameState.board[i]) return;

        const newBoard = [...gameState.board];
        newBoard[i] = gameState.isXNext ? '❤️' : '☁️';
        await updateDoc(docRef, { board: newBoard, isXNext: !gameState.isXNext });
    };

    const resetGame = async () => await setDoc(docRef, { board: Array(9).fill(null), isXNext: true, winner: null, players: {} });

    if (!gameState) return <p style={{color: '#fff'}}>Conectando ao tabuleiro...</p>;
    
    if (!localPlayer) {
        return (
            <div style={{ textAlign: 'center', background: '#222', padding: '30px', borderRadius: '20px' }}>
                <h3 style={{ marginTop: 0, color: '#fff' }}>Quem é você?</h3>
                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                    <button onClick={() => choosePlayer('Gabriel', '☁️')} style={{ flex: 1, padding: '15px', background: gabrielColor, border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>Gabriel (☁️)</button>
                    <button onClick={() => choosePlayer('Sther', '❤️')} style={{ flex: 1, padding: '15px', background: stherColor, border: 'none', borderRadius: '10px', fontWeight: 'bold', color: '#fff' }}>Sther (❤️)</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'center', color: '#fff' }}>
            <p style={{ marginBottom: '15px' }}>Vez de: {gameState.isXNext ? `Sther (❤️)` : `Gabriel (☁️)`}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#333', padding: '10px', borderRadius: '15px', opacity: gameState.winner ? 0.5 : 1 }}>
                {gameState.board.map((val, i) => (<div key={i} onClick={() => handleClick(i)} style={{ width: '80px', height: '80px', background: '#111', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', cursor: 'pointer', color: val === '❤️' ? stherColor : gabrielColor }}>{val}</div>))}
            </div>
            {gameState.winner && <p style={{ marginTop: '20px', color: themeColor, fontSize: '1.2rem' }}>Fim de jogo!</p>}
            <button onClick={resetGame} style={{ marginTop: '20px', color: '#888', background: 'transparent', border: '1px solid #888', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}>Reiniciar Partida</button>
        </div>
    );
};

// ===============================================
// 3. JOGO DA MEMÓRIA
// ===============================================
const MemoryGame = ({ onWin }) => {
    const EMOJIS = ['❤️', '🐱', '✨', '🎮', '🌙', '👑'];
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);

    useEffect(() => {
        const gameCards = [...EMOJIS, ...EMOJIS]
            .sort(() => Math.random() - 0.5)
            .map((emoji, i) => ({ id: i, emoji, isFlipped: false }));
        setCards(gameCards);
    }, []);

    const handleClick = (id) => {
        if (flipped.length === 2 || solved.includes(cards.find(c => c.id === id).emoji) || flipped.includes(id)) return;
        
        const newFlipped = [...flipped, id];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            const [first, second] = newFlipped;
            if (cards.find(c => c.id === first).emoji === cards.find(c => c.id === second).emoji) {
                const newSolved = [...solved, cards.find(c => c.id === first).emoji];
                setSolved(newSolved);
                if (newSolved.length === EMOJIS.length) {
                    setTimeout(() => onWin("ta muito boa de memoriaaa"), 500);
                }
                setFlipped([]);
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };
    return (
        <div style={{ width: '100%', maxWidth: '320px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {cards.map(card => (
                    <div key={card.id} onClick={() => handleClick(card.id)} style={{ perspective: '1000px' }}>
                        <motion.div
                            animate={{ rotateY: flipped.includes(card.id) || solved.includes(card.emoji) ? 180 : 0 }}
                            transition={{ duration: 0.5 }}
                            style={{ width: '70px', height: '90px', borderRadius: '10px', cursor: 'pointer', transformStyle: 'preserve-3d', position: 'relative' }}>
                            <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', fontSize: '2rem', color: '#fff' }}>?</div>
                            <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: themeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', fontSize: '2.5rem' }}>{card.emoji}</div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ===============================================
// 4. PEGA O FRED E O BRED (GATO E CACHORRO) - CÓDIGO CORRIGIDO
// ===============================================
const WhackCats = ({ onWin }) => {
    const [holes, setHoles] = useState(Array(9).fill(null));
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [active, setActive] = useState(false);
    const gameLoopRef = useRef(null); // Usamos uma ref para o loop do jogo

    // Effect para controlar o TEMPO e o FIM do jogo
    useEffect(() => {
        if (!active) return; // Se o jogo não está ativo, não faz nada

        // Quando o tempo zera, finaliza o jogo
        if (timeLeft <= 0) {
            setActive(false); // Para o jogo
            if (score >= 12) {
                onWin(`pegando ${score} bichos loucos!`);
            } else {
                alert(`Fim de jogo! Você pegou ${score} (precisa de 12).`);
            }
            return;
        }

        // Cria o cronômetro que diminui 1 segundo por vez
        const clock = setInterval(() => {
            setTimeLeft(t => t - 1);
        }, 1000);

        // Limpa o cronômetro quando o componente for desmontado ou o efeito rodar de novo
        return () => clearInterval(clock);
    }, [active, timeLeft, score, onWin]);

    // Effect para controlar o APARECIMENTO DOS BICHOS
    useEffect(() => {
        if (!active) {
            clearTimeout(gameLoopRef.current); // Limpa o loop se o jogo parar
            setHoles(Array(9).fill(null)); // Limpa os buracos
            return;
        }

        const spawnBicho = () => {
            const newHoles = Array(9).fill(null);
            const randomHole = Math.floor(Math.random() * 9);
            const isBred = Math.random() > 0.5; // 50% chance do Bred (Cachorro)
            newHoles[randomHole] = isBred ? 'bred' : 'fred';
            setHoles(newHoles);

            const delay = Math.max(500, 1000 - (score * 20));
            gameLoopRef.current = setTimeout(spawnBicho, delay);
        };

        spawnBicho(); // Começa o loop de aparições

        // Função de limpeza para parar o loop quando o jogo acabar
        return () => clearTimeout(gameLoopRef.current);
    }, [active, score]); // Depende do score para ajustar a dificuldade dinamicamente

    const whack = (i) => {
        if (holes[i]) {
            setScore(s => s + 1);
            setHoles(Array(9).fill(null));
        }
    };
    
    if (!active) {
        return <button onClick={() => { setActive(true); setScore(0); setTimeLeft(15); }} style={{ padding: '15px 30px', borderRadius: '50px', background: themeColor, border: 'none', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}>Começar</button>
    }

    return (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '300px', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontWeight: 'bold' }}>
                <p>🐾 Pontos: {score}</p>
                <p>⏰ Tempo: {timeLeft}s</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                {holes.map((bichoType, i) => (
                    <div key={i} onClick={() => whack(i)} style={{ width: '80px', height: '80px', background: '#333', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {bichoType && (
                           <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                               {bichoType === 'fred' ? (
                                   <Cat size={40} color="#f97316" /> // Fred é Gato Laranja
                               ) : (
                                   <Dog size={40} color="#8b5cf6" /> // Bred é Cachorro Roxo
                               )}
                           </motion.div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ===============================================
// 5. DUO JUMPER 
// ===============================================
const DuoJumper = ({ onWin }) => {
    const GAME_HEIGHT = 400, GAME_WIDTH = 300;
    const HEART_SIZE = 25, GAP = 140, PIPE_WIDTH = 50;
    const GRAVITY = 2, JUMP = 35;

    const [heartsPos, setHeartsPos] = useState([GAME_HEIGHT / 2 - 20, GAME_HEIGHT / 2 + 20]);
    const [pipes, setPipes] = useState([]);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('start'); 
    
    const scoreRef = useRef(0);
    const heartsRef = useRef([GAME_HEIGHT / 2 - 20, GAME_HEIGHT / 2 + 20]);

    useEffect(() => {
        heartsRef.current = heartsPos;
    }, [heartsPos]);

    useEffect(() => {
        if (gameState !== 'playing') return;

        const gameLoop = setInterval(() => {
            setHeartsPos(prev => [
                Math.min(GAME_HEIGHT - HEART_SIZE, prev[0] + GRAVITY), 
                Math.min(GAME_HEIGHT - HEART_SIZE, prev[1] + GRAVITY)
            ]);

            setPipes(prevPipes => {
                let passedFlag = false;
                const newPipes = prevPipes.map(pipe => {
                    const newX = pipe.x - 2;
                    if (!pipe.passed && newX + PIPE_WIDTH < (GAME_WIDTH / 2 - HEART_SIZE / 2)) {
                        passedFlag = true;
                        return { ...pipe, x: newX, passed: true };
                    }
                    return { ...pipe, x: newX };
                }).filter(pipe => pipe.x > -PIPE_WIDTH);
                
                if (passedFlag) {
                    scoreRef.current += 1;
                    setScore(scoreRef.current);
                }

                if (newPipes.length < 3 && (newPipes.length === 0 || newPipes[newPipes.length - 1].x < GAME_WIDTH - 200)) {
                    const topHeight = Math.floor(Math.random() * (GAME_HEIGHT - GAP - 80)) + 40;
                    newPipes.push({ x: GAME_WIDTH, topHeight, passed: false });
                }

                const currentPipe = newPipes.find(p => p.x < GAME_WIDTH / 2 + HEART_SIZE / 2 && p.x > GAME_WIDTH / 2 - HEART_SIZE / 2 - PIPE_WIDTH);
                if (currentPipe) {
                    const collided = heartsRef.current.some(h => (h < currentPipe.topHeight) || (h + HEART_SIZE > currentPipe.topHeight + GAP));
                    if (collided) setGameState('over');
                }
                
                return newPipes;
            });

            if (heartsRef.current.some(h => h >= GAME_HEIGHT - HEART_SIZE)) setGameState('over');
            
        }, 16);

        return () => clearInterval(gameLoop);
    }, [gameState]); 

    useEffect(() => {
        if (score >= 10 && gameState === 'playing') { 
            onWin("e são o melhor duo!");
            setGameState('over');
        }
    }, [score, gameState, onWin]);
    
    const handleJump = () => {
        if (gameState === 'playing') {
            setHeartsPos(prev => [Math.max(0, prev[0] - JUMP), Math.max(0, prev[1] - JUMP)]);
        } else if (gameState === 'start') {
            setGameState('playing');
        } else if (gameState === 'over') {
            setHeartsPos([GAME_HEIGHT / 2 - 20, GAME_HEIGHT / 2 + 20]);
            setPipes([]);
            setScore(0);
            scoreRef.current = 0;
            setGameState('start');
        }
    };
    
    return (
        <div onClick={handleJump} style={{ width: GAME_WIDTH, height: GAME_HEIGHT, background: '#111', overflow: 'hidden', position: 'relative', border: `2px solid #333`, cursor: 'pointer', borderRadius: '15px' }}>
            <div style={{ position: 'absolute', top: '10px', left: '0', right: '0', textAlign: 'center', color: '#fff', fontSize: '2rem', zIndex: 10, textShadow: '0 2px 5px #000' }}>{score}</div>
            <motion.div animate={{y: [0,-3,0]}} transition={{repeat: Infinity, duration: 2}} style={{position: 'absolute', top: heartsPos[0], left: GAME_WIDTH/2 - HEART_SIZE/2, zIndex: 5}}><Heart fill={stherColor} size={HEART_SIZE} color={stherColor} /></motion.div>
            <motion.div animate={{y: [0,3,0]}} transition={{repeat: Infinity, duration: 2}} style={{position: 'absolute', top: heartsPos[1], left: GAME_WIDTH/2 - HEART_SIZE/2, zIndex: 5}}><Heart fill={gabrielColor} size={HEART_SIZE} color={gabrielColor} /></motion.div>
            
            {pipes.map((pipe, i) => (
                <div key={i}>
                    <div style={{ position: 'absolute', background: themeColor, top: 0, left: pipe.x, width: PIPE_WIDTH, height: pipe.topHeight, border: '2px solid #333', borderRadius: '0 0 10px 10px' }}/>
                    <div style={{ position: 'absolute', background: themeColor, bottom: 0, left: pipe.x, width: PIPE_WIDTH, height: GAME_HEIGHT - pipe.topHeight - GAP, border: '2px solid #333', borderRadius: '10px 10px 0 0' }}/>
                </div>
            ))}

            {gameState !== 'playing' && (
                <div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'white', textAlign: 'center', zIndex: 20}}>
                    <h2 style={{fontSize: '2rem', margin: '0 0 10px 0'}}>{gameState === 'start' ? "Duo Jumper" : "Fim de Jogo"}</h2>
                    <p style={{margin: 0, padding: '0 20px'}}>{gameState === 'start' ? "Toque na tela para pularem juntos!" : `Pontos: ${score}\nToque para reiniciar`}</p>
                </div>
            )}
        </div>
    );
};

// ===============================================
// 6. QUIZ DO CASAL
// ===============================================
const QuizGame = ({ onWin }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const shuffled = [...ALL_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 5);
    setQuestions(shuffled);
  }, []);

  const handleAnswer = (selectedIndex) => {
    const isCorrect = selectedIndex === questions[currentQ].a;
    if (isCorrect) setScore(score + 1);

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setFinished(true);
      if (score + (isCorrect ? 1 : 0) >= 4) {
        setTimeout(() => onWin("por conhecer muito bem a nossa história!"), 500);
      }
    }
  };

  if (questions.length === 0) return null;

  if (finished) {
    return (
      <div style={{ textAlign: 'center', color: '#fff', background: '#222', padding: '30px', borderRadius: '15px' }}>
        <h3>Você acertou {score} de {questions.length}!</h3>
        {score >= 4 ? <p>sua memoria e mt boa amor</p> : <p>quaseuaseusaueuseas</p>}
        <button onClick={() => { setCurrentQ(0); setScore(0); setFinished(false); setQuestions([...ALL_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 5)); }} style={{ marginTop: '15px', padding: '10px 20px', borderRadius: '10px', background: themeColor, border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Tentar de novo</button>
      </div>
    );
  }

  return (
    <div style={{ background: '#222', padding: '30px', borderRadius: '15px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
      <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '15px' }}>Pergunta {currentQ + 1} de {questions.length}</p>
      <h3 style={{ color: '#fff', marginBottom: '25px', lineHeight: '1.4' }}>{questions[currentQ].q}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {questions[currentQ].opts.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(i)} style={{ padding: '15px', borderRadius: '10px', border: '1px solid #444', background: '#333', color: '#fff', cursor: 'pointer', fontSize: '1rem', transition: '0.2s' }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

// ===============================================
// 7. COBRINHA DO AMOR
// ===============================================
const SnakeGame = ({ onWin }) => {
  const [snake, setSnake] = useState([[5, 5]]);
  const [food, setFood] = useState([10, 10]);
  const [dir, setDir] = useState([0, 1]); 
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gridSize = 15;

  useEffect(() => {
    if (gameOver) return;
    const moveSnake = () => {
      setSnake(prev => {
        const head = prev[0];
        const newHead = [head[0] + dir[0], head[1] + dir[1]];
        
        if (newHead[0] < 0 || newHead[0] >= gridSize || newHead[1] < 0 || newHead[1] >= gridSize) {
          setGameOver(true); return prev;
        }
        if (prev.some(seg => seg[0] === newHead[0] && seg[1] === newHead[1])) {
          setGameOver(true); return prev;
        }

        const newSnake = [newHead, ...prev];
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore(s => s + 1);
          if (score + 1 >= 10) onWin("coletando 10 corações");
          setFood([Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)]);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [dir, food, gameOver, score, onWin]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp': if (dir[0] !== 1) setDir([-1, 0]); break;
        case 'ArrowDown': if (dir[0] !== -1) setDir([1, 0]); break;
        case 'ArrowLeft': if (dir[1] !== 1) setDir([0, -1]); break;
        case 'ArrowRight': if (dir[1] !== -1) setDir([0, 1]); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dir]);

  const changeDir = (newDir) => {
      if (newDir[0] !== 0 && dir[0] === newDir[0] * -1) return;
      if (newDir[1] !== 0 && dir[1] === newDir[1] * -1) return;
      setDir(newDir);
  }

  const reset = () => { setSnake([[5, 5]]); setDir([0, 1]); setScore(0); setGameOver(false); };

  const btnStyle = { background: '#333', color: '#fff', border: 'none', borderRadius: '10px', padding: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff' }}>
      <p style={{ fontSize: '1.2rem', marginBottom: '10px', fontWeight: 'bold' }}>Corações: {score} / 10</p>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 20px)`, gap: '1px', background: '#222', border: `2px solid ${stherColor}`, padding: '5px', borderRadius: '10px' }}>
        {Array.from({ length: gridSize }).map((_, r) => 
          Array.from({ length: gridSize }).map((_, c) => {
            const isSnake = snake.some(seg => seg[0] === r && seg[1] === c);
            const isFood = food[0] === r && food[1] === c;
            return (
              <div key={`${r}-${c}`} style={{ width: '20px', height: '20px', background: isSnake ? gabrielColor : isFood ? 'transparent' : '#111', borderRadius: isSnake ? '4px' : '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isFood && <Heart size={14} fill={stherColor} color={stherColor} />}
              </div>
            );
          })
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 50px)', gap: '10px', marginTop: '20px' }}>
          <div />
          <button onClick={() => changeDir([-1, 0])} style={btnStyle}><ArrowUp/></button>
          <div />
          <button onClick={() => changeDir([0, -1])} style={btnStyle}><ArrowLeft style={{transform: 'rotate(-45deg)'}} /></button>
          <button onClick={() => changeDir([1, 0])} style={btnStyle}><ArrowDown/></button>
          <button onClick={() => changeDir([0, 1])} style={btnStyle}><ArrowRight style={{transform: 'rotate(45deg)'}} /></button>
      </div>

      {gameOver && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', marginBottom: '10px', fontWeight: 'bold' }}>Vixe, bateu!</p>
          <button onClick={reset} style={{ padding: '10px 20px', borderRadius: '10px', background: themeColor, border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Tentar de novo</button>
        </div>
      )}
    </div>
  );
};

// ===============================================
// 8. LOVERCLICKER
// ===============================================
const Loverclicker = ({ onWin }) => {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let timer;
    if (active && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && active) {
      setActive(false);
      setFinished(true);
      // Se ela fizer mais de 40 cliques, chama a vitória
      if (clicks >= 40) {
        onWin(`dando ${clicks} cliques pelo nosso amor!`);
      }
    }
    return () => clearInterval(timer);
  }, [active, timeLeft, clicks, onWin]);

  const handleClick = () => {
    if (finished) return;
    if (!active && timeLeft === 10) {
      setActive(true);
    }
    if (active || timeLeft === 10) {
      setClicks(c => c + 1);
    }
  };

  return (
    <div style={{ textAlign: 'center', color: '#fff', background: '#222', padding: '30px', borderRadius: '15px', width: '100%', maxWidth: '350px' }}>
      <HeartPulse size={48} color={themeColor} style={{ marginBottom: '15px' }} />
      <h3 style={{ marginBottom: '10px' }}>Loverclicker ❤️</h3>
      {!finished ? (
        <>
          <p style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
            Tempo: 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </p>
          <button 
            onClick={handleClick}
            style={{
              padding: '20px 40px',
              fontSize: '1.5rem',
              borderRadius: '15px',
              background: themeColor,
              color: '#000',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              userSelect: 'none',
              transform: active ? 'scale(0.95)' : 'scale(1)',
              transition: 'transform 0.05s'
            }}
          >
            Click! ({clicks})
          </button>
          {!active && timeLeft === 10 && <p style={{marginTop: '15px', color: '#888', fontSize: '0.9rem'}}>Clique para começar o timer!</p>}
        </>
      ) : (
        <div>
          <h2 style={{ color: themeColor }}>O tempo acabou!</h2>
          <p style={{ fontSize: '1.3rem', margin: '15px 0' }}>Você deu <strong>{clicks}</strong> cliques!</p>
          <button onClick={() => { setClicks(0); setTimeLeft(10); setFinished(false); }} style={{ padding: '10px 20px', borderRadius: '10px', background: '#333', color: '#fff', border: `1px solid ${themeColor}`, cursor: 'pointer' }}>Tentar Novamente</button>
        </div>
      )}
    </div>
  );
};


// ===============================================
// 🚀 MENU PRINCIPAL - GAMEZONE 
// ===============================================
export default function GameZone() {
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    { id: 'wall', title: 'Murallllllllllllllllll 💬', desc: 'deixa um recadinho.', icon: <MessageSquare size={32} color={themeColor} /> },
    { id: 'tictactoe', title: 'Velha (Sther vs Gabriel) ⚔️', desc: 'bora resolver no diálogo', icon: <Gamepad2 size={32} color={themeColor} /> },
    { id: 'memory', title: 'Memóriaaaaaaaaaa', desc: 'Testa ai se vc lembra de tudo.', icon: <Brain size={32} color={themeColor} /> },
    { id: 'whack', title: 'pega o Fred e o Bred 🐱🐶', desc: 'Pega o Frede o Bred antes q eles sumam', icon: <Cat size={32} color={themeColor} /> },
    { id: 'jumper', title: 'esqueci o nome desse', desc: 'de pular as coisa juntos', icon: <ArrowUp size={32} color={themeColor} /> },
    { id: 'quiz', title: 'quizzzzzzzzz', desc: 'quizzzzzzzzzzzzzzz', icon: <Puzzle size={32} color={themeColor} /> },
    { id: 'snake', title: 'jogo da cobrinha', desc: 'jogo da obrinhahaha', icon: <HeartPulse size={32} color={themeColor} /> },
    { id: 'clicker', title: 'recorde de Beijos', desc: 'eu acho q n ta funcionando mas dps eu arrumo fiquei com raiva', icon: <Heart size={32} color={themeColor} /> }
  ];

  const handleWin = (msg) => {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      alert(`UHUUUUUUUUUUL! Parabéns neném ${msg} ❤️`);
  };

  if (activeGame) {
      return (
          <div style={{ padding: '20px', minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', maxWidth: '600px', display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                  <button onClick={() => setActiveGame(null)} style={{ background: '#222', border: '1px solid #444', color: '#fff', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                      <ArrowLeft size={18} /> Voltar
                  </button>
                  <h2 style={{ flex: 1, textAlign: 'center', margin: 0, color: themeColor, fontSize: '1.5rem' }}>{games.find(g => g.id === activeGame)?.title}</h2>
              </div>
              
              {activeGame === 'wall' && <LoveWall />}
              {activeGame === 'tictactoe' && <TicTacToe onWin={handleWin} />}
              {activeGame === 'memory' && <MemoryGame onWin={handleWin} />}
              {activeGame === 'whack' && <WhackCats onWin={handleWin} />}
              {activeGame === 'jumper' && <DuoJumper onWin={handleWin} />}
              {activeGame === 'quiz' && <QuizGame onWin={handleWin} />}
              {activeGame === 'snake' && <SnakeGame onWin={handleWin} />}
              {/* CORREÇÃO DO ERRO AQUI: Era "LoveClicker" e agora é "Loverclicker" */}
              {activeGame === 'clicker' && <Loverclicker onWin={handleWin} />} 
          </div>
      );
  }

  return (
      <div style={{ padding: '30px 20px', minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{ fontSize: '2.5rem', color: themeColor, marginBottom: '10px' }}>joguinhosssssss</h1>
              <p style={{ color: '#aaa', fontSize: '1.1rem' }}>❤️</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
              {games.map(game => (
                  <motion.div 
                      key={game.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveGame(game.id)}
                      style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '15px', padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
                  >
                      <div style={{ background: '#2a2a2a', padding: '15px', borderRadius: '50%', marginBottom: '15px' }}>
                          {game.icon}
                      </div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#fff' }}>{game.title}</h3>
                      <p style={{ fontSize: '0.9rem', color: '#888', lineHeight: '1.4' }}>{game.desc}</p>
                  </motion.div>
              ))}
          </div>
      </div>
  );
}