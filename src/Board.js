import React, { Component } from 'react';
import './Board.css';

const RED = 'red';
const BLACK = 'black';

export default class Board extends Component {
  constructor(props) {
    super(props);

    let table = new Array(8);
    table[0] = [0, 1, 0, 1, 0, 1, 0, 1];
    table[1] = [1, 0, 1, 0, 1, 0, 1, 0];
    table[2] = [0, 1, 0, 1, 0, 1, 0, 1];
    table[3] = new Array(8).fill(0);
    table[4] = new Array(8).fill(0);
    table[5] = [2, 0, 2, 0, 2, 0, 2, 0];
    table[6] = [0, 2, 0, 2, 0, 2, 0, 2];
    table[7] = [2, 0, 2, 0, 2, 0, 2, 0];

    this.state = {
      boardState: table,
    }

    console.log(table)

    this.renderRow = this.renderRow.bind(this);
    this.renderSquare = this.renderSquare.bind(this);
  }

  // square is one of [0, 1, 2]
  renderSquare(square, squareIndex, start) {
    const otherColour = start === RED ? BLACK : RED;
    const colour = squareIndex % 2 === 0 ? start : otherColour;
    
    const className = `${colour} square`;

    let pieceClassName;
    if (square === 1) {
      pieceClassName = 'piece red-piece';
    } else if (square === 2) {
      pieceClassName = 'piece black-piece';
    } else {
      pieceClassName = null;
    }

    return (
      <div className={className}>
        {
          pieceClassName && <span class={pieceClassName}></span>
        }
      </div>
    )
  }

  renderRow(row, rowIndex) {
    const start = rowIndex % 2 === 0 ? 'red' : 'black';
    return (
      <div className='board-row'>
        {
          row.map((square, squareIndex) => {
            return this.renderSquare(square, squareIndex, start);
          })
        }
      </div>
    );
  }

  render() {
    const { boardState } = this.state;

    return (
      <div id='main-board'>
        {
          boardState.map((row, rowIndex) => {
            return this.renderRow(row, rowIndex);
          })
        }
      </div>
    );
  }
}
