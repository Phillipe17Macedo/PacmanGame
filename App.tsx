import React, { useState } from 'react';
import { View, StyleSheet, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import Board from './components/Board';
import Player from './components/Player';

const App: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const movePlayer = (direction: string) => {
    setPosition((prevPosition) => {
      switch (direction) {
        case 'up':
          return { x: prevPosition.x, y: Math.max(prevPosition.y - 1, 0) };
        case 'down':
          return { x: prevPosition.x, y: Math.min(prevPosition.y + 1, 19) };
        case 'left':
          return { x: Math.max(prevPosition.x - 1, 0), y: prevPosition.y };
        case 'right':
          return { x: Math.min(prevPosition.x + 1, 19), y: prevPosition.y };
        default:
          return prevPosition;
      }
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
      <Board />
      <Player position={position} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
