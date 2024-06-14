import React from 'react';
import { Animated, StyleSheet } from 'react-native';

interface PlayerProps {
  position: { x: number; y: number };
}

const Player: React.FC<PlayerProps> = ({ position }) => {
  const animatedValue = new Animated.ValueXY({ x: position.x * 20, y: position.y * 20 });

  Animated.timing(animatedValue, {
    toValue: { x: position.x * 20, y: position.y * 20 },
    duration: 100,
    useNativeDriver: false,
  }).start();

  return <Animated.View style={[styles.player, animatedValue.getLayout()]} />;
};

const styles = StyleSheet.create({
  player: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'yellow',
    borderRadius: 10,
  },
});

export default Player;
