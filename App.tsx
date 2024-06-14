import React, { useState, useEffect } from 'react';
import { View, StyleSheet, PanResponder, GestureResponderEvent, PanResponderGestureState, Text, Button } from 'react-native';
import Board from './components/Board';
import Player from './components/Player';
import Ghost from './components/Ghost';

const App: React.FC = () => {
  const [position, setPosition] = useState({ x: 1, y: 1 });
  const [points, setPoints] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [ghosts, setGhosts] = useState([
    { x: 8, y: 1 },
    { x: 8, y: 5 },
  ]);
  const [board, setBoard] = useState([
    // 0: empty, 1: wall, 2: point
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 1, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ]);

  useEffect(() => {
    if (!isGameOver) {
      const interval = setInterval(moveGhosts, 1000);
      return () => clearInterval(interval);
    }
  }, [ghosts, isGameOver]);

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
          const newBoard = board.map(row => row.slice());
          newBoard[newPosition.y][newPosition.x] = 0;
          setBoard(newBoard);
        }
        if (checkCollision(newPosition, ghosts)) {
          setIsGameOver(true);
        }
        return newPosition;
      }
      return prevPosition;
    });
  };

  const moveGhosts = () => {
    setGhosts((prevGhosts) => {
      return prevGhosts.map((ghost) => {
        const possibleMoves = [
          { x: ghost.x, y: ghost.y - 1 }, // up
          { x: ghost.x, y: ghost.y + 1 }, // down
          { x: ghost.x - 1, y: ghost.y }, // left
          { x: ghost.x + 1, y: ghost.y }, // right
        ].filter((move) => board[move.y][move.x] !== 1);

        const newGhost = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        if (checkCollision(newGhost, [position])) {
          setIsGameOver(true);
        }
        return newGhost;
      });
    });
  };

  const checkCollision = (position1: { x: number; y: number }, positions: { x: number; y: number }[]) => {
    return positions.some((position) => position.x === position1.x && position.y === position1.y);
  };

  const restartGame = () => {
    setPosition({ x: 1, y: 1 });
    setPoints(0);
    setIsGameOver(false);
    setGhosts([{ x: 8, y: 1 }, { x: 8, y: 5 }]);
    setBoard([
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
      [1, 2, 1, 2, 1, 2, 1, 1, 2, 1],
      [1, 2, 1, 2, 2, 2, 2, 1, 2, 1],
      [1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]);
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
      {isGameOver ? (
        <View style={styles.gameOver}>
          <Text style={styles.gameOverText}>Game Over</Text>
          <Button title="Restart" onPress={restartGame} />
        </View>
      ) : (
        <>
          <Text style={styles.points}>Points: {points}</Text>
          <Board board={board} />
          <Player position={position} />
          {ghosts.map((ghost, index) => (
            <Ghost key={index} position={ghost} />
          ))}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  points: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff'
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
});

export default App;