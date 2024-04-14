import React from 'react'
import { Container } from 'react-bootstrap';
import Header from './Components/Header'

export const App = () => {
  return(
    <>
    <Header/>
    <main className="py-3">
      <Container>
      <h1>Welcome to OverClocked</h1>
      </Container>
</main>
</>
);
};
export default App;
