import React, { Component } from 'react';
import './Board.css';
import Piece from './Piece';

const WHITE = 'white'; // 1
const BLACK = 'black'; // 2

export default class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      boardState: this.setTable(),
      selectedPiece: [-1, -1],
      validMoves: [],
      turn: 2,
      blackCount: 12,
      whiteCount: 12,
      winner: null,
      showPassTurn: false,
      gameOver: false,
      showHelp: false,
    }

    this.setTable = this.setTable.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderSquare = this.renderSquare.bind(this);
    this.handleOnClickPiece = this.handleOnClickPiece.bind(this);
    this.isValidMove = this.isValidMove.bind(this);
    this.getValidMoves = this.getValidMoves.bind(this);
    this.handleOnClickSquare = this.handleOnClickSquare.bind(this);
    this.changeTurn = this.changeTurn.bind(this);
    this.resetSelectedPiece = this.resetSelectedPiece.bind(this);
    this.movePiece = this.movePiece.bind(this);
    this.isGameOver = this.isGameOver.bind(this);
    this.displayWinner = this.displayWinner.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.skipTurn = this.skipTurn.bind(this);
    this.toggleHelp = this.toggleHelp.bind(this);
  }

  setTable() {
    let table = new Array(8);
    table[0] = [0, 7, 0, 5, 0, 5, 0, 7];
    table[1] = [1, 0, 1, 0, 1, 0, 1, 0];
    table[2] = [0, 1, 0, 1, 0, 1, 0, 1];
    table[3] = new Array(8).fill(0);
    table[4] = new Array(8).fill(0);
    table[5] = [2, 0, 2, 0, 2, 0, 2, 0];
    table[6] = [0, 2, 0, 2, 0, 2, 0, 2];
    table[7] = [8, 0, 6, 0, 6, 0, 8, 0];

    return table;
  }

  resetSelectedPiece() {
    this.setState({
      selectedPiece: [-1, -1],
      validMoves: [],
      showPassTurn: false,
    });
  }

  resetGame() {
    this.setState({
      boardState: this.setTable(),
      selectedPiece: [-1, -1],
      validMoves: [],
      turn: 2,
      blackCount: 12,
      whiteCount: 12,
      winner: null,
      showPassTurn: false,
      gameOver: false,
      showHelp: false,
    })
  }

  toggleHelp() {
    this.setState({
      showHelp: !this.state.showHelp,
    })
  }

  isValidMove(rowIndex, squareIndex) {
    const { validMoves } = this.state;

    return validMoves.find((move) => (
      move.spot[0] === rowIndex && move.spot[1] === squareIndex
    ));
  }

  getValidMoves(rowIndex, squareIndex, isSubsequent = false) {
    const { boardState, turn } = this.state;

    let validMoves = [];

    if (turn === 2) { // move up
      if (boardState[rowIndex][squareIndex] === 4 && rowIndex !== 7) { // black king
        // dont add move down right option if far left
        if (squareIndex !== 0) {
          const dl = boardState[rowIndex + 1][squareIndex - 1];
          if (rowIndex <= 5 && dl !== 0 && dl % 2 === 1 && boardState[rowIndex + 2][squareIndex - 2] === 0) {
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
          } else if (dl === 0 && !isSubsequent) {
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
          const dr = boardState[rowIndex + 1][squareIndex + 1];
          if (rowIndex <= 5 && dr !== 0 && dr % 2 === 1 && boardState[rowIndex + 2][squareIndex + 2] === 0) {
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
          } else if (dr === 0 && !isSubsequent) {
            validMoves.push({
              spot: [
                rowIndex + 1,
                squareIndex + 1,
              ],
            });
          }
        }
      }
      if (rowIndex === 0) { // if at board end
        return validMoves;
      }
      // dont add move up left option if far left
      if (squareIndex !== 0) {
        // valid jump if
        // * at least two rows above current row
        // * piece to jump is opposite player's
        // * spot to jump to is empty
        if (rowIndex >= 2 && boardState[rowIndex - 1][squareIndex - 1] % 2 === 1 && boardState[rowIndex - 2][squareIndex - 2] === 0) {
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
        } else if (boardState[rowIndex - 1][squareIndex - 1] === 0 && !isSubsequent) {
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
        if (rowIndex >= 2 && boardState[rowIndex - 1][squareIndex + 1] % 2 === 1 && boardState[rowIndex - 2][squareIndex + 2] === 0) {
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
        } else if (boardState[rowIndex - 1][squareIndex + 1] === 0 && !isSubsequent) {
          validMoves.push({
            spot: [
              rowIndex - 1,
              squareIndex + 1,
            ],
          });
        }
      }
    } else if (turn === 1) { // move down
      if (boardState[rowIndex][squareIndex] === 3 && rowIndex !== 0) { // white king
        // dont add move up left option if far left
        if (squareIndex !== 0) {
          // valid jump if
          // * at least two rows above current row
          // * piece to jump is opposite player's
          // * spot to jump to is empty
          const ul = boardState[rowIndex - 1][squareIndex - 1];
          if (rowIndex >= 2 && ul !== 0 && ul % 2 === 0 && boardState[rowIndex - 2][squareIndex - 2] === 0) {
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
          } else if (ul === 0 && !isSubsequent) {
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
          const ur = boardState[rowIndex - 1][squareIndex + 1];
          if (rowIndex >= 2 && ur !== 0 && ur % 2 === 0 && boardState[rowIndex - 2][squareIndex + 2] === 0) {
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
          } else if (ur === 0 && !isSubsequent) {
            validMoves.push({
              spot: [
                rowIndex - 1,
                squareIndex + 1,
              ],
            });
          }
        }
      }
      if (rowIndex === 7) { // if at board end
        return validMoves;
      }
      // dont add move down right option if far left
      if (squareIndex !== 0) {
        const dl = boardState[rowIndex + 1][squareIndex - 1];
        if (rowIndex <= 5 && dl !== 0 && dl % 2 === 0 && boardState[rowIndex + 2][squareIndex - 2] === 0) {
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
        } else if (dl === 0 && !isSubsequent) {
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
        const dr = boardState[rowIndex + 1][squareIndex + 1];
        if (rowIndex <= 5 && dr !== 0 && dr % 2 === 0 && boardState[rowIndex + 2][squareIndex + 2] === 0) {
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
        } else if (dr === 0 && !isSubsequent) {
          validMoves.push({
            spot: [
              rowIndex + 1,
              squareIndex + 1,
            ],
          });
        }
      }
    }
    return validMoves;
  }

  handleOnClickPiece(rowIndex, squareIndex, square) {
    const { selectedPiece, turn, showPassTurn, gameOver } = this.state;

    if (gameOver) {
      return;
    }

    if (showPassTurn) {
      return;
    }

    if ((square % 2 === 0 && turn === 1) || (square % 2 === 1 && turn === 2)) {
      return;
    }

    if (rowIndex === selectedPiece[0] && squareIndex === selectedPiece[1]) {
      this.resetSelectedPiece();
    } else {
      this.setState({
        selectedPiece: [rowIndex, squareIndex],
        validMoves: this.getValidMoves(rowIndex, squareIndex),
      });
    }
  }

  changeTurn() {
    const { turn } = this.state;

    const nextTurn = turn === 2 ? 1 : 2;
    this.setState({ turn: nextTurn });
  }

  jumpAgain(rowIndex, squareIndex, currentPiece) {
    const { boardState, turn } = this.state;

    if (turn === 2) {
      if (currentPiece === 4 && rowIndex <= 5) { // down jumps
        const dr = boardState[rowIndex + 1][squareIndex + 1];
        const dl = boardState[rowIndex + 1][squareIndex - 1];
        if (squareIndex === 0) {
          if (dr !== 0 && dr % 2 === 1 && boardState[rowIndex + 2][squareIndex + 2] === 0) {
            return true;
          }
        }
        if (squareIndex === 7) {
          if (dl !== 0 && dl % 2 === 1 && boardState[rowIndex + 2][squareIndex - 2] === 0) {
            return true;
          }
        }
        if ((dr !== 0 && dr % 2 === 1 && boardState[rowIndex + 2][squareIndex + 2] === 0) ||
          (dl !== 0 && dl % 2 === 1 && boardState[rowIndex + 2][squareIndex - 2] === 0)) {
          return true;
        }
      }
      if (rowIndex <= 1) {
        return false;
      }
      if (squareIndex === 0) {
        return boardState[rowIndex - 1][squareIndex + 1] % 2 === 1 && boardState[rowIndex - 2][squareIndex + 2] === 0;
      }
      if (squareIndex === 7) {
        return boardState[rowIndex - 1][squareIndex - 1] % 2 === 1 && boardState[rowIndex - 2][squareIndex - 2] === 0;
      }
      return (boardState[rowIndex - 1][squareIndex + 1] % 2 === 1 && boardState[rowIndex - 2][squareIndex + 2] === 0) ||
        (boardState[rowIndex - 1][squareIndex - 1] % 2 === 1 && boardState[rowIndex - 2][squareIndex - 2] === 0);
    }

    if (turn === 1) {
      if (currentPiece === 3 && rowIndex >= 2) { // up jumps
        const ur = boardState[rowIndex - 1][squareIndex + 1];
        const ul = boardState[rowIndex - 1][squareIndex - 1];
        if (squareIndex === 0) {
          if (ur !== 0 && ur % 2 === 0 && boardState[rowIndex - 2][squareIndex + 2] === 0) {
            return true;
          }
        }
        if (squareIndex === 7) {
          if (ul !== 0 && ul % 2 === 0 && boardState[rowIndex - 2][squareIndex - 2] === 0) {
            return true;
          }
        }
        if ((ur !== 0 && ur % 2 === 0 && boardState[rowIndex - 2][squareIndex + 2] === 0) ||
          (ul !== 0 && ul % 2 === 0 && boardState[rowIndex - 2][squareIndex - 2] === 0)) {
          return true;
        }
      }
      if (rowIndex >= 6) {
        return false;
      }
      const dr = boardState[rowIndex + 1][squareIndex + 1];
      const dl = boardState[rowIndex + 1][squareIndex - 1];
      if (squareIndex === 0) {
        return dr !== 0 && dr % 2 === 0 && boardState[rowIndex + 2][squareIndex + 2] === 0;
      }
      if (squareIndex === 7) {
        return dl !== 0 && dl % 2 === 0 && boardState[rowIndex + 2][squareIndex - 2] === 0;
      }
      return (dr !== 0 && dr % 2 === 0 && boardState[rowIndex + 2][squareIndex + 2] === 0) ||
        (dl !== 0 && dl % 2 === 0 && boardState[rowIndex + 2][squareIndex - 2] === 0);
    }
  }

  movePiece(rowIndex, squareIndex, validMove) {
    const {
      boardState,
      selectedPiece,
      turn,
      blackCount,
      whiteCount,
    } = this.state;

    let newBlackCount = blackCount;
    let newWhiteCount = whiteCount;

    let newBoardState = boardState;
    let currentPiece = boardState[selectedPiece[0]][selectedPiece[1]];
    if (turn === 2) {
      if (validMove.toRemove && currentPiece === 6) { // if imposter
        currentPiece = 4;
      } else if (rowIndex === 0 && currentPiece === 8) { // if medic
        for (let i = 0; i < 7; i += 2) {
          if (newBoardState[7][i] === 0) {
            newBoardState[7][i] = 2;
            newBlackCount += 1;
            break;
          }
        }
        currentPiece = 4;
      } else if (rowIndex === 0) {
        currentPiece = 4;
      }
    } else if (turn === 1) {
      if (rowIndex === 7 || (validMove.toRemove && currentPiece === 5)) { // if imposter
        currentPiece = 3;
      } else if (rowIndex === 7 && currentPiece === 7) { // if medic
        for (let i = 0; i < 7; i += 2) {
          if (newBoardState[0][i] === 0) {
            newBoardState[0][i] = 1;
            newWhiteCount += 1;
            break;
          }
        }
        currentPiece = 3;
      } else if (rowIndex === 7) {
        currentPiece = 3;
      }
    }
    newBoardState[rowIndex][squareIndex] = currentPiece;
    newBoardState[selectedPiece[0]][selectedPiece[1]] = 0;

    if (validMove.toRemove) {
      const toRemoveNum = newBoardState[validMove.toRemove[0]][validMove.toRemove[1]];
      newBoardState[validMove.toRemove[0]][validMove.toRemove[1]] = 0;
      if (toRemoveNum === 2) {
        newBlackCount -= 1;
      } else if (toRemoveNum === 1) {
        newWhiteCount -= 1;
      }
    }

    this.setState({
      boardState: newBoardState,
      blackCount: newBlackCount,
      whiteCount: newWhiteCount,
    });

    if (validMove.toRemove) {
      return this.jumpAgain(rowIndex, squareIndex, currentPiece);
    }
    return false;
  }

  isGameOver() {
    const { blackCount, whiteCount } = this.state;
    if (blackCount === 0) {
      return WHITE;
    }
    if (whiteCount === 0) {
      return BLACK;
    }
    return null;
  }

  displayWinner(colour) {
    this.setState({
      winner: colour,
      gameOver: true,
    })
  }

  skipTurn() {
    this.setState({
      showPassTurn: false,
    });
    this.changeTurn();
    this.resetSelectedPiece();
  }

  handleOnClickSquare(rowIndex, squareIndex) {
    const { selectedPiece, gameOver } = this.state;

    if (gameOver) {
      return;
    }

    if (selectedPiece[0] === -1) {
      return;
    }

    const validMove = this.isValidMove(rowIndex, squareIndex);
    if (validMove) {
      const winner = this.isGameOver();
      if (winner) {
        this.displayWinner(winner);
        return;
      }

      const canJumpAgain = this.movePiece(rowIndex, squareIndex, validMove);

      if (canJumpAgain) {
        this.setState({
          showPassTurn: true,
          selectedPiece: [rowIndex, squareIndex],
          validMoves: this.getValidMoves(rowIndex, squareIndex, true),
        });
        return;
      }
      this.changeTurn();
      this.resetSelectedPiece();
    }
  }

  // square is one of [0, 1, 2, 3, 4]
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
      <div key={`row${rowIndex}`}>
        {
          row.map((square, squareIndex) => {
            return this.renderSquare(square, squareIndex, rowIndex, start);
          })
        }
      </div>
    );
  }

  render() {
    const {
      boardState,
      turn,
      winner,
      showPassTurn,
      blackCount,
      whiteCount,
      showHelp,
    } = this.state;

    return (
      <div className='container'>
        <div className='row'>
          <div id='main-board'>
            {
              boardState.map((row, rowIndex) => {
                return this.renderRow(row, rowIndex);
              })
            }
          </div>
        </div>
        <p id='turn'><b>Turn:</b> {turn === 1 ? WHITE : BLACK}</p>
        {showPassTurn && (
          <button type="button" className="btn btn-sm btn-secondary" onClick={this.skipTurn}>Pass turn</button>
        )}
        <p><b>Pieces captured:</b></p>
        <div>
          {
            [...Array(12 - blackCount)].map((_i) => (
              <span className="black-piece-taken" />
            ))
          }
          {
            [...Array(12 - whiteCount)].map((_i) => (
              <span className="white-piece-taken" />
            ))
          }
        </div>
        {winner && (
          <div className='mb-2'>
            <h2>Game over: {winner} wins!</h2>
            <button type="button" className="btn btn-sm btn-secondary" onClick={this.resetGame}>Reset</button>
          </div>
        )}
        <button type="button" className="btn btn-sm btn-info" onClick={this.toggleHelp}>Help</button>
        {showHelp && (
          <div className='card mt-2 mb-3'>
            <div className='card-body'>
              <ul>
                <li>Black plays first.</li>
                <li>Pieces move diagonally towards the opponent.</li>
                <li>Capture pieces by jumping over them diagonally. This can be done multiple times.</li>
                <li>A piece that reaches the last row becomes a <b>King Piece</b>, which can move in all diagonal directions. King Pieces are marked with K.</li>
                <li><b>Imposter Pieces</b> are special pieces that become a King Piece upon capturing another piece. Imposter Pieces are marked with I.</li>
                <li><b>Medic Pieces</b> are special pieces that upon reaching the last row, restores a captured piece to the starting row if available, and then becomes a King Piece. Medic Pieces are marked with M.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    )
  }
}
