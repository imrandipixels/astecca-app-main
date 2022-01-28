import React from 'react';
import {StyleSheet, View, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {borderColor} from '../assets/styles/theme';

export default (props) => {
  const {value, placeholder, onSubmit, onChange} = props;
  return (
    <View style={styles.wrapper}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        style={styles.field}
      />
      <TouchableOpacity onPress={onSubmit} style={styles.wrapper1}>
        <Icon name="search" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    //  alignItems: 'center',
    justifyContent: 'space-between',

    borderRadius: 25,
    borderColor: borderColor,
    borderWidth: 0.2,
    // borderRadius: 25,

    backgroundColor: 'white',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.9,
    shadowRadius: 1,
    elevation: 5,
  },
  wrapper1: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    width: '20%',
    borderTopEndRadius: 25,
    borderBottomRightRadius: 25,
  },
  field: {
    paddingHorizontal: 15,
    fontSize: 14,
  },
});
