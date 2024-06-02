import React from 'react'
import { Container } from 'react-bootstrap';
import Header from './Components/Header'
import Footer from './Components/Footer'

import { Outlet } from 'react-router-dom';


export const App = () => {
  return (
    <>
      <Header />
      <main className="py-3" style={{ minHeight: 'calc(100vh - 162px)' }}> {/* Adjust the value of 162px according to your header and footer height */}
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  );
};
export default App;
