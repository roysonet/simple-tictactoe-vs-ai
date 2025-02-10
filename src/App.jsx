import React, { useState, useEffect } from 'react';

function Square({ value, onSquareClick, isWinningSquare }) {
  const style = {
    backgroundColor: isWinningSquare ? 'lightgreen' : 'lightblue',
    color: value === 'X' ? '#333' : '#666',
    fontWeight: 'bold',
  };
  return (
    <button className="square" onClick={onSquareClick} style={style}>
      {value}
    </button>
  );
}

function Board({ squares, onPlay, currentMove, winningSquaresLine, isAiTurn }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i] || isAiTurn) {
      return;
    }
    const nextSquares = squares.slice();
    if (currentMove % 2 === 0) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner.player;
  } else if (squares.every(square => square !== null)) {
    status = 'Draw!';
  } else {
    status = 'Next player: ' + (currentMove % 2 === 0 ? 'X' : 'O');
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square
          value={squares[0]}
          onSquareClick={() => handleClick(0)}
          isWinningSquare={winningSquaresLine && winningSquaresLine.includes(0)}
        />
        <Square
          value={squares[1]}
          onSquareClick={() => handleClick(1)}
          isWinningSquare={winningSquaresLine && winningSquaresLine.includes(1)}
        />
        <Square
          value={squares[2]}
          onSquareClick={() => handleClick(2)}
          isWinningSquare={winningSquaresLine && winningSquaresLine.includes(2)}
        />
      </div>
      <div className="board-row">
        <Square
          value={squares[3]}
          onSquareClick={() => handleClick(3)}
          isWinningSquare={winningSquaresLine && winningSquaresLine.includes(3)}
        />
        <Square
          value={squares[4]}
          onSquareClick={() => handleClick(4)}
          isWinningSquare={winningSquaresLine && winningSquaresLine.includes(4)}
        />
        <Square
          value={squares[5]}
          onSquareClick={() => handleClick(5)}
          isWinningSquare={winningSquaresLine && winningSquaresLine.includes(5)}
        />
      </div>
      <div className="board-row">
        <Square
          value={squares[6]}
          onSquareClick={() => handleClick(6)}
          isWinningSquare={winningSquaresLine && winningSquaresLine.includes(6)}
        />
        <Square
          value={squares[7]}
          onSquareClick={() => handleClick(7)}
          isWinningSquare={winningSquaresLine && winningSquaresLine.includes(7)}
        />
        <Square
          value={squares[8]}
          onSquareClick={() => handleClick(8)}
          isWinningSquare={winningSquaresLine && winningSquaresLine.includes(8)}
        />
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: lines[i] };
    }
  }
  return null;
}

function easyAI(squares) {
  const availableSquares = squares.reduce((acc, square, index) => {
    if (square === null) {
      acc.push(index);
    }
    return acc;
  }, []);
  const randomIndex = Math.floor(Math.random() * availableSquares.length);
  return availableSquares[randomIndex];
}

function mediumAI(squares) {
  // Check if AI can win in the next move
  for (let i = 0; i < 9; i++) {
    if (squares[i] === null) {
      const nextSquares = squares.slice();
      nextSquares[i] = 'O'; // AI is 'O'
      if (calculateWinner(nextSquares)) {
        return i;
      }
    }
  }

  // Check if player can win in the next move and block them
  for (let i = 0; i < 9; i++) {
    if (squares[i] === null) {
      const nextSquares = squares.slice();
      nextSquares[i] = 'X'; // Player is 'X'
      if (calculateWinner(nextSquares)) {
        return i;
      }
    }
  }

  // If no winning or blocking move, make a random move
  return easyAI(squares);
}


function Game({ gameMode, aiLevel, onBackToHome }) {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const winnerInfo = calculateWinner(currentSquares);
  const winner = winnerInfo ? winnerInfo.player : null;
  const winningSquaresLine = winnerInfo ? winnerInfo.line : null;
  const isAiTurn = gameMode === 'play-vs-ai' && currentMove % 2 !== 0 && !winner && !currentSquares.every(square => square !== null);


  useEffect(() => {
    if (isAiTurn) {
      let aiMove;
      if (aiLevel === 'easy') {
        aiMove = easyAI(currentSquares);
      } else if (aiLevel === 'medium') {
        aiMove = mediumAI(currentSquares);
      } else if (aiLevel === 'hard') {
        aiMove = mediumAI(currentSquares); // Using medium AI for now as hard is not fully implemented
      }

      if (aiMove !== undefined) {
        const nextSquares = currentSquares.slice();
        nextSquares[aiMove] = 'O';
        handlePlay(nextSquares);
      }
    }
  }, [isAiTurn, aiLevel, currentSquares, handlePlay]);


  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={currentSquares}
          onPlay={handlePlay}
          currentMove={currentMove}
          winningSquaresLine={winningSquaresLine}
          isAiTurn={isAiTurn}
        />
      </div>
      <div className="buttons-container">
        <button className="reset-button" onClick={resetGame}>Play again!</button>
        <button className="home-button" onClick={onBackToHome}>Back to Home</button>
      </div>
    </div>
  );
}

function Home({ onModeSelect }) {
  return (
    <div className="home">
      <h1>Tic Tac Toe</h1>
      <button className="home-button" onClick={() => onModeSelect('player-vs-player')}>
        Play Player vs Player
      </button>
      <button className="home-button" onClick={() => onModeSelect('play-vs-ai')}>
        Play vs AI
      </button>
    </div>
  );
}

function AILevels({ onLevelSelect, onBackToHome }) {
  return (
    <div className="ai-levels">
      <h2>Play vs AI</h2>
      <button className="home-button" onClick={() => onLevelSelect('easy')}>Easy</button>
      <button className="home-button" onClick={() => onLevelSelect('medium')}>Medium</button>
      <button className="home-button" onClick={() => onLevelSelect('hard')}>Hard</button>
      <button className="home-button" onClick={onBackToHome}>Back to Home</button>
    </div>
  );
}


export default function App() {
  const [gameMode, setGameMode] = useState(null);
  const [aiLevel, setAiLevel] = useState(null);

  const handleModeSelect = (mode) => {
    setGameMode(mode);
    setAiLevel(null); // Reset AI level when changing game modes
  };

  const handleLevelSelect = (level) => {
    setAiLevel(level);
    if (level) {
      setGameMode('play-vs-ai'); // Ensure game mode is set when level is selected
    } else {
      setGameMode(null); // Go back to home if level is null (Back button)
    }
  };

  const handleBackToHome = () => {
    setGameMode(null);
    setAiLevel(null);
  };


  if (!gameMode) {
    return <Home onModeSelect={handleModeSelect} />;
  }

  if (gameMode === 'play-vs-ai' && !aiLevel) {
    return <AILevels onLevelSelect={handleLevelSelect} onBackToHome={handleBackToHome} />;
  }


  return (
    <div>
      {gameMode === 'player-vs-player' && <Game gameMode="player-vs-player" onBackToHome={handleBackToHome} />}
      {gameMode === 'play-vs-ai' && aiLevel && <Game gameMode="play-vs-ai" aiLevel={aiLevel} onBackToHome={handleBackToHome} />}
    </div>
  );
}
