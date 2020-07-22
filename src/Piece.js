import React from 'react';
import './Piece.css';

export default function Piece({ colour, selected, onClick }) {
  let pieceClassName;
  if (colour === 1) {
    pieceClassName = 'piece white-piece';
  } else if (colour === 2) {
    pieceClassName = 'piece black-piece';
  } else if (colour === 3) {
    pieceClassName = 'piece white-king';
  } else if (colour === 4) {
    pieceClassName = 'piece black-king';
  }

  if (selected) {
    pieceClassName += ' selected';
  }

  return (colour > 2 ?
    <span className={pieceClassName} onClick={onClick}>K</span> :
    <span className={pieceClassName} onClick={onClick} />
  );
}