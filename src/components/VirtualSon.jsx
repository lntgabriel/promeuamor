// src/components/VirtualSon.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { doc, onSnapshot, updateDoc, increment, setDoc, arrayUnion } from 'firebase/firestore';
import { Send, Settings2, ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- TEMA E CONFIGURAÇÕES ---
const THEME = {
  primary: "#fbbf24", // Amber-400 (Amarelo Ouro mais suave)
  bgGradient: "linear-gradient(to bottom, #09090b, #18181b)",
  bgSolid: "#09090b",
  glass: "rgba(18, 18, 18, 0.85)", // Fundo semi-transparente
  border: "rgba(255,255,255,0.08)",
  
  // Cores de Identidade
  gabriel: "#3b82f6", // Blue
  sther: "#f472b6",   // Pink
};

const getChildPhrase = (age) => {
  if (age < 1.5) return ["buáááá 😭", "unheeeeeeeeeee", "mama? papa?", "gugu dada", "auau!", "zZzZz...", "aaaaaaaaaaaaaa"];
  if (age < 5) return ["unheeeeeeeeeee", "eu quero doce!", "nossaaaaa", "não quero banho", "brincar!", "cadê meu brinquedo?"];
  if (age < 12) return ["que tédio", "não quero ir pra escola", "compra robus pra mi?", "to com fome", "aaaaaaa"];
  if (age < 18) return ["mãe eu sou gay", "me dá dinheiro?", "vou sair tchau", "to namorando", "que mico", "preciso de um pix agora", "me desculpa pai me desculpa maaaaae"];
  if (age < 30) return ["ai minhas costas", "vou ser paaaaaaaaaaai", "quero beber", "preciso trabalhar", "sextooooooooooo", "saudades de antes", "aaaaaaaaaaaaaaaaa"];
  return ["oi família", "eu sou vovo", "aaaaaaaaaaaaaaaaaaaa", "dor nas costas...", "vamos lanchar", "sdds época boa"];
};

const VirtualSon = () => { 
  const [data, setData] = useState(null);
  const [input, setInput] = useState("");
  const [user, setUser] = useState("gabriel"); 
  const [isEditing, setIsEditing] = useState(false);
  const scrollRef = useRef(null);

  // Escuta dados em tempo real
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "virtualSon", "global"), (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.data());
      } else {
        // Estado inicial se não existir documento
        setDoc(doc(db, "virtualSon", "global"), {
          count: 0, papaiReady: false, mamaeReady: false, name: "", gender: "menino", chatHistory: [] 
        });
      }
    });
    return () => unsub();
  }, []);

  // Scroll automático
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [data?.chatHistory, user]);

  // Função Reset Total (volta pra tela de inicio)
  const fullReset = async () => {
    if(!window.confirm("Isso vai apagar TUDO: nome, idade e histórico. Tem certeza?")) return;
    await updateDoc(doc(db, "virtualSon", "global"), {
      count: 0, 
      chatHistory: [], 
      name: "", 
      gender: "menino", 
      papaiReady: false, 
      mamaeReady: false
    });
    setIsEditing(false);
  };

  const handleBirth = async (name, gender) => {
    if (!name.trim()) return alert("Dê um nome ao bebê!");
    confetti({ particleCount: 200, spread: 150, origin: { y: 0.6 }, colors: [THEME.primary, '#ffffff'] });
    
    // Inicia com count 0.1 para sair da tela de setup
    await updateDoc(doc(db, "virtualSon", "global"), {
        name: name,
        gender: gender,
        count: 0.1, // Marca o nascimento
        chatHistory: [{
            user: 'system',
            text: `🌟 ${name} nasceu! Bem-vindos à família.`,
            id: Date.now()
        }]
    });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const docRef = doc(db, "virtualSon", "global");
    const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const newMessage = { user, text: input, time: timestamp, id: Date.now() };
    setInput(""); 

    // Otimismo UI: adiciona localmente (opcional) ou confia no onSnapshot
    let updates = { chatHistory: arrayUnion(newMessage) };
    user === 'gabriel' ? (updates.papaiReady = true) : (updates.mamaeReady = true);

    const opponentReady = user === 'gabriel' ? data.mamaeReady : data.papaiReady;

    if (opponentReady) {
      // LEVEL UP
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 }, colors: [THEME.primary] });
      const newAgeCount = (data.count || 0) + 1;
      const realAge = newAgeCount * 0.5;
      const phrases = getChildPhrase(realAge);
      
      const levelUpMsg = {
          user: 'system',
          text: `🎂 ${realAge % 1 === 0 ? realAge.toFixed(0) : realAge} Anos`,
          id: Date.now() + 1
      };
      
      const childTalk = {
          user: 'child',
          text: phrases[Math.floor(Math.random() * phrases.length)],
          time: timestamp,
          id: Date.now() + 2
      };

      await updateDoc(docRef, {
        ...updates,
        chatHistory: arrayUnion(newMessage, levelUpMsg, childTalk),
        count: increment(1),
        papaiReady: false, mamaeReady: false
      });
    } else {
      await updateDoc(docRef, updates);
    }
  };

  if (!data) return <div style={{...styles.fullScreen, justifyContent:'center'}}>Carregando vida...</div>;

  // TELA 1: SETUP / NASCIMENTO (Se count for 0 ou name for vazio)
  if (!data.name || data.count === 0) {
     return <SetupScreen onConfirm={handleBirth} />;
  }

  // TELA 2: CHAT PRINCIPAL
  const realAge = data.count * 0.5;
  const isBoy = data.gender === 'menino';
  const getAvatar = () => {
     if (realAge < 1) return isBoy ? '👶🏽' : '👶🏼';
     if (realAge < 5) return isBoy ? '🧒🏽' : '👧🏼';
     if (realAge < 13) return '🎒';
     if (realAge < 18) return '🎧';
     if (realAge < 30) return isBoy ? '🧔🏽‍♂️' : '👩🏼‍💼';
     if (realAge < 50) return isBoy ? '👨🏽‍🦳' : '👩🏼‍🦳';
     return '🐢';
  }
  const avatar = getAvatar();
  const opponentReady = user === 'gabriel' ? data.mamaeReady : data.papaiReady;
  const userColor = user === 'gabriel' ? THEME.gabriel : THEME.sther;

  return (
    <div style={styles.fullScreen}>
        
        {/* BACKGROUND GRADIENTE SUTIL */}
        <div style={styles.bgDecoration} />

        {/* HEADER FLUTUANTE */}
        <div style={styles.header}>
            <div style={{display:'flex', alignItems:'center', gap:12}}>
                <div style={styles.avatarRing}>{avatar}</div>
                <div>
                    <h2 style={styles.headerName}>{data.name}</h2>
                    <span style={styles.headerAge}>{realAge} ANOS</span>
                </div>
            </div>
            <div style={{display:'flex', gap:5}}>
                 <button onClick={fullReset} style={styles.iconBtn}><RotateCcw size={20} /></button>
            </div>
        </div>

        {/* AREA DE CHAT */}
        <div style={styles.chatArea} ref={scrollRef}>
            {data.chatHistory.map((msg, i) => (
                <MessageItem key={i} msg={msg} user={user} childName={data.name} avatar={avatar} />
            ))}
        </div>

        {/* AREA DE INPUT + SELEÇÃO DE USUÁRIO */}
        <div style={styles.footerWrapper}>
            {/* Seletor de Identidade Estiloso */}
            <div style={styles.userToggleContainer}>
                <div style={styles.toggleBg}>
                    <button onClick={() => setUser('gabriel')} style={{...styles.toggleBtn, opacity: user==='gabriel'?1:0.5, color: THEME.gabriel}}>
                       Eu sou o Pai
                    </button>
                    <div style={styles.verticalDivider}></div>
                    <button onClick={() => setUser('sther')} style={{...styles.toggleBtn, opacity: user==='sther'?1:0.5, color: THEME.sther}}>
                       Eu sou a Mãe
                    </button>
                </div>
                {/* Indicador se o outro digitou */}
                <AnimatePresence>
                {opponentReady && (
                    <motion.div 
                        initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}
                        style={styles.typingBubble}
                    >
                        <span style={{animation:'pulse 1s infinite'}}>•••</span>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>

            {/* Input Bar */}
            <div style={{...styles.inputBar, borderColor: `${userColor}40`}}>
                <input 
                    value={input} 
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Escreva sua mensagem..."
                    style={styles.inputField}
                    autoFocus
                />
                <button onClick={sendMessage} style={{...styles.sendBtn, backgroundColor: userColor}}>
                    <Send size={18} color="#fff"/>
                </button>
            </div>
        </div>
    </div>
  );
};

