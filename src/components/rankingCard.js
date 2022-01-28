import React from 'react';
import {View, TouchableOpacity, StyleSheet, Image, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {ENDPOINT} from '../utils/API';
import {white} from '../assets/styles/theme';

export default (props) => {
  const {username, motto, avatar, wins, rank, onPress, onChat} = props;
  let avatarUrl = `${ENDPOINT}/images/${avatar}`;

  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress}>
      <View style={styles.wrapper_1}>
        <Text style={styles.rankText}>{`${rank}.`}</Text>
      </View>
      <View style={styles.wrapper_2}>
        <View style={styles.wrapper_2__1}>
          {avatar ? (
            <View style={styles.avatar_wrapper}>
              <Image
                source={{uri: avatarUrl}}
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View style={styles.avatar_wrapper}>
              <Image
                source={require('../assets/images/authLogo2.png')}
                style={styles.avatar}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
        <View style={styles.wrapper_2__2}>
          <Text style={styles.username_text}>{username}</Text>
          <Text style={styles.motto_text}>{motto}</Text>
        </View>
        <View style={styles.wrapper_2__3}>
          {/* <View style={styles.chat_icon_wrapper}>
            <Ionicons name="chatbox" size={20} color="#FE510D" />
          </View> */}
          <View style={styles.tropies_wrapper}>
            <AwesomeIcon name="trophy" size={20} color="#FE510D" />
            <Text style={styles.tropies_text}>{wins}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    height: 90,
    marginVertical: 10,
    paddingVertical: 5,

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
  wrapper_1: {
    flex: 0.15,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    // borderRightWidth: 0.5,
  },
  rankText: {
    fontSize: 24,
    // fontWeight: 'bold',
  },
  wrapper_2: {
    flex: 0.85,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: '100%',
  },
  wrapper_2__1: {
    flex: 0.2,
    justifyContent: 'center',
  },
  avatar_wrapper: {
    height: 55,
    width: 55,
    borderRadius: 55 / 2,
    borderWidth: 1.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    height: 55,
    width: 55,
    borderRadius: 55 / 2,
  },
  initials_wrapper: {
    height: 55,
    width: 55,
    alignItems: 'center',
    borderRadius: 16,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  initials_text: {
    fontSize: 28,
    textTransform: 'capitalize',
    color: 'white',
  },
  wrapper_2__2: {
    flex: 0.55,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  username_text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  motto_text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'grey',
  },
  wrapper_2__3: {
    flex: 0.2,
    justifyContent: 'center',
  },
  chat_icon_wrapper: {
    // alignItems: 'center',
    justifyContent: 'center',
  },
  tropies_wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-evenly',
  },
  tropies_text: {
    fontSize: 22,
    marginLeft: 5,
    // alignSelf: 'flex-start',
  },
});
