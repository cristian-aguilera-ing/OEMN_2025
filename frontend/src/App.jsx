import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

function App() {
  // 1. Obtenemos la ruta actual
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      {/* Solo mostramos el Footer si NO estamos en '/designer' */}
      {pathname !== '/designer' && <Footer />}
    </div>
  );
}

export default App;