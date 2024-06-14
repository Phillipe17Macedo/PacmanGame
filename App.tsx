import React, { useState } from 'react';
import { View, StyleSheet, PanResponder, GestureResponderEvent, PanResponderGestureState, Text } from 'react-native';
import Board from './components/Board';
import Player from './components/Player';

const App: React.FC = () => {
  const [position, setPosition] = useState({ x: 1, y: 1 });
  const [points, setPoints] = useState(0);
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
        return newPosition;
      }
      return prevPosition;
    });
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
      <Text style={styles.points}>Points: {points}</Text>
      <Board board={board} />
      <Player position={position} />
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
});

export default App;