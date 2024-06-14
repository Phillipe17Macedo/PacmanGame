import React from 'react';
import { View, StyleSheet } from 'react-native';

interface CellProps {
  type: number;
}

const Cell: React.FC<CellProps> = ({ type }) => {
  return <View style={[styles.cell, type === 1 && styles.wall, type === 2 && styles.point, type === 3 && styles.powerUp]} />;
};

const styles = StyleSheet.create({
  cell: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
  },
  wall: {
    backgroundColor: 'blue',
  },
  point: {
    backgroundColor: 'orange',
  },
  powerUp: {
    backgroundColor: 'green',
  },
});

export default Cell;
