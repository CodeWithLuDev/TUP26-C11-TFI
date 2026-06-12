import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Navbar } from './Navbar';

export function Layout() {
  return (
    <div className="relative min-h-screen">
      <video
        autoPlay
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 bg-black/60" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <Navbar />
        <main className="w-full mx-auto px-2 sm:px-4 py-6 flex-1" style={{ maxWidth: '80rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
