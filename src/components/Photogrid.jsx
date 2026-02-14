import { motion } from 'framer-motion';

const photos = [
  // Coloque os nomes das fotos que estão na sua pasta public
  // Se tiver poucas, repita algumas ou use placeholders
  "/foto1.jpg", 
  "/foto2.jpg", 
  "/foto3.jpg", 
  "/foto4.jpg",
];

const PhotoGrid = () => {
  return (
    <div style={{ padding: '4rem 2rem', background: '#fafafa' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Nossos Momentos</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '15px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {photos.map((src, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }} // Anima só na primeira vez que aparece
            whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
            style={{ 
              overflow: 'hidden', 
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          >
            <img 
              src={src} 
              alt={`Foto ${index}`} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGrid;