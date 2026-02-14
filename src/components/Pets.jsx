// src/components/Pets.jsx

import { motion } from 'framer-motion';
import { PawPrint } from 'lucide-react';

// COLOQUE AS FOTOS DOS ANIMAIS NA PASTA public/pets
const petPhotos = [
  { src: '/pets/bred.jpg', name: 'bred' },
  { src: '/pets/trevo.jpg', name: 'trevotretoroeovotrevo' },
    { src: '/pets/trevo2.jpg', name: 'trevotretoroeovotrevo' },
    { src: '/pets/bred2.jpg', name: 'bredbredvrbebrbebd' },
  // Adicione mais se tiver
];

const Pets = () => {
  return (
    <div style={{ padding: '4rem 2rem', backgroundColor: '#181818' }}>
      <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-title)', fontSize: '3rem', color: 'var(--primary)', marginBottom: '3rem' }}>
        petstpsepspeptpspepst
      </h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        {petPhotos.map((pet, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
            style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}
          >
            <img src={pet.src} alt={pet.name} style={{ width: '250px', height: '250px', objectFit: 'cover', borderRadius: '8px' }} />
            <p style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <PawPrint size={18} color="var(--primary)" />
              {pet.name}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Pets;