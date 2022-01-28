import React from 'react';
import {View, StyleSheet} from 'react-native';
import {MessageText} from 'react-native-gifted-chat';

const customMessageBuble = (props) => {
  return (
    <View style={styles.wrapper}>
      <MessageText {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: '70%',

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
});
