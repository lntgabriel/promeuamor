// src/components/VirtualSon.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { doc, onSnapshot, updateDoc, increment, setDoc, arrayUnion } from 'firebase/firestore';
import { Send, RotateCcw, Sparkles, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- TEMA ---
const THEME = {
  primary: "#fbbf24",
  bgGradient: "linear-gradient(to bottom, #09090b, #18181b)",
  bgSolid: "#09090b",
  glass: "rgba(18, 18, 18, 0.85)",
  border: "rgba(255,255,255,0.08)",
  gabriel: "#3b82f6",
  sther: "#f472b6",
};

// --- CÉREBRO DO BEBÊ (IA BASICA) ---
// Analisa o texto e a idade para responder algo coerente
const getSmartReply = (text, age, childName) => {
    const lower = text.toLowerCase();
    
    // 1. Respostas de Amor
    if (lower.includes('te amo') || lower.includes('amo você') || lower.includes('linda') || lower.includes('lindo')) {
        if (age < 2) return "❤️ (risadinha fofa)";
        if (age < 5) return `Titi amo também! ❤️`;
        if (age < 12) return "Também te amo! Me dá um abraço?";
        return "Amo vocês, meus velhos! ❤️";
    }

    // 2. Comida / Fome
    if (lower.includes('fome') || lower.includes('comida') || lower.includes('lanchar') || lower.includes('comer')) {
        if (age < 2) return "MAMA! LEITE! 🍼";
        if (age < 5) return "Eu quero batata frita!";
        if (age < 15) return "Pede um iFood aí mãe/pai?";
        return "Bora jantar fora hoje?";
    }

    // 3. Saudade / Onde está
    if (lower.includes('saudade') || lower.includes('cadê')) {
        if (age < 5) return "Tô aqui brincando!";
        return "Tô aqui família, relaxa.";
    }

    // 4. Dinheiro (Só funciona se for mais velho)
    if (lower.includes('dinheiro') || lower.includes('pix') || lower.includes('comprar')) {
        if (age > 10) return "Opa, aceito! 💸";
        return "O que é isso? É de comer?";
    }

    // 5. Palavrões (Educação)
    if (lower.includes('porra') || lower.includes('caralho') || lower.includes('merda')) {
        return "Ei! Olha a boca! 😡";
    }

    return null; // Se não encontrar nada específico, retorna null
};

// Frases aleatórias para quando ele evolui (Level Up)
const getLevelUpPhrase = (age) => {
  if (age < 1.5) return ["buáááá 😭", "unheeeeeeeeeee", "gugu dada", "zZzZz..."];
  if (age < 5) return ["eu quero doce!", "não quero banho", "brincar!", "olha o que eu sei fazer!"];
  if (age < 12) return ["que tédio", "não quero ir pra escola", "compra robux?", "to com fome"];
  if (age < 18) return ["mãe eu sou gay", "me dá dinheiro?", "vou sair tchau", "que mico", "preciso de pix"];
  if (age < 30) return ["ai minhas costas", "vou ser pai/mãe", "preciso trabalhar", "boletos..."];
  return ["oi família", "dor nas costas...", "vamos lanchar", "sdds época boa"];
};

const VirtualSon = ({ onClose }) => { 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [user, setUser] = useState("gabriel"); 
  const scrollRef = useRef(null);

  // CONEXÃO COM O BANCO
  useEffect(() => {
    const docRef = doc(db, "virtualSon", "global");
    const unsub = onSnapshot(docRef, (snapshot) => {
      setLoading(false);
      if (snapshot.exists()) {
        setData(snapshot.data());
      } else {
        // Inicializa com lastEvolutionDate vazio
        setData({ 
            count: 0, 
            papaiReady: false, 
            mamaeReady: false, 
            name: "", 
            gender: "menino", 
            chatHistory: [],
            lastEvolutionDate: "" 
        });
      }
    }, (error) => {
      console.error("Erro Firebase:", error);
    });
    return () => unsub();
  }, []);

  // Scroll automático
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [data?.chatHistory]);

  const fullReset = async () => {
    if(!window.confirm("Isso vai matar o bebê e começar do zero. Tem certeza?")) return;
    await setDoc(doc(db, "virtualSon", "global"), {
      count: 0, chatHistory: [], name: "", gender: "menino", 
      papaiReady: false, mamaeReady: false, lastEvolutionDate: ""
    });
  };

  const handleBirth = async (name, gender) => {
    if (!name.trim()) return alert("Dê um nome ao bebê!");
    confetti({ particleCount: 200, spread: 150, origin: { y: 0.6 }, colors: [THEME.primary, '#ffffff'] });
    
    await setDoc(doc(db, "virtualSon", "global"), {
        name: name,
        gender: gender,
        count: 0.1,
        lastEvolutionDate: new Date().toISOString().split('T')[0], // Marca hoje como nascido
        chatHistory: [{
            user: 'system',
            text: `🌟 ${name} nasceu! Bem-vindos à família.`,
            id: Date.now()
        }],
        papaiReady: false,
        mamaeReady: false
    }, { merge: true });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const docRef = doc(db, "virtualSon", "global");
    const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const todayDate = new Date().toISOString().split('T')[0]; // Pega data formato "2023-10-25"
    
    // 1. Mensagem do Pai/Mãe
    const newMessage = { user, text: input, time: timestamp, id: Date.now() };
    setInput(""); 

    // Lista de atualizações que faremos no banco
    let updates = { 
        chatHistory: arrayUnion(newMessage)
    };

    // 2. Verifica se o filho deve responder algo (CÉREBRO INTELIGENTE)
    // Ele responde baseada na mensagem, independente de evoluir ou não
    const realAge = (data.count || 0) * 0.5;
    const smartReplyText = getSmartReply(input, realAge, data.name);
    
    if (smartReplyText) {
        const childSmartMsg = {
            user: 'child',
            text: smartReplyText,
            time: timestamp,
            id: Date.now() + 50 // ID ligeiramente maior pra aparecer depois
        };
        // Adiciona a resposta do filho na lista de updates
        updates.chatHistory = arrayUnion(newMessage, childSmartMsg);
    }

    // 3. Lógica de Evolução (APENAS UMA VEZ POR DIA)
    const myRoleReady = user === 'gabriel' ? 'papaiReady' : 'mamaeReady';
    const opponentReadyKey = user === 'gabriel' ? 'mamaeReady' : 'papaiReady';
    
    // Eu estou pronto agora
    updates[myRoleReady] = true;

    const opponentIsReady = data[opponentReadyKey]; // O outro já mandou msg hoje?
    const alreadyEvolvedToday = data.lastEvolutionDate === todayDate;

    // SE: O outro tá pronto E (Não evoluiu hoje OU nunca evoluiu)
    if (opponentIsReady && !alreadyEvolvedToday) {
        
        // --- EVOLUÇÃO ---
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 }, colors: [THEME.primary] });
        
        const newAgeCount = (data.count || 0) + 1;
        const newRealAge = newAgeCount * 0.5;
        const phrases = getLevelUpPhrase(newRealAge);
        
        const levelUpMsg = {
            user: 'system',
            text: `🎂 ${newRealAge % 1 === 0 ? newRealAge.toFixed(0) : newRealAge} Anos`,
            id: Date.now() + 100
        };
        
        // Frase aleatória da idade (se ele já não tiver respondido algo inteligente acima)
        if (!smartReplyText) {
            const childRandomMsg = {
                user: 'child',
                text: phrases[Math.floor(Math.random() * phrases.length)],
                time: timestamp,
                id: Date.now() + 150
            };
            // Se não teve resposta inteligente, usa a aleatória + mensagem do usuário + level up
            updates.chatHistory = arrayUnion(newMessage, levelUpMsg, childRandomMsg);
        } else {
             // Se teve resposta inteligente, adiciona ela + mensagem do usuário + level up
             const childSmartMsg = { user: 'child', text: smartReplyText, time: timestamp, id: Date.now() + 50 };
             updates.chatHistory = arrayUnion(newMessage, childSmartMsg, levelUpMsg);
        }

        updates.count = increment(1);
        updates.lastEvolutionDate = todayDate; // Trava a data de hoje
        
        // Opcional: Resetar os "Ready" pra forçar conversa amanhã? 
        // Eu prefiro manter true para saberem que já falaram hoje, 
        // mas a data (lastEvolutionDate) é que vai impedir de crescer de novo.
        updates.papaiReady = false; 
        updates.mamaeReady = false; 

    } else {
        // Se já evoluiu hoje, ou o outro não tá pronto, só salva a conversa (e a resposta inteligente se tiver)
        // O update já foi configurado no passo 1 e 2
    }

    await updateDoc(docRef, updates);
  };

  if (loading) return <div style={{...styles.fullScreen, justifyContent:'center', alignItems:'center'}}>Conectando ao universo...</div>;
  if (!data) return null;

  if (!data.name || data.count === 0) {
     return <SetupScreen onConfirm={handleBirth} onClose={onClose} />;
  }

  const realAge = data.count * 0.5;
  const isBoy = data.gender === 'menino';
  const getAvatar = () => {
     if (realAge < 1) return isBoy ? '👶🏽' : '👶🏼';
     if (realAge < 5) return isBoy ? '🧒🏽' : '👧🏼';
     if (realAge < 13) return '🎒';
     if (realAge < 18) return '🎧';
     if (realAge < 30) return isBoy ? '🧔🏽‍♂️' : '👩🏼‍💼';
     return '🐢';
  }
  const avatar = getAvatar();
  const userColor = user === 'gabriel' ? THEME.gabriel : THEME.sther;

  return (
    <div style={styles.fullScreen}>
        <div style={styles.bgDecoration} />
        <div style={styles.header}>
            <div style={{display:'flex', alignItems:'center', gap: 10}}>
                <button onClick={onClose} style={{...styles.iconBtn, marginRight: 5}}>
                    <ArrowLeft size={24} />
                </button>
                <div style={styles.avatarRing}>{avatar}</div>
                <div>
                    <h2 style={styles.headerName}>{data.name}</h2>
                    <span style={styles.headerAge}>{realAge} ANOS</span>
                </div>
            </div>
            <button onClick={fullReset} style={styles.iconBtn}><RotateCcw size={20} /></button>
        </div>

        <div style={styles.chatArea} ref={scrollRef}>
            {data.chatHistory.map((msg, i) => (
                <MessageItem key={i} msg={msg} user={user} childName={data.name} avatar={avatar} />
            ))}
        </div>

        <div style={styles.footerWrapper}>
            <div style={styles.userToggleContainer}>
                <div style={styles.toggleBg}>
                    <button onClick={() => setUser('gabriel')} style={{...styles.toggleBtn, opacity: user==='gabriel'?1:0.5, color: THEME.gabriel}}>Eu sou o Pai</button>
                    <div style={styles.verticalDivider}></div>
                    <button onClick={() => setUser('sther')} style={{...styles.toggleBtn, opacity: user==='sther'?1:0.5, color: THEME.sther}}>Eu sou a Mãe</button>
                </div>
            </div>

            <div style={{...styles.inputBar, borderColor: `${userColor}40`}}>
                <input 
                    value={input} 
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder={data.lastEvolutionDate === new Date().toISOString().split('T')[0] ? "Já cresci hoje, mas pode falar..." : "Escreva sua mensagem..."}
                    style={styles.inputField}
                />
                <button onClick={sendMessage} style={{...styles.sendBtn, backgroundColor: userColor}}>
                    <Send size={18} color="#fff"/>
                </button>
            </div>
        </div>
    </div>
  );
};

