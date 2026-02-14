import { motion } from 'framer-motion';

// Agora usando seus arquivos reais!
const photos = [
  { id: 1, src: "/fotos-dela/foto-4.jpg", caption: "Momentos especiais" }, 
  { id: 2, src: "/fotos-dela/foto-5.jpg", caption: "Simplicidade" },
  { id: 3, src: "/fotos-dela/foto-6.jpg", caption: "Sorrisão" },
  { id: 4, src: "/fotos-dela/foto-7.jpg", caption: "Lindeza" },
  { id: 5, src: "/fotos-dela/foto-8.jpg", caption: "Charme puro" },
  { id: 6, src: "/fotos-dela/foto-9.jpg", caption: "Meu amor" },
  // Pode adicionar até a foto 15 aqui se quiser
];

const PhotoGallery = () => {
  return (
    <div style={{ padding: '2rem 1.5rem', background: '#0a0a0a' }}>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-20%" }}
        style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}
      >
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.9rem', letterSpacing: '2px', color: '#f87171' }}>
          GALERIA
        </p>
        <h2 style={{ fontFamily: "'Lobster', cursive", fontSize: '3rem' }}>
          Melhores Momentos
        </h2>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ margin: "-50px" }} 
            transition={{ duration: 0.8 }}
            style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}
          >
            <div style={{
              overflow: 'hidden',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              transform: index % 2 === 0 ? 'rotate(-2deg)' : 'rotate(2deg)',
              border: '4px solid #1a1a1a',
              background: '#1a1a1a'
            }}>
                <img 
                  src={photo.src} 
                  alt={photo.caption}
                  style={{ 
                    display: 'block',
                    width: '100%', 
                    maxWidth: '400px', // Limita largura pra não estourar em tela grande
                    height: 'auto',
                    objectFit: 'cover' 
                  }} 
                />
            </div>
          </motion.div>
        ))}
      </div>
      
      <p style={{ textAlign: 'center', marginTop: '3rem', color: '#444', fontStyle: 'italic', fontSize: '0.8rem' }}>
        ...e muitos mais para vir.
      </p>
    </div>
  );
};

export default PhotoGallery;