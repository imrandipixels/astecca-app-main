import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {borderColor, white} from '../assets/styles/theme';
import globalStyles from '../assets/styles/globalStyles';
import {ENDPOINT} from '../utils/API';

export default (props) => {
  const {username, motto, avatar, wins, onPress, onChat, onAdd} = props;
  let avatarUrl = `${ENDPOINT}/images/${avatar}`;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.wrapper, globalStyles.m10]}>
      {avatar ? (
        <View style={styles.wrapper1}>
          <Image
            resizeMode="cover"
            style={{width: '100%', height: '100%', borderRadius: 50 / 2}}
            source={{uri: avatarUrl}}
          />
        </View>
      ) : (
        <View style={styles.wrapper1}>
          <Image
            resizeMode="contain"
            style={{width: '100%', height: '100%', borderRadius: 50 / 2}}
            source={require('../assets/images/authLogo2.png')}
          />
        </View>
      )}
      <View style={styles.wrapper2}>
        <Text style={styles.mainText}>{username}</Text>
        <Text style={styles.subText}>{motto}</Text>
        <View style={styles.iconWrapper}>
          <MaterialIcon name="star" size={22} color="#EEA03B" />
          <MaterialIcon name="star" size={22} color="#EEA03B" />
          <MaterialIcon name="star" size={22} color="#EEA03B" />
        </View>
      </View>
      <View style={styles.wrapper3}>
        <View style={{marginTop: 'auto'}}>
          {/* <TouchableOpacity onPress={onAdd} style={{marginRight: 10}}>
            <Ionicons name="person-add" size={22} color="#FE510D" />
          </TouchableOpacity> */}

          <TouchableOpacity onPress={onChat} style={{marginRight: 10}}>
            <Ionicons name="chatbox" size={22} color="#FE510D" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={[globalStyles.m5, {fontSize: 13}]}>{wins}</Text>
          <AwesomeIcon name="trophy" size={24} color="#FE510D" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 0.12,
    flexDirection: 'row',
    alignItems: 'center',

    width: '90%',
    padding: 10,

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
  },
  wrapper1: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    borderWidth: 1.5,
  },
  initials: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderColor: borderColor,
    backgroundColor: 'black',
  },
  wrapper2: {
    marginHorizontal: 15,
  },
  wrapper3: {
    marginLeft: 'auto',
    flexDirection: 'row',
    // alignItems: 'flex-end',
    // justifyContent: 'space-between',
  },
  iconWrapper: {
    flexDirection: 'row',
  },
  mainText: {
    fontSize: 18,
    fontWeight: '900',
  },
  subText: {
    fontSize: 12,
  },
});
