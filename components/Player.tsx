import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PlayerProps {
  position: { x: number; y: number };
}

const Player: React.FC<PlayerProps> = ({ position }) => {
  return <View style={[styles.player, { top: position.y * 20, left: position.x * 20 }]} />;
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
