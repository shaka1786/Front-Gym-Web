import universidadImg from '../assets/universidad.PNG';
import universidad2 from '../assets/universidad2.PNG';

export default function Home() {
return (
    <div style={{ textAlign: 'left', marginTop: '2rem' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <img
        src={universidadImg}
        alt="Universidad Salazar y Herrera"
        style={{
            width: '60%',
            maxWidth: '1200px',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}
        />
        <img
        src={universidad2}
        alt="Campus Salazar y Herrera"
        style={{
            width: '40%',
            maxWidth: '800px',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
        />
    </div>
    </div>
);
}
