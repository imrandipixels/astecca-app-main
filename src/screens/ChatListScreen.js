import React, {useContext, useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {UserContext} from '../providers/UserProvider';

import API from '../utils/API';

import {white} from '../assets/styles/theme';

import ChatCard from '../components/customChatCard';
import Backdrop from '../components/backdrop';

export default ({navigation}) => {
  const [user, setUser] = useContext(UserContext);
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   getInbox();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      getInbox();
    }, []),
  );

  // Gets the whole inbox for the user
  const getInbox = async () => {
    try {
      const response = await API.get('/chat/get-all-inbox', {
        params: {userId: user._id},
      });
      if (response.status == 200) {
        setInbox(response.data);
        setLoading(false);
        // console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Backdrop />
      {loading ? (
        <ActivityIndicator style={{marginTop: 50}} color="black" size="large" />
      ) : (
        <ScrollView contentContainerStyle={styles.wrapper1}>
          {inbox.length >= 1 ? (
            inbox.map((v, i) => {
              let name =
                v.members[0]._id != user._id
                  ? v.members[0].username
                  : v.members[1].username;
              let recipient =
                v.members[0]._id != user._id ? v.members[0] : v.members[1];
              let avatar =
                v.members[0]._id != user._id
                  ? v.members[0].avatar
                  : v.members[1].avatar;
              return (
                <ChatCard
                  key={v.conversationId}
                  user={user}
                  name={name}
                  avatar={avatar ? avatar : null}
                  lastText={v.messages[v.messages.length - 1].content}
                  messages={v.messages}
                  onSelect={() =>
                    navigation.navigate('Chat', {
                      recipient,
                      name: recipient.username,
                      chatAvatar: avatar ? avatar : 'logo.png',
                      conversationId: v.conversationId,
                    })
                  }
                />
              );
            })
          ) : (
            <View style={{paddingTop: 50}}>
              <Text>
                Non hai chat attive, inizia a scriverti con qualcuno dai
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: white,
  },
  wrapper1: {
    width: '92%',
  },
});
