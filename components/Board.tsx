import React from 'react';
import { View, StyleSheet } from 'react-native';
import Cell from './Cell';

const Board: React.FC = () => {
  const rows = 20;
  const cols = 20;

  const createBoard = () => {
    let board = [];
    for (let row = 0; row < rows; row++) {
      let cells = [];
      for (let col = 0; col < cols; col++) {
        cells.push(<Cell key={`${row}-${col}`} />);
      }
      board.push(
        <View key={row} style={styles.row}>
          {cells}
        </View>
      );
    }
    return board;
  };

  return <View style={styles.board}>{createBoard()}</View>;
};

const styles = StyleSheet.create({
  board: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
});

export default Board;
