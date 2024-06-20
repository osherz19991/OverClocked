import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Header from './Components/Header'
import Footer from './Components/Footer'

import { Outlet } from 'react-router-dom';


export const App = () => {
  useEffect(() => {
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1.0'; 
    document.head.appendChild(viewportMeta);
  }, []);

  return (
    <>
      <Header />
      <main className="py-3" style={{ minHeight: 'calc(100vh - 162px)' }}> {}
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  );
};
export default App;
