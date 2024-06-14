import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, PanResponder, GestureResponderEvent, PanResponderGestureState, Text, Button } from 'react-native';
import Board from './components/Board';
import Player from './components/Player';
import Ghost from './components/Ghost';

const App: React.FC = () => {
  const initialBoard = [
    // 0: empty, 1: wall, 2: point, 3: power-up
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 2, 1, 2, 1, 3, 1, 1, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  const [position, setPosition] = useState({ x: 1, y: 1 });
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [powerUpActive, setPowerUpActive] = useState(false);
  const [ghosts, setGhosts] = useState([
    { x: 8, y: 1, isSmart: true },
    { x: 8, y: 5, isSmart: false },
    { x: 5, y: 3, isSmart: false },
    { x: 2, y: 6, isSmart: false },
  ]);
  const [board, setBoard] = useState(initialBoard);
  const gameInterval = useRef<NodeJS.Timeout | null>(null);
  const powerUpTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isGameOver && !isPaused) {
      gameInterval.current = setInterval(moveGhosts, Math.max(200, 1000 - points * 10)); // Aumenta a velocidade dos fantasmas com mais pontos
      return () => clearInterval(gameInterval.current!);
    }
  }, [ghosts, isGameOver, isPaused, points]);

  useEffect(() => {
    if (isGameOver) {
      const timeout = setTimeout(() => restartGame(), 3000);
      return () => clearTimeout(timeout);
    }
  }, [isGameOver]);

  const activatePowerUp = () => {
    setPowerUpActive(true);
    if (powerUpTimeout.current) {
      clearTimeout(powerUpTimeout.current);
    }
    powerUpTimeout.current = setTimeout(() => {
      setPowerUpActive(false);
    }, 5000);
  };

  const movePlayer = (direction: string) => {
    setPosition((prevPosition) => {
      const newPosition = { ...prevPosition };
      switch (direction) {
        case 'up':
          newPosition.y = Math.max(prevPosition.y - 1, 0);
          break;
        case 'down':
          newPosition.y = Math.min(prevPosition.y + 1, board.length - 1);
          break;
        case 'left':
          newPosition.x = Math.max(prevPosition.x - 1, 0);
          break;
        case 'right':
          newPosition.x = Math.min(prevPosition.x + 1, board[0].length - 1);
          break;
      }
      if (board[newPosition.y][newPosition.x] !== 1) {
        if (board[newPosition.y][newPosition.x] === 2) {
          setPoints(points + 1);
        } else if (board[newPosition.y][newPosition.x] === 3) {
          activatePowerUp();
        }

        const newBoard = board.map((row) => row.slice());
        newBoard[newPosition.y][newPosition.x] = 0;
        setBoard(newBoard);

        if (newBoard.flat().filter((cell) => cell === 2 || cell === 3).length === 0) {
          setLevel(level + 1);
          setPoints(points + 10); // Bônus por completar o nível
          setBoard(initialBoard);
          setPosition({ x: 1, y: 1 });
          setGhosts([
            { x: 8, y: 1, isSmart: true },
            { x: 8, y: 5, isSmart: false },
            { x: 5, y: 3, isSmart: false },
            { x: 2, y: 6, isSmart: false },
          ]);
        }

        if (checkCollision(newPosition, ghosts)) {
          if (powerUpActive) {
            setGhosts((prevGhosts) => prevGhosts.map((ghost) => (ghost.x === newPosition.x && ghost.y === newPosition.y ? { ...ghost, x: 0, y: 0 } : ghost)));
          } else {
            setIsGameOver(true);
          }
        }
        return newPosition;
      }
      return prevPosition;
    });
  };

  const moveGhosts = () => {
    setGhosts((prevGhosts) => {
      return prevGhosts.map((ghost) => {
        if (ghost.isSmart) {
          return moveSmartGhost(ghost);
        } else {
          return moveRandomGhost(ghost);
        }
      });
    });
  };

  const moveSmartGhost = (ghost: { x: number; y: number; isSmart: boolean }) => {
    const possibleMoves = [
      { x: ghost.x, y: ghost.y - 1 }, // up
      { x: ghost.x, y: ghost.y + 1 }, // down
      { x: ghost.x - 1, y: ghost.y }, // left
      { x: ghost.x + 1, y: ghost.y }, // right
    ].filter((move) => board[move.y] && board[move.y][move.x] !== 1);

    possibleMoves.sort((a, b) => {
      const distA = Math.abs(a.x - position.x) + Math.abs(a.y - position.y);
      const distB = Math.abs(b.x - position.x) + Math.abs(b.y - position.y);
      return distA - distB;
    });

    const newGhost = possibleMoves[0];
    if (checkCollision(newGhost, [position])) {
      setIsGameOver(true);
    }
    return { ...newGhost, isSmart: ghost.isSmart };
  };

  const moveRandomGhost = (ghost: { x: number; y: number; isSmart: boolean }) => {
    const possibleMoves = [
      { x: ghost.x, y: ghost.y - 1 }, // up
      { x: ghost.x, y: ghost.y + 1 }, // down
      { x: ghost.x - 1, y: ghost.y }, // left
      { x: ghost.x + 1, y: ghost.y }, // right
    ].filter((move) => board[move.y] && board[move.y][move.x] !== 1);

    const newGhost = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    if (checkCollision(newGhost, [position])) {
      setIsGameOver(true);
    }
    return { ...newGhost, isSmart: ghost.isSmart };
  };

  const checkCollision = (position1: { x: number; y: number }, positions: { x: number; y: number }[]) => {
    return positions.some((position) => position.x === position1.x && position.y === position1.y);
  };

  const restartGame = () => {
    setPosition({ x: 1, y: 1 });
    setPoints(0);
    setLevel(1);
    setIsGameOver(false);
    setGhosts([
      { x: 8, y: 1, isSmart: true },
      { x: 8, y: 5, isSmart: false },
      { x: 5, y: 3, isSmart: false },
      { x: 2, y: 6, isSmart: false },
    ]);
    setBoard(initialBoard);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderRelease: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      const { dx, dy } = gestureState;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
          movePlayer('right');
        } else {
          movePlayer('left');
        }
      } else {
        if (dy > 0) {
          movePlayer('down');
        } else {
          movePlayer('up');
        }
      }
    },
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.header}>
        <Text style={styles.points}>Points: {points}</Text>
        <Text style={styles.level}>Level: {level}</Text>
        <Button title={isPaused ? "Resume" : "Pause"} onPress={togglePause} />
      </View>
      {isGameOver ? (
        <View style={styles.gameOver}>
          <Text style={styles.gameOverText}>Game Over</Text>
          <Button title="Restart Now" onPress={restartGame} />
        </View>
      ) : (
        <View style={styles.boardContainer}>
          <Board board={board} />
          <Player position={position} />
          {ghosts.map((ghost, index) => (
            <Ghost key={index} position={ghost} powerUpActive={powerUpActive} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
  },
  points: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  level: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  gameOver: {
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 20,
  },
  boardContainer: {
    position: 'relative',
    width: 200,
    height: 140,
  },
});

export default App;
