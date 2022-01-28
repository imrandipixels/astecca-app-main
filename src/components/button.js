import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {white} from '../assets/styles/theme';
import globalStyles from '../assets/styles/globalStyles';

export const ButtonLarge = (props) => {
  const {extraStyles, title, color, onSubmit, disabled} = props;

  return (
    <TouchableOpacity
      disabled={disabled ? disabled : false}
      onPress={onSubmit}
      style={[styles.btnL, extraStyles, {backgroundColor: color}]}>
      <Text style={styles.textBig}>{title}</Text>
    </TouchableOpacity>
  );
};

export const ButtonSmall = (props) => {
  const {extraStyles, title, textColor} = props;

  return (
    <TouchableOpacity style={[styles.btnS, extraStyles]}>
      <Text style={[styles.textSmall, {color: textColor}]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnL: {
    width: '100%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 15,
  },
  btnS: {
    width: '46%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',

    fontSize: 12,
  },
  textBig: {
    color: white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  textSmall: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
