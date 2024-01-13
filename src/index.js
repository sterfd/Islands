import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles.css';
import MainMenu from './components/Menu/MainMenu';
import About from './components/Menu/About';
import Tutorial from './components/Menu/Tutorial/Tutorial';
import Play from './components/Menu/Play';
import User from './components/Menu/User/UserInfo';
import Game from './components/Game';
import './components/firebase';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<MainMenu />} />
        <Route path="About" element={<About />} />
        <Route path="Tutorial" element={<Tutorial />} />
        <Route path="Play" element={<Play />} />
        <Route path="User" element={<User />} />
        <Route path='Game' element={<Game />} />
      </Routes>
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);