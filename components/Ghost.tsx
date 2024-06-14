import React from 'react';
import { Animated, StyleSheet } from 'react-native';

interface GhostProps {
  position: { x: number; y: number };
  powerUpActive: boolean;
}

const Ghost: React.FC<GhostProps> = ({ position, powerUpActive }) => {
  const animatedValue = new Animated.ValueXY({ x: position.x * 20, y: position.y * 20 });

  Animated.timing(animatedValue, {
    toValue: { x: position.x * 20, y: position.y * 20 },
    duration: 100,
    useNativeDriver: false,
  }).start();

  return <Animated.View style={[styles.ghost, powerUpActive && styles.fleeingGhost, animatedValue.getLayout()]} />;
};

const styles = StyleSheet.create({
  ghost: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
  },
  fleeingGhost: {
    backgroundColor: 'blue',
  },
});

export default Ghost;
