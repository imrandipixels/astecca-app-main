import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {orangeBtn, orangeIcon} from '../assets/styles/theme';

export default (props) => {
  const {extraStyles} = props;
  return (
    <View style={[styles.wrapper, extraStyles]}>
      <TouchableOpacity
        onPress={() => {
          console.log('Hello World');
        }}
        style={[styles.iconWrapper]}>
        <Icon name="facebook" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          console.log('Hello World');
        }}
        style={[styles.iconWrapper]}>
        <Icon name="google-plus" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          console.log('Hello World');
        }}
        style={[styles.iconWrapper]}>
        <Icon name="envelope" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          console.log('Hello World');
        }}
        style={[styles.iconWrapper]}>
        <Icon name="phone" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 0.333,
    flexDirection: 'row',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: orangeBtn,
    height: 45,
    width: 45,
    borderRadius: 50,
    marginHorizontal: 10,
  },
});
