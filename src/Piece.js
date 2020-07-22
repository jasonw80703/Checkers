import React from 'react';
import './Piece.css';

export default function Piece({ colour, selected, onClick }) {
  let pieceClassName;
  if (colour === 1) {
    pieceClassName = 'piece white-piece';
  } else if (colour === 2) {
    pieceClassName = 'piece black-piece';
  } else if (colour === 3 || colour === 5 || colour === 7) {
    pieceClassName = 'piece white-king';
  } else if (colour === 4 || colour === 6 || colour === 8) {
    pieceClassName = 'piece black-king';
  }

  if (selected) {
    pieceClassName += ' selected';
  }

  if (colour === 3 || colour === 4) {
    return <span className={pieceClassName} onClick={onClick}>K</span>;
  } else if (colour === 5 || colour === 6) {
    return <span className={pieceClassName} onClick={onClick}>I</span>;
  } else if (colour === 7 || colour === 8) {
    return <span className={pieceClassName} onClick={onClick}>M</span>;
  } else {
    return <span className={pieceClassName} onClick={onClick} />;
  }
}