import React from 'react';
import { View, StyleSheet } from 'react-native';
import Cell from './Cell';

interface BoardProps {
  board: number[][];
}

const Board: React.FC<BoardProps> = ({ board }) => {
  return (
    <View style={styles.board}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <Cell key={colIndex} type={cell} />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    flexDirection: 'column',
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
  },
});

export default Board;