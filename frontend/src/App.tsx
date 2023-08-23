import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from './Components/Customizable-Button/Button';
import MultiplayerGame from './Components/MultiplayerGame/MultiplayerGame';
import AppStructure from './Components/AppStructure';
import { ThemeProvider, useTheme } from './contexts/theme/ThemeContext';

interface player {
  name: string,
  words: string,
  mistakes: string,
  game_id: string
}

function App() {
  const {theme} = useTheme();

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark' : '';
  }, [theme]);

  return (
    <AppStructure/>
  )
}

export default App;