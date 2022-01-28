import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {black, borderColor, orangeIcon, white} from '../assets/styles/theme';
import {ENDPOINT} from '../utils/API';

export default (props) => {
  const {user, player, winner, date, onSelect} = props;
  const gameDate = new Date(date);
  return (
    <TouchableOpacity onPress={onSelect} style={styles.wrapper}>
      <View style={styles.avatarWrapper}>
        <View style={styles.wrapper1}>
          <Image
            resizeMode="contain"
            style={styles.avatar}
            source={
              user.avatar
                ? {uri: `${ENDPOINT}/images/${user.avatar}`}
                : require('../assets/images/avatarVB.png')
            }
          />
          <Text style={styles.username}>{user.username}</Text>
        </View>
        <View style={styles.wrapper2}>
          <Image
            resizeMode="contain"
            style={styles.avatar}
            source={
              player.avatar
                ? {uri: `${ENDPOINT}/images/${player.avatar}`}
                : require('../assets/images/avatarVB.png')
            }
          />
          <Text style={styles.username}>{player.username}</Text>
        </View>
      </View>
      <View style={styles.wrapper3}>
        {winner ? (
          <Text style={styles.details}>Vincitori: {winner.username}</Text>
        ) : null}

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.details}>
            Data:{' '}
            {`${gameDate.getDate()}-${
              gameDate.getMonth() + 1
            }-${gameDate.getFullYear()}`}
          </Text>
          <Text style={styles.details}>
            Ora: {`${gameDate.getHours()}:${gameDate.getMinutes()}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    width: '90%',
    marginVertical: 10,

    borderWidth: 0.4,
    borderRadius: 20,
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
  },
  wrapper1: {
    width: '50%',
  },
  wrapper2: {
    width: '50%',
  },
  avatarWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 10,
  },
  avatar: {
    alignSelf: 'center',
    height: 40,
    width: 40,
    marginVertical: 2,
  },
  username: {
    alignSelf: 'center',
    marginVertical: 5,
  },
  wrapper3: {
    paddingHorizontal: 40,
  },
  details: {
    fontSize: 16,
    marginVertical: 2,
  },
});
