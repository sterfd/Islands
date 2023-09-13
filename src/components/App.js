import React from 'react';
import { Game } from "./Menu/MainMenu";
import Worker from "worker-loader!./Worker.js";

export default function App() {
  return (
    <div className='game'>
      <Game />
    </div>
  );
}