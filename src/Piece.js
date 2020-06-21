import React from 'react';
import './Piece.css';

export default function Piece({ color, selected, onClick }) {
  if (color === 0) return null;
  
  let pieceClassName;
  if (color === 1) {
    pieceClassName = 'piece red-piece';
  } else if (color === 2) {
    pieceClassName = 'piece black-piece';
  }

  if (selected) {
    pieceClassName += ' selected';
  }

  return <span class={pieceClassName} onClick={onClick} />;
}