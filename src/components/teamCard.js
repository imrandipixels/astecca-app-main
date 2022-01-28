import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

// 3rd party icons
import Ionicons from 'react-native-vector-icons/Ionicons';

// Utilities
import {borderColor, orangeIcon, white} from '../assets/styles/theme';
import {ENDPOINT} from '../utils/API';

export default (props) => {
  const {player1, player2, onSelect} = props;
  return (
    <TouchableOpacity onPress={onSelect} style={styles.wrapper}>
      <View style={styles.wrapper1}>
        <View style={styles.avatarWrapper}>
          {player1.avatar ? (
            <Image
              style={styles.avatar}
              resizeMode="contain"
              source={
                player1.avatar
                  ? {uri: `${ENDPOINT}/images/${player1.avatar}`}
                  : require('../assets/images/avatar.png')
              }
            />
          ) : (
            <View style={styles.initials}>
              <Text style={{fontSize: 40, color: 'white'}}>
                {player1.username[0]}
              </Text>
            </View>
          )}

          <Text style={styles.username}>{player1.username}</Text>
        </View>
        <View style={styles.avatarWrapper}>
          {player2.avatar ? (
            <Image
              style={styles.avatar}
              resizeMode="contain"
              source={
                player2.avatar
                  ? {uri: `${ENDPOINT}/images/${player2.avatar}`}
                  : require('../assets/images/avatar.png')
              }
            />
          ) : (
            <View style={styles.initials}>
              <Text style={{fontSize: 40, color: 'white'}}>
                {player2.username[0]}
              </Text>
            </View>
          )}

          <Text style={styles.username}>{player2.username}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,

    justifyContent: 'center',

    borderWidth: 0.4,
    borderRadius: 6,
    borderColor: borderColor,
    backgroundColor: white,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.9,
    shadowRadius: 1,
    elevation: 5,

    backgroundColor: white,
  },
  wrapper1: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    width: '100%',
  },
  avatarWrapper: {
    width: '40%',
    alignSelf: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 10,
  },
  initials: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 20,
    borderColor: borderColor,
    backgroundColor: 'black',
  },
  username: {
    alignSelf: 'center',
    fontSize: 16,
  },
});
