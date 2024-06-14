import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface GhostProps {
  position: { x: number; y: number };
}

const Ghost: React.FC<GhostProps> = ({ position }) => {
  const animatedValue = new Animated.ValueXY({ x: position.x * 20, y: position.y * 20 });

  Animated.timing(animatedValue, {
    toValue: { x: position.x * 20, y: position.y * 20 },
    duration: 500,
    useNativeDriver: false,
  }).start();

  return <Animated.View style={[styles.ghost, animatedValue.getLayout()]} />;
};

const styles = StyleSheet.create({
  ghost: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
  },
});

export default Ghost;