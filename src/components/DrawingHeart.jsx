    // src/components/DrawingHeart.jsx

    import { motion } from 'framer-motion';

    const DrawingHeart = () => {
    const draw = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: { delay: 0.5, type: "spring", duration: 3, bounce: 0 },
            opacity: { delay: 0.5, duration: 0.01 }
        }
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <motion.svg
            width="180"
            height="180"
            viewBox="0 0 600 600"
            initial="hidden"
            animate="visible"
            style={{ overflow: 'visible' }} // Garante que o brilho não seja cortado
        >
            <motion.path
            d="M 300 135 C 290 90 250 40 180 40 C 110 40 40 100 40 200 C 40 320 200 440 300 560 C 400 440 560 320 560 200 C 560 100 490 40 420 40 C 350 40 310 90 300 135"
            variants={draw}
            stroke="#ff4d4d"       // Cor do traço (vermelho vivo)
            strokeWidth="15"       // Espessura da linha
            fill="transparent"     // Começa transparente
            strokeLinecap="round"
            strokeLinejoin="round"
            />
            
            {/* Preenchimento e Pulsar depois de desenhar */}
            <motion.path
            d="M 300 135 C 290 90 250 40 180 40 C 110 40 40 100 40 200 C 40 320 200 440 300 560 C 400 440 560 320 560 200 C 560 100 490 40 420 40 C 350 40 310 90 300 135"
            initial={{ fill: "transparent", opacity: 0 }}
            animate={{ fill: "#ff0040", opacity: 1, scale: [1, 1.1, 1] }} // Pulsa
            transition={{
                default: { delay: 3, duration: 1 }, // Começa depois de terminar de desenhar (3s)
                scale: { delay: 4, repeat: Infinity, duration: 1.5 } // Fica pulsando pra sempre
            }}
            stroke="none"
            />
        </motion.svg>
        </div>
    );
    };

    export default DrawingHeart;