import React, { Component } from 'react';
import './Board.css';
import Piece from './Piece';

const WHITE = 'white'; // 1
const BLACK = 'black'; // 2

// TODO
// * win condition
// * multiple jump
// * choose to not jump if available

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
      validMoves: [],
      turn: 2,
    }

    this.renderRow = this.renderRow.bind(this);
    this.renderSquare = this.renderSquare.bind(this);
    this.handleOnClickPiece = this.handleOnClickPiece.bind(this);
    this.isValidMove = this.isValidMove.bind(this);
    this.getValidMoves = this.getValidMoves.bind(this);
    this.handleOnClickSquare = this.handleOnClickSquare.bind(this);
    this.changeTurn = this.changeTurn.bind(this);
    this.resetSelectedPiece = this.resetSelectedPiece.bind(this);
    this.movePiece = this.movePiece.bind(this);
  }

  resetSelectedPiece() {
    this.setState({
      selectedPiece: [-1, -1],
      validMoves: [],
    });
  }

  isValidMove(rowIndex, squareIndex) {
    const { validMoves } = this.state;

    return validMoves.find((move) => (
      move.spot[0] === rowIndex && move.spot[1] === squareIndex
    ));
  }

  getValidMoves(rowIndex, squareIndex) {
    const { boardState, turn } = this.state;

    const oppositeTurn = turn === 2 ? 1 : 2;

    let validMoves = [];
    
    if (turn === 2) { // move up
      if (rowIndex === 0) { // if at board end
        return validMoves;
      }
      // dont add move up left option if far left
      if (squareIndex !== 0) {
        // valid jump if
        // * at least two rows above current row
        // * piece to jump is opposite player's
        // * spot to jump to is empty
        if (rowIndex >= 2 && boardState[rowIndex - 1][squareIndex - 1] === oppositeTurn && boardState[rowIndex - 2][squareIndex - 2] === 0) {
          validMoves.push({
            spot: [
              rowIndex - 2,
              squareIndex - 2
            ],
            toRemove: [
              rowIndex - 1,
              squareIndex - 1,
            ],
          })
        } else if (boardState[rowIndex - 1][squareIndex - 1] === 0) {
          validMoves.push({
            spot: [
              rowIndex - 1,
              squareIndex - 1,
            ],
          });
        }
      }
      // dont add move up right option if far right
      if (squareIndex !== 7) {
        if (rowIndex >= 2 && boardState[rowIndex - 1][squareIndex + 1] === oppositeTurn && boardState[rowIndex - 2][squareIndex + 2] === 0) {
          validMoves.push({
            spot: [
              rowIndex - 2,
              squareIndex + 2,
            ],
            toRemove: [
              rowIndex - 1,
              squareIndex + 1,
            ],
          });
        } else if (boardState[rowIndex - 1][squareIndex + 1] === 0) {
          validMoves.push({
            spot: [
              rowIndex - 1,
              squareIndex + 1,
            ],
          });
        }
      }
    } else if (turn === 1) { // move down
      if (rowIndex === 7) { // if at board end
        return validMoves;
      }
      // dont add move down right option if far left
      if (squareIndex !== 0) {
        if (rowIndex <= 5 && boardState[rowIndex + 1][squareIndex - 1] === oppositeTurn && boardState[rowIndex + 2][squareIndex - 2] === 0) {
          validMoves.push({
            spot: [
              rowIndex + 2,
              squareIndex - 2,
            ],
            toRemove: [
              rowIndex + 1,
              squareIndex - 1,
            ],
          });
        } else if (boardState[rowIndex + 1][squareIndex - 1] === 0) {
          validMoves.push({
            spot: [
              rowIndex + 1,
              squareIndex - 1,
            ],
          });
        }
      }
      // dont add move down left option if far right
      if (squareIndex !== 7) {
        if (rowIndex <= 5 && boardState[rowIndex + 1][squareIndex + 1] === oppositeTurn && boardState[rowIndex + 2][squareIndex + 2] === 0) {
          validMoves.push({
            spot: [
              rowIndex + 2,
              squareIndex + 2,
            ],
            toRemove: [
              rowIndex + 1,
              squareIndex + 1,
            ],
          });
        } else if (boardState[rowIndex + 1][squareIndex + 1] === 0) {
          validMoves.push({
            spot: [
              rowIndex + 1,
              squareIndex + 1,
            ],
          });
        }
      }
    }
    // console.log(validMoves);
    return validMoves;
  }

  handleOnClickPiece(rowIndex, squareIndex, square) {
    const { selectedPiece, turn } = this.state;

    if ((square === 2 && turn === 1) || (square === 1 && turn === 2)) {
      return;
    }

    if (rowIndex === selectedPiece[0] && squareIndex === selectedPiece[1]) {
      this.resetSelectedPiece();
    } else {
      this.setState({
        selectedPiece: [rowIndex, squareIndex],
        validMoves: this.getValidMoves(rowIndex, squareIndex),
      })
    }
  }

  changeTurn() {
    const { turn } = this.state;

    const nextTurn = turn === 2 ? 1 : 2;
    this.setState({ turn: nextTurn });
  }

  movePiece(rowIndex, squareIndex, validMove) {
    const { boardState, selectedPiece, turn } = this.state;

    let newBoardState = boardState;
    newBoardState[rowIndex][squareIndex] = turn;
    newBoardState[selectedPiece[0]][selectedPiece[1]] = 0;

    if (validMove.toRemove) {
      newBoardState[validMove.toRemove[0]][validMove.toRemove[1]] = 0;
    }

    this.setState({
      boardState: newBoardState
    })
  }

  handleOnClickSquare(rowIndex, squareIndex) {
    const { selectedPiece } = this.state;

    if (selectedPiece[0] === -1) {
      return;
    }

    const validMove = this.isValidMove(rowIndex, squareIndex);
    if (validMove) {
      this.movePiece(rowIndex, squareIndex, validMove);
      this.changeTurn();
      this.resetSelectedPiece();
    }
  }

  // square is one of [0, 1, 2]
  renderSquare(square, squareIndex, rowIndex, start) {
    const { selectedPiece } = this.state;

    const otherColour = start === WHITE ? BLACK : WHITE;
    const colour = squareIndex % 2 === 0 ? start : otherColour;

    const className = `${colour} square`;

    if (square === 0) {
      return (
        <div className={className} onClick={() => this.handleOnClickSquare(rowIndex, squareIndex)} key={`piece${rowIndex}${squareIndex}`} />
      )
    }
    
    const selected = rowIndex === selectedPiece[0] && squareIndex === selectedPiece[1];

    return (
      <div className={className} key={`square${rowIndex}${squareIndex}`}>
        <Piece
          colour={square}
          key={`piece${rowIndex}${squareIndex}`}
          onClick={() => this.handleOnClickPiece(rowIndex, squareIndex, square)}
          selected={selected}
        />
      </div>
    )
  }

  renderRow(row, rowIndex) {
    const start = rowIndex % 2 === 0 ? 'white' : 'black';
    return (
      <div className='board-row' key={`row${rowIndex}`}>
        {
          row.map((square, squareIndex) => {
            return this.renderSquare(square, squareIndex, rowIndex, start);
          })
        }
      </div>
    );
  }

  render() {
    const { boardState, turn } = this.state;

    return (
      <div>
        <div id='main-board'>
          {
            boardState.map((row, rowIndex) => {
              return this.renderRow(row, rowIndex);
            })
          }
        </div>
        <p id='turn'>Turn: {turn === 1 ? WHITE : BLACK}</p>
      </div>
    );
  }
}