// --- COMPONENTE DE TELA DE SETUP ---
const SetupScreen = ({ onConfirm }) => {
    const [name, setName] = useState("");
    const [gender, setGender] = useState("menino");

    return (
        <div style={styles.setupContainer}>
            <motion.div 
                initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} 
                style={styles.setupCard}
            >
                <div style={styles.setupIcon}><Sparkles size={32} color={THEME.primary}/></div>
                <h2 style={styles.setupTitle}>Uma Nova Vida</h2>
                <p style={styles.setupDesc}>Você está prestes a gerar uma nova vida.</p>

                <div style={{width:'100%', marginBottom: 20}}>
                    <label style={styles.label}>Nome da Criança</label>
                    <input 
                        value={name} onChange={e => setName(e.target.value)}
                        placeholder="ex: teste da silva" 
                        style={styles.setupInput}
                    />
                </div>

                <div style={{display:'flex', gap: 10, width: '100%', marginBottom: 25}}>
                    <button 
                        onClick={() => setGender('menino')}
                        style={{...styles.genderBtn, ...(gender === 'menino' ? styles.activeBoy : {})}}
                    >
                        Menino 👶🏽
                    </button>
                    <button 
                        onClick={() => setGender('menina')}
                        style={{...styles.genderBtn, ...(gender === 'menina' ? styles.activeGirl : {})}}
                    >
                        Menina 👧🏼
                    </button>
                </div>

                <button onClick={() => onConfirm(name, gender)} style={styles.birthBtn}>
                    NASCER ✨
                </button>
            </motion.div>
        </div>
    );
};

