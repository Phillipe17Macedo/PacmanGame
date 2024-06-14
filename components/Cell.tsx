import React from 'react';
import { View, StyleSheet } from 'react-native';

interface CellProps {
  type: number;
}

const Cell: React.FC<CellProps> = ({ type }) => {
  return <View style={[styles.cell, type === 1 && styles.wall, type === 2 && styles.point]} />;
};

const styles = StyleSheet.create({
  cell: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'gray',
  },
  wall: {
    backgroundColor: 'blue',
  },
  point: {
    backgroundColor: 'orange',
  },
});

export default Cell;