// --- SUB-COMPONENTES IGUAIS AO ANTERIOR ---
const SetupScreen = ({ onConfirm, onClose }) => {
    const [name, setName] = useState("");
    const [gender, setGender] = useState("menino");
    return (
        <div style={styles.setupContainer}>
             <button onClick={onClose} style={styles.setupCloseBtn}><ArrowLeft size={28} color="#fff" /></button>
            <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} style={styles.setupCard}>
                <div style={styles.setupIcon}><Sparkles size={32} color={THEME.primary}/></div>
                <h2 style={styles.setupTitle}>Uma Nova Vida</h2>
                <div style={{width:'100%', marginBottom: 20, marginTop: 20}}>
                    <label style={styles.label}>Nome</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome do bebê..." style={styles.setupInput}/>
                </div>
                <div style={{display:'flex', gap: 10, width: '100%', marginBottom: 25}}>
                    <button onClick={() => setGender('menino')} style={{...styles.genderBtn, ...(gender === 'menino' ? styles.activeBoy : {})}}>Menino 👶🏽</button>
                    <button onClick={() => setGender('menina')} style={{...styles.genderBtn, ...(gender === 'menina' ? styles.activeGirl : {})}}>Menina 👧🏼</button>
                </div>
                <button onClick={() => onConfirm(name, gender)} style={styles.birthBtn}>NASCER ✨</button>
            </motion.div>
        </div>
    );
};

