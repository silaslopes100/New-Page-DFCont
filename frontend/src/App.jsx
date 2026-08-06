import React from 'react';
import { Navbar } from './components/common/Navbar/Navbar';
import { Footer } from './components/common/Footer/Footer';
import { Home } from './components/pages/Home/Home';

function App() {
  return (
    <>
      <Navbar />
      <Home />
      <Footer />
    </>
  );
}

export default App;
