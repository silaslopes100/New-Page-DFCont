import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar/Navbar';
import { Footer } from './components/common/Footer/Footer';
import { Home } from './components/pages/Home/Home';
import { About } from './components/pages/About/About';
import { Blog } from './components/pages/Blog/Blog';
import { Contact } from './components/pages/Contact/Contact';
import { PlansPage } from './components/pages/PlansPage/PlansPage';
import { ComoFunciona } from './components/pages/ComoFunciona/ComoFunciona';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planos" element={<PlansPage />} />
        <Route path="/como-funciona" element={<ComoFunciona />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contato" element={<Contact />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