const MessageItem = ({ msg, user, childName, avatar }) => {
    if(msg.user === 'system') return <div style={styles.systemMsgContainer}><div style={styles.systemLine}></div><span style={styles.systemText}>{msg.text}</span><div style={styles.systemLine}></div></div>
    if(msg.user === 'child') return <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} style={styles.childContainer}><div style={styles.childAvatar}>{avatar}</div><div style={styles.childBubble}><strong style={{display:'block', fontSize:'0.7rem', color: THEME.primary, marginBottom: 2}}>{childName}</strong>{msg.text}</div></motion.div>
    const isMe = msg.user === user;
    const bubbleColor = msg.user === 'gabriel' ? THEME.gabriel : THEME.sther;
    return <div style={{display:'flex', flexDirection:'column', alignItems: isMe ? 'flex-end' : 'flex-start', margin: '4px 0'}}><div style={{...styles.bubble, background: isMe ? `linear-gradient(135deg, ${bubbleColor}15, ${bubbleColor}05)` : '#121212', border: `1px solid ${isMe ? `${bubbleColor}40` : '#333'}`, borderBottomRightRadius: isMe ? 2 : 16, borderBottomLeftRadius: isMe ? 16 : 2}}><span style={{fontSize: '0.95rem', color: '#eee'}}>{msg.text}</span></div></div>;
}

