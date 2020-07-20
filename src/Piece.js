import React from 'react';
import './Piece.css';

export default function Piece({ colour, selected, onClick }) {  
  let pieceClassName;
  if (colour === 1) {
    pieceClassName = 'piece red-piece';
  } else if (colour === 2) {
    pieceClassName = 'piece black-piece';
  }

  if (selected) {
    pieceClassName += ' selected';
  }

  return <span className={pieceClassName} onClick={onClick} />;
}