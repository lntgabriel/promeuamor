import { Heart, Gamepad2, Image, Sparkles, Flame, Baby } from 'lucide-react'; // Troquei Home por Sparkles

const BottomNav = ({ activeTab, setActiveTab }) => {
  // Tirei o 'home' e comecei com 'universe'
  const tabs = [
    { id: 'universe', icon: <Sparkles size={24} />, label: "Universo" },
    { id: 'gallery', icon: <Image size={24} />, label: "Fotos" },
    { id: 'streak', icon: <Baby size={24} />, label: "Herdeiro" },
    { id: 'game', icon: <Gamepad2 size={24} />, label: "Jogos" },
];

  return (
    <div style={{
      position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
      width: 'auto', // Largura automática
      background: 'rgba(20, 20, 20, 0.85)', backdropFilter: 'blur(10px)',
      borderRadius: '50px', padding: '8px',
      display: 'flex', gap: '8px',
      zIndex: 10000, border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: isActive ? '#FACC15' : 'transparent', // Amarelo quando ativo
              border: 'none',
              color: isActive ? '#000' : '#888',
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 15px',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'background 0.2s ease-in-out'
            }}
          >
            {tab.icon}
            {isActive && <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{tab.label}</span>}
          </button>
        )
      })}
    </div>
  );
};

export default BottomNav;