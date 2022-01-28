import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {borderColor, orangeBtn, white} from '../assets/styles/theme';
import {ENDPOINT} from '../utils/API';

export default (props) => {
  const {user, name, avatar, lastText, messages, onSelect} = props;

  let avatarUrl;
  if (avatar) {
    avatarUrl = `${ENDPOINT}/images/${avatar}`;
  } else {
    avatarUrl = `${ENDPOINT}/images/logo.png`;
  }

  const getUnReadMessages = () => {
    let unread = 0;
    messages.forEach((element) => {
      if (element.sender._id.toString() != user._id.toString()) {
        unread = !element.status ? unread + 1 : unread;
      }
    });
    return unread;
  };

  const getLastMessageDate = () => {
    const date = new Date(messages[messages.length - 1].createdAt);
    return `${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <TouchableOpacity onPress={onSelect} style={[styles.wrapper]}>
      <View style={styles.wrapper1}>
        {avatar ? (
          <View style={[styles.avatar]}>
            <Image
              style={{width: 50, height: 50, borderRadius: 50 / 2}}
              resizeMode="cover"
              source={{uri: avatarUrl}}
            />
          </View>
        ) : (
          <View style={[styles.avatar]}>
            <Image
              style={{width: 50, height: 50, borderRadius: 50 / 2}}
              resizeMode="contain"
              source={{uri: avatarUrl}}
            />
          </View>
        )}
      </View>
      <View style={styles.wrapper2}>
        <Text style={styles.messageText}>{name}</Text>
        <Text style={styles.messageSubText}>{lastText}</Text>
      </View>
      <View style={styles.wrapper3}>
        <Text style={{color: borderColor}}>{getLastMessageDate()}</Text>
        {getUnReadMessages() > 0 ? (
          <View style={styles.newMessageText}>
            <Text style={{color: white}}>{getUnReadMessages()}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 80,
    flexDirection: 'row',
    backgroundColor: white,

    marginBottom: 1,
    borderBottomWidth: 0.1,
    borderBottomColor: '#F3F1F8',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.9,
    shadowRadius: 1,
    elevation: 5,
    // paddingHorizontal: 10,
  },
  wrapper1: {
    width: '18%',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50 / 2,
    borderColor: borderColor,
  },
  wrapper2: {
    width: '62%',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  messageSubText: {
    fontSize: 14,
  },
  wrapper3: {
    width: '20%',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
  },
  newMessageText: {
    width: 25,
    height: 25,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: orangeBtn,
  },
});
