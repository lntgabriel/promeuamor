// src/components/FinalMessage.jsx (VERSÃO GOLD & DISCRETA 🤫)

import { motion } from 'framer-motion';
import DrawingHeart from './DrawingHeart';
import { Sparkles } from 'lucide-react';

const themeColor = "#FACC15"; // Amarelo favorito

const FinalMessage = () => {
  return (
    <div style={{
      padding: '6rem 2rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      background: '#0a0a0a', // Fundo bem dark
      color: '#fff',
      position: 'relative'
    }}>
      
      {/* Decoração sutil de fundo */}
      <div style={{ position: 'absolute', top: '10%', right: '10%', opacity: 0.1 }}>
        <Sparkles size={100} color={themeColor} />
      </div>

      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1 }}
      >
        <DrawingHeart />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <h2 style={{ 
          fontFamily: "'Lobster', cursive", 
          fontSize: '3rem', 
          color: themeColor, 
          marginTop: '2rem',
          textShadow: `0 0 15px ${themeColor}40`
        }}>
          Pra minha M.
        </h2>
        
        <div style={{ 
          maxWidth: '650px', 
          marginTop: '1.5rem',
          lineHeight: '1.8', 
          fontSize: '1.1rem', 
          fontFamily: "'Poppins', sans-serif",
          color: '#e5e5e5' 
        }}>
          <p>
            Eu queria te dar o mundo inteiro agora, mas como eu ainda não tenho todo aquele dinheiro que a gente fala que vai ter, eu comecei te dando esse pedacinho da internet KAKAKAKAKAKA.
          </p>
          
          <p>
            Cada linha de código, cada cor amarela e cada foto aqui foi escolhida pensando em você. É só uma forma de dizer o quanto você é incrível e o quanto você mudou meus dias (e meu sono, mas valeu a pena ficar acordado 23h em call).
          </p>
          
          <p>
            Obrigado por ser minha parceira, minha melhor amiga e o amor da minha vida. Logo logo a gente vai estar junto na nossa casa, com nossos bichinhos e nossa bagunça organizada.
          </p>
          
          <p style={{ marginTop: '2rem', fontWeight: 'bold', fontStyle: 'italic', color: '#fff' }}>
            Eu te amo infinitamente.<br/>
            Do seu neném,
          </p>

          <h3 style={{ 
            fontFamily: "'Lobster', cursive", 
            fontSize: '2rem', 
            color: '#f87171',
            marginTop: '0.5rem'
          }}>
            Gabriel
          </h3>
        </div>
      </motion.div>
    </div>
  );
};

export default FinalMessage;