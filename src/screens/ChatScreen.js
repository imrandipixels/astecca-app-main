import React, {useEffect, useState, useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {GiftedChat} from 'react-native-gifted-chat';

import {SocketContext} from '../providers/SocketProvider';
import {UserContext} from '../providers/UserProvider';

import SocketController from '../utils/Socket.controller';
import API, {SOCKET_ENDPOINT} from '../utils/API';
import {white} from '../assets/styles/theme';

export default ({route, navigation}) => {
  const [socket, setSocket] = useContext(SocketContext);
  const [user, setUser] = useContext(UserContext);

  const [conversationId, setConversationId] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const getMessages = async () => {
    try {
      const response = await API.get('/chat/get-inbox', {
        params: {
          receiverId: route.params.recipient._id,
          userId: user._id,
          conversationId: route.params.conversationId,
        },
      });
      if (response.status == 200) {
        if (response.data != null) {
          setConversationId(response.data['conversationId']);
          setMessages(response.data['messages']);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!socket) {
      let socketInstance = SocketController.connect(SOCKET_ENDPOINT);
      SocketController.subscribe(socketInstance, {
        userId: data._id,
      });
    }

    setRecipient(route.params.recipient);
    getMessages();

    socket.on('recieve-message', (payload) => {
      SocketController.readMessages(socket, route.params.conversationId);
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [payload]),
      );
    });

    return () => {
      socket.off('recieve-message');
    };
  }, []);

  const onSend = (messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );

    let userId = user._id;
    let recipientId = recipient._id;
    const payload = {
      conversationId: conversationId || `${user._id}-${recipient._id}`,
      members: [userId, recipientId],
      content: messages[0]['text'],
      receiver: recipientId,
      sender: userId,
      createdAt: new Date(),
    };
    SocketController.sendMessage(socket, payload, () =>
      console.log('Message sent'),
    );
  };

  return (
    <GiftedChat
      locale="it"
      timeFormat={'HH:mm'}
      placeholder="Digita un messaggio.."
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{_id: user._id}}
      onPressAvatar={() =>
        navigation.navigate('Request', {user: route.params.recipient})
      }
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: white,
  },
  inputWrapper: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  inputWrapper_textField: {
    width: '80%',
  },
  inputWrapper_sendBtn: {
    justifyContent: 'center',
    alignItems: 'center',

    marginHorizontal: 5,
    width: 50,
    height: 50,
  },
  textField: {},
});
