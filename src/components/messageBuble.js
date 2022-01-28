import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {orange, black, white} from '../assets/styles/theme';

export default (props) => {
  const {bgColor, textColor, text, msgId, extraStyles} = props;
  let alignment = 'flex-start';
  let background = black;
  if (msgId == 1) {
    background = orange;
    alignment = 'flex-end';
  }

  return (
    <View
      style={[
        styles.wrapper,
        extraStyles,
        {alignSelf: alignment, backgroundColor: background},
      ]}>
      <Text style={styles.msg}>{text}</Text>
      <View style={styles.date}>
        <Text style={styles.dateText}>04:30 PM</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // width: '60%',
    maxWidth: '70%',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,

    borderRadius: 25,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 15,
  },
  msg: {
    color: 'white',
    fontSize: 14,
  },
  date: {
    alignSelf: 'flex-end',
  },
  dateText: {
    color: white,
    fontSize: 11,
  },
});