// --- COMPONENTE DE MENSAGEM ---
const MessageItem = ({ msg, user, childName, avatar }) => {
    // 1. SYSTEM
    if(msg.user === 'system') {
        return (
            <div style={styles.systemMsgContainer}>
                <div style={styles.systemLine}></div>
                <span style={styles.systemText}>{msg.text}</span>
                <div style={styles.systemLine}></div>
            </div>
        )
    }

    // 2. CHILD
    if(msg.user === 'child') {
        return (
            <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} style={styles.childContainer}>
                <div style={styles.childAvatar}>{avatar}</div>
                <div style={styles.childBubble}>
                    <strong style={{display:'block', fontSize:'0.7rem', color: THEME.primary, marginBottom: 2}}>{childName}</strong>
                    {msg.text}
                </div>
            </motion.div>
        )
    }

    // 3. PARENTS
    const isMe = msg.user === user;
    const bubbleColor = msg.user === 'gabriel' ? THEME.gabriel : THEME.sther;
    
    return (
        <div style={{display:'flex', flexDirection:'column', alignItems: isMe ? 'flex-end' : 'flex-start', margin: '4px 0'}}>
            <div style={{
                ...styles.bubble,
                background: isMe ? `linear-gradient(135deg, ${bubbleColor}15, ${bubbleColor}05)` : '#121212',
                border: `1px solid ${isMe ? `${bubbleColor}40` : '#333'}`,
                borderBottomRightRadius: isMe ? 2 : 16,
                borderBottomLeftRadius: isMe ? 16 : 2
            }}>
                <span style={{fontSize: '0.95rem', color: '#eee'}}>{msg.text}</span>
            </div>
            {!isMe && <span style={{fontSize:'0.6rem', color:'#666', marginTop:2, marginLeft:5}}>{msg.user}</span>}
        </div>
    );
}

