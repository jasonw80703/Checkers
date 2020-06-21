import React, { Component } from 'react';
import './Board.css';
import Piece from './Piece';

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
      selectedPiece: [-1, -1],
    }

    this.renderRow = this.renderRow.bind(this);
    this.renderSquare = this.renderSquare.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(rowIndex, squareIndex) {
    const { selectedPiece } = this.state;

    if (rowIndex === selectedPiece[0] && squareIndex === selectedPiece[1]) {
      this.setState({
        selectedPiece: [-1, -1],
      })
    } else {
      this.setState({
        selectedPiece: [rowIndex, squareIndex],
      })
    }
  }

  // square is one of [0, 1, 2]
  renderSquare(square, squareIndex, rowIndex, start) {
    const { selectedPiece } = this.state;

    const otherColour = start === RED ? BLACK : RED;
    const colour = squareIndex % 2 === 0 ? start : otherColour;
    
    const className = `${colour} square`;

    const selected = rowIndex === selectedPiece[0] && squareIndex === selectedPiece[1];

    return (
      <div className={className}>
        <Piece
          color={square}
          onClick={() => this.handleOnClick(rowIndex, squareIndex)}
          selected={selected}
        />
      </div>
    )
  }

  renderRow(row, rowIndex) {
    const start = rowIndex % 2 === 0 ? 'red' : 'black';
    return (
      <div className='board-row'>
        {
          row.map((square, squareIndex) => {
            return this.renderSquare(square, squareIndex, rowIndex, start);
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
