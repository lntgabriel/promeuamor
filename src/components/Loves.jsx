import { motion } from 'framer-motion';
import { Music, Coffee, Cat, BookOpen } from 'lucide-react'; // Escolha icones que combinem

const items = [
  { icon: <Coffee size={30} />, label: "Café da manhã", desc: "Principalmente se tiver pão de queijo." },
  { icon: <Music size={30} />, label: "Taylor Swift", desc: "A trilha sonora dos dias dela." },
  { icon: <Cat size={30} />, label: "Gatinhos", desc: "Qualquer bicho peludo, na verdade." },
  { icon: <BookOpen size={30} />, label: "Ler na chuva", desc: "O momento de paz." },
];

const Loves = () => {
  return (
    <div style={{ background: '#fff', padding: '4rem 2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Coisas que ela ama</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '2rem', 
        maxWidth: '1000px', 
        margin: '0 auto' 
      }}>
        {items.map((item, index) => (
          <motion.div 
            key={index}
            whileHover={{ scale: 1.05 }}
            style={{ padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderRadius: '15px', textAlign: 'center' }}
          >
            <div style={{ color: '#d4a373', marginBottom: '1rem' }}>{item.icon}</div>
            <h3 style={{ margin: '10px 0' }}>{item.label}</h3>
            <p style={{ fontSize: '0.9rem' }}>{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Loves;