// --- ESTILOS REFINADOS ---
const styles = {
    // Estrutura Base Fixa (z-index 9999 para matar o bottomNav)
    fullScreen: {
        position: 'fixed', inset: 0, zIndex: 99999,
        display: 'flex', flexDirection: 'column',
        background: THEME.bgSolid,
        color: '#fff', fontFamily: "'Inter', sans-serif"
    },
    bgDecoration: {
        position: 'absolute', top: 0, left: 0, width:'100%', height:'100%',
        background: THEME.bgGradient, zIndex: -1, pointerEvents:'none'
    },
    
    // Header Glass
    header: {
        padding: '15px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: THEME.glass, backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${THEME.border}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)', zIndex: 50
    },
    avatarRing: {
        width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
        display:'flex', alignItems:'center', justifyContent:'center', fontSize: '1.4rem',
        border: `1px solid ${THEME.primary}`
    },
    headerName: { margin: 0, fontSize: '1.1rem', fontWeight: '700', letterSpacing:'0.5px' },
    headerAge: { fontSize: '0.75rem', color: THEME.primary, fontWeight:'bold', opacity: 0.9 },
    iconBtn: { background: 'transparent', border:'none', color: '#999', cursor: 'pointer', padding:8 },

    // Chat Scroll Area
    chatArea: {
        flex: 1, overflowY: 'auto', padding: '20px',
        paddingBottom: '160px', // Espaço enorme pra area de input
        display: 'flex', flexDirection: 'column', gap: '8px'
    },
    bubble: {
        padding: '10px 16px', borderRadius: 16,
        color: '#fff', maxWidth: '85%', wordBreak: 'break-word', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
    },

    // Tipos de mensagem especiais
    systemMsgContainer: { display: 'flex', alignItems:'center', gap: 10, margin: '20px 0', opacity: 0.8 },
    systemLine: { flex: 1, height: 1, background: '#333' },
    systemText: { fontSize: '0.75rem', color: THEME.primary, textTransform: 'uppercase', letterSpacing: '1px', fontWeight:'bold' },
    
    childContainer: { alignSelf: 'center', display: 'flex', flexDirection: 'column', alignItems:'center', margin: '15px 0' },
    childAvatar: { fontSize: '2rem', marginBottom: -10, zIndex: 1, filter:'drop-shadow(0 5px 10px rgba(0,0,0,0.5))' },
    childBubble: { 
        background: `linear-gradient(180deg, ${THEME.primary}20, #111)`, 
        border: `1px solid ${THEME.primary}50`,
        padding: '12px 20px', borderRadius: 20, textAlign: 'center',
        minWidth: 150, color: '#fff', fontSize:'0.9rem'
    },

    // Footer Glass / Input
    footerWrapper: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'rgba(0, 0, 0, 0.8)', // Fundo escuro
        backdropFilter: 'blur(15px)',
        borderTop: `1px solid ${THEME.border}`,
        padding: '15px 20px',
        paddingBottom: 'max(15px, env(safe-area-inset-bottom))', // Importante para iPhone
        display: 'flex', flexDirection: 'column', gap: 12,
        zIndex: 100
    },
    userToggleContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' },
    toggleBg: { 
        background: '#1c1c1c', borderRadius: 20, display:'flex', padding: 4, 
        border: '1px solid #333'
    },
    toggleBtn: { 
        background: 'transparent', border:'none', padding: '6px 14px', 
        fontSize: '0.75rem', fontWeight:'bold', cursor:'pointer', transition: '0.3s'
    },
    verticalDivider: { width: 1, background: '#333', height: 15, alignSelf: 'center' },
    typingBubble: { 
        position: 'absolute', right: 0, background: '#222', padding:'2px 8px', borderRadius:10, 
        color:'#888', fontSize:'0.7rem', border:'1px solid #333' 
    },
    
    inputBar: {
        display: 'flex', gap: 10, background: '#121212', borderRadius: 14, 
        padding: '8px', border: '1px solid #333', alignItems:'center'
    },
    inputField: {
        flex: 1, background: 'transparent', border: 'none', color: '#fff', 
        padding: '0 8px', fontSize: '1rem', outline:'none', height: 35
    },
    sendBtn: {
        width: 35, height: 35, borderRadius: 10, border: 'none', 
        display: 'flex', alignItems:'center', justifyContent:'center', 
        cursor: 'pointer', boxShadow: '0 0 10px rgba(0,0,0,0.3)'
    },

    // --- SETUP SCREEN STYLES ---
    setupContainer: {
        position: 'fixed', inset: 0, background: '#050505', zIndex: 100000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    },
    setupCard: {
        background: '#121212', width: '100%', maxWidth: 360, padding: 30, borderRadius: 24,
        border: `1px solid ${THEME.border}`, display:'flex', flexDirection:'column', alignItems:'center'
    },
    setupIcon: {
        width: 60, height: 60, borderRadius: '50%', background: `${THEME.primary}20`,
        display:'flex', alignItems:'center', justifyContent:'center', marginBottom: 20
    },
    setupTitle: { margin: 0, color: '#fff', fontSize: '1.8rem', fontFamily:'Lobster, sans-serif' },
    setupDesc: { textAlign: 'center', color: '#777', fontSize:'0.9rem', margin: '10px 0 30px 0' },
    setupInput: {
        width: '100%', background: '#09090b', border: '1px solid #333', color:'#fff',
        padding: 14, borderRadius: 12, fontSize:'1rem', outline: 'none'
    },
    label: { display: 'block', color: '#666', fontSize:'0.8rem', marginBottom: 8, fontWeight:'600' },
    genderBtn: {
        flex: 1, padding: 14, borderRadius: 12, border: '1px solid #333', background: '#09090b',
        color: '#666', cursor: 'pointer', transition: 'all 0.2s', fontSize:'0.9rem'
    },
    activeBoy: { borderColor: THEME.gabriel, color: THEME.gabriel, background: `${THEME.gabriel}10` },
    activeGirl: { borderColor: THEME.sther, color: THEME.sther, background: `${THEME.sther}10` },
    birthBtn: {
        width: '100%', background: THEME.primary, border: 'none', padding: 16,
        borderRadius: 14, fontSize: '1.1rem', fontWeight: 'bold', color: '#000', cursor: 'pointer',
        boxShadow: `0 4px 15px ${THEME.primary}50`
    }
};

export default VirtualSon;