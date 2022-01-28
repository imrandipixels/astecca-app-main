import React, {useState} from 'react';
import {TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import {white} from '../assets/styles/theme';

const unSelectedIcon = require('../assets/images/checkIcon.png');
const selectedIcon = require('../assets/images/blueCheckIcon.png');

export default (props) => {
  const {title, onSelect, value, selected} = props;
  return (
    <TouchableOpacity onPress={onSelect} style={styles.card}>
      <Image
        style={styles.icon}
        source={selected ? selectedIcon : unSelectedIcon}
      />
      <Text style={{fontSize: 20}}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    position: 'relative',
    height: 55,
    width: '90%',

    paddingHorizontal: 15,
    marginVertical: 10,

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
  icon: {
    position: 'absolute',
    right: 10,
    top: 10,

    width: 24,
    height: 24,
  },
});