const styles = {
    fullScreen: { position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', flexDirection: 'column', background: THEME.bgSolid, color: '#fff', fontFamily: "'Inter', sans-serif" },
    bgDecoration: { position: 'absolute', top: 0, left: 0, width:'100%', height:'100%', background: THEME.bgGradient, zIndex: -1, pointerEvents:'none' },
    header: { padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: THEME.glass, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${THEME.border}`, zIndex: 50 },
    avatarRing: { width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: '1.4rem', border: `1px solid ${THEME.primary}` },
    headerName: { margin: 0, fontSize: '1.1rem', fontWeight: '700' },
    headerAge: { fontSize: '0.75rem', color: THEME.primary, fontWeight:'bold' },
    iconBtn: { background: 'transparent', border:'none', color: '#999', cursor: 'pointer', padding:8, display:'flex', alignItems:'center', justifyContent:'center' },
    chatArea: { flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '160px', display: 'flex', flexDirection: 'column', gap: '8px' },
    bubble: { padding: '10px 16px', borderRadius: 16, color: '#fff', maxWidth: '85%', wordBreak: 'break-word' },
    systemMsgContainer: { display: 'flex', alignItems:'center', gap: 10, margin: '20px 0', opacity: 0.8 },
    systemLine: { flex: 1, height: 1, background: '#333' },
    systemText: { fontSize: '0.75rem', color: THEME.primary, textTransform: 'uppercase', fontWeight:'bold' },
    childContainer: { alignSelf: 'center', display: 'flex', flexDirection: 'column', alignItems:'center', margin: '15px 0' },
    childAvatar: { fontSize: '2rem', marginBottom: -10, zIndex: 1 },
    childBubble: { background: `linear-gradient(180deg, ${THEME.primary}20, #111)`, border: `1px solid ${THEME.primary}50`, padding: '12px 20px', borderRadius: 20, textAlign: 'center', minWidth: 150, color: '#fff', fontSize:'0.9rem' },
    footerWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(15px)', borderTop: `1px solid ${THEME.border}`, padding: '15px 20px', paddingBottom: 'max(15px, env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column', gap: 12, zIndex: 100 },
    userToggleContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' },
    toggleBg: { background: '#1c1c1c', borderRadius: 20, display:'flex', padding: 4, border: '1px solid #333' },
    toggleBtn: { background: 'transparent', border:'none', padding: '6px 14px', fontSize: '0.75rem', fontWeight:'bold', cursor:'pointer', transition: '0.3s' },
    verticalDivider: { width: 1, background: '#333', height: 15, alignSelf: 'center' },
    typingBubble: { position: 'absolute', right: 0, background: '#222', padding:'2px 8px', borderRadius:10, color:'#888', fontSize:'0.7rem', border:'1px solid #333' },
    inputBar: { display: 'flex', gap: 10, background: '#121212', borderRadius: 14, padding: '8px', border: '1px solid #333', alignItems:'center' },
    inputField: { flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '0 8px', fontSize: '1rem', outline:'none', height: 35 },
    sendBtn: { width: 35, height: 35, borderRadius: 10, border: 'none', display: 'flex', alignItems:'center', justifyContent:'center', cursor: 'pointer' },
    setupContainer: { position: 'fixed', inset: 0, background: '#050505', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
    setupCloseBtn: { position: 'absolute', top: 20, left: 20, background: 'transparent', border: 'none', cursor: 'pointer', padding: 10, zIndex: 100001 },
    setupCard: { background: '#121212', width: '100%', maxWidth: 360, padding: 30, borderRadius: 24, border: `1px solid ${THEME.border}`, display:'flex', flexDirection:'column', alignItems:'center' },
    setupIcon: { width: 60, height: 60, borderRadius: '50%', background: `${THEME.primary}20`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom: 20 },
    setupTitle: { margin: 0, color: '#fff', fontSize: '1.8rem', fontFamily:'Lobster, sans-serif' },
    setupInput: { width: '100%', background: '#09090b', border: '1px solid #333', color:'#fff', padding: 14, borderRadius: 12, fontSize:'1rem', outline: 'none' },
    label: { display: 'block', color: '#666', fontSize:'0.8rem', marginBottom: 8, fontWeight:'600' },
    genderBtn: { flex: 1, padding: 14, borderRadius: 12, border: '1px solid #333', background: '#09090b', color: '#666', cursor: 'pointer', transition: 'all 0.2s', fontSize:'0.9rem' },
    activeBoy: { borderColor: THEME.gabriel, color: THEME.gabriel, background: `${THEME.gabriel}10` },
    activeGirl: { borderColor: THEME.sther, color: THEME.sther, background: `${THEME.sther}10` },
    birthBtn: { width: '100%', background: THEME.primary, border: 'none', padding: 16, borderRadius: 14, fontSize: '1.1rem', fontWeight: 'bold', color: '#000', cursor: 'pointer', boxShadow: `0 4px 15px ${THEME.primary}50` }
};

export default VirtualSon;