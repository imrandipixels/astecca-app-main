import React, {useState} from 'react';
import {TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
import {borderColor, white} from '../assets/styles/theme';

const unSelectedIcon = require('../assets/images/checkIcon.png');
const selectedIcon = require('../assets/images/blueCheckIcon.png');

export default (props) => {
  const {title, onSelect, selected, tableType, extraStyles} = props;
  // const [selected, setSelected] = useState(false);
  return (
    <TouchableOpacity
      onPress={onSelect}
      //   onPress={() => {
      //     setSelected(!selected);
      //     onSelect(tableType, !selected);
      //   }
      // }
      style={styles.card}>
      <Image
        style={styles.icon}
        source={selected ? selectedIcon : unSelectedIcon}
      />
      <Image
        resizeMode="contain"
        style={styles.table}
        source={require('../assets/images/table.png')}
      />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',

    position: 'relative',
    margin: 15,

    backgroundColor: white,
    borderRadius: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.9,
    shadowRadius: 1,
    elevation: 5,
  },
  table: {
    width: 200,
    height: 200,
    margin: -32,
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 10,

    width: 24,
    height: 24,
  },
  title: {
    fontSize: 18,
  },
});
