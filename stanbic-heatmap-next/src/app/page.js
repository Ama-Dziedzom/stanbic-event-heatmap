'use client';
import dynamic from 'next/dynamic';

const StanbicMap = dynamic(() => import('../components/StanbicMap'), {
  ssr: false,
  loading: () => <div style={{ height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>Loading Map...</div>
});

export default function Home() {
  return (
    <main style={{ height: '100vh', width: '100vw' }}>
      <StanbicMap />
    </main>
  );
}
