// src/components/Farol.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Heart, Zap, Coffee, Moon, Ghost, AlertTriangle } from 'lucide-react';

const themeColor = "#FACC15";

const Farol = () => {
  const [status, setStatus] = useState({ 
    papai: { mood: "Treinando", lastSeen: "" },
    mamãe: { mood: "Dormindo", lastSeen: "" },
    isPulsing: false,
    whoPulsed: ""
  });

  const [localMood, setLocalMood] = useState("");

  // Escuta o banco de dados em tempo real
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "connection", "current"), (doc) => {
      if (doc.exists()) {
        setStatus(doc.data());
      }
    });
    return () => unsub();
  }, []);

  // Enviar o "Toque" (Pulso)
  const sendTouch = async () => {
    await updateDoc(doc(db, "connection", "current"), {
      isPulsing: true,
      whoPulsed: "gabriel", // Trocar pra "sther" no dela se quiser
      pulsedAt: serverTimestamp()
    });
    
    // Desliga o brilho depois de 1 segundo
    setTimeout(async () => {
      await updateDoc(doc(db, "connection", "current"), { isPulsing: false });
    }, 1000);
  };

  const updateMood = async (newMood) => {
    await updateDoc(doc(db, "connection", "current"), {
      "gabriel.mood": newMood // Aqui voce alterna entre gabriel e sther conforme o uso
    });
  };

  return (
    <div style={{ minHeight: '100vh', padding: '6rem 20px', backgroundColor: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* 1. O CORAÇÃO DE CONEXÃO */}
      <div style={{ position: 'relative', margin: '40px 0' }}>
        <AnimatePresence>
          {status.isPulsing && (
            <motion.div
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: themeColor, borderRadius: '50%', zIndex: 0 }}
            />
          )}
        </AnimatePresence>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={sendTouch}
          style={{ 
            width: '120px', height: '120px', borderRadius: '50%', background: status.isPulsing ? themeColor : '#111', 
            border: `4px solid ${themeColor}`, cursor: 'pointer', zIndex: 1, position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: status.isPulsing ? `0 0 50px ${themeColor}` : 'none'
          }}
        >
          <Heart fill={status.isPulsing ? "#000" : themeColor} size={50} color={status.isPulsing ? "#000" : themeColor} />
        </motion.button>
        <p style={{ textAlign: 'center', marginTop: '15px', color: themeColor, fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
          {status.isPulsing ? `${status.whoPulsed} te deu um toque!` : "Toque para sentir o outro"}
        </p>
      </div>

      {/* 2. PAINEL DE VIBE */}
      <div style={{ width: '100%', maxWidth: '400px', background: '#111', padding: '20px', borderRadius: '25px', border: '1px solid #222' }}>
        <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '20px', textAlign: 'center', fontFamily: "'Lobster', cursive" }}>Status do Casal</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: `2px solid ${themeColor}`, margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>G</div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: themeColor }}>{status.gabriel?.mood || "Online"}</p>
          </div>
          <div style={{ alignSelf: 'center', color: '#333' }}><Zap size={20}/></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #f87171', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>S</div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#f87171' }}>{status.sther?.mood || "Online"}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {['Sono', 'Academia', 'Escola', 'Saudade', 'Noia', 'Comendo'].map(vibe => (
            <button 
              key={vibe}
              onClick={() => updateMood(vibe)}
              style={{ padding: '8px', borderRadius: '10px', border: 'none', background: '#222', color: '#888', fontSize: '0.7rem', cursor: 'pointer' }}
            >
              {vibe === 'Sono' && <Moon size={14}/>}
              {vibe === 'Comendo' && <Coffee size={14}/>}
              {vibe === 'Noia' && <Ghost size={14}/>}
              {vibe}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', borderRadius: '15px', background: '#e11d4815', border: '1px solid #e11d4830', display: 'flex', gap: '15px', alignItems: 'center', maxWidth: '400px' }}>
        <AlertTriangle color="#f87171" size={24}/>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#f87171' }}><strong>Aviso:</strong> Beijar o celular não transmite a sensação real (ainda), mas a gente tá tentando.</p>
      </div>
    </div>
  );
};

export default Farol;