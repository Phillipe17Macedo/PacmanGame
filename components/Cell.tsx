import React from 'react';
import { View, StyleSheet } from 'react-native';

const Cell: React.FC = () => {
  return <View style={styles.cell} />;
};

const styles = StyleSheet.create({
  cell: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
  },
});

export default Cell;
