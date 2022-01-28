import React, {useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import SearchScreen from '../screens/SearchScreen';
import RankingScreen from '../screens/RankingScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ProfileScreen from '../screens/ProfileScreen';

import {black, orangeIcon, white} from '../assets/styles/theme';
import API from '../utils/API';
import deviceStorage from '../utils/deviceStorage';
import {View, Text} from 'react-native';

const Tab = createBottomTabNavigator();

export default () => {
  const [unread, setUnread] = useState(0);
  const [notification, setnotification] = useState(0);
  const [gameNotification, setGameNotification] = useState(0);
  const [teamGameNotification, setTeamGameNotification] = useState(0);
  const [playerGameNotification, setPlayerGameNotification] = useState(0);

  const getPlayedGamesNotification = async () => {
    try {
      const response = await API.get('/game/notification', {
        headers: {'auth-token': await deviceStorage.loadJWT()},
      });
      if (response.status === 200) {
        setPlayerGameNotification(response.data.length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTeamNotifications = async () => {
    try {
      const response = await API.get('/notification/', {
        headers: {'auth-token': await deviceStorage.loadJWT()},
      });
      if (response.status === 200) {
        setnotification(response.data.length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTeamGameNotifications = async () => {
    try {
      const response = await API.get('/team-game/get-notifications', {
        headers: {'auth-token': await deviceStorage.loadJWT()},
      });
      if (response.status === 200) {
        setTeamGameNotification(response.data.length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getGameNotifications = async () => {
    try {
      const response = await API.get('/challenge/challenge-notifications', {
        headers: {'auth-token': await deviceStorage.loadJWT()},
      });
      if (response.status === 200) {
        setGameNotification(response.data.length);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const getUnReadMessages = async () => {
    try {
      const response = await API.get('/chat/unread', {
        headers: {
          'auth-token': await deviceStorage.loadJWT(),
        },
      });
      if (response.status === 200) {
        setUnread(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   getTeamNotifications();
  //   getUnReadMessages();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      getTeamNotifications();
      getGameNotifications();
      getTeamGameNotifications();
      getUnReadMessages();
      getPlayedGamesNotification();
      getPlayedGamesNotification();
    }, []),
  );

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Ricerca') {
            iconName = 'search';
          } else if (route.name == 'Classifica') {
            iconName = 'trophy';
          } else if (route.name == 'ChatList') {
            iconName = 'chatbox';
            return (
              <View style={{position: 'relative'}}>
                <Icon name={iconName} size={16} color={color} />
                {unread > 0 ? (
                  <View
                    style={{
                      position: 'absolute',
                      backgroundColor: 'red',
                      top: -10,
                      left: 10,
                      width: 15,
                      height: 15,
                      borderRadius: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{color: 'white'}}>{unread}</Text>
                  </View>
                ) : null}
              </View>
            );
          } else if (route.name == 'Profilo') {
            iconName = 'ios-person';
            return (
              <View style={{position: 'relative'}}>
                <Icon name={iconName} size={16} color={color} />
                {notification ||
                gameNotification ||
                teamGameNotification ||
                playerGameNotification > 0 ? (
                  <View
                    style={{
                      position: 'absolute',
                      backgroundColor: 'red',
                      top: -10,
                      left: 10,
                      width: 15,
                      height: 15,
                      borderRadius: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{color: 'white'}}>
                      {notification +
                        gameNotification +
                        teamGameNotification +
                        playerGameNotification}
                    </Text>
                  </View>
                ) : null}
              </View>
            );
          }
          return <Icon name={iconName} size={16} color={color} />;
        },
      })}
      tabBarOptions={{
        // style: {},
        labelPosition: 'beside-icon',
        activeTintColor: orangeIcon,
        inactiveTintColor: white,
        activeBackgroundColor: black,
        inactiveBackgroundColor: black,
      }}>
      <Tab.Screen name="Ricerca" component={SearchScreen} />
      <Tab.Screen name="Classifica" component={RankingScreen} />
      <Tab.Screen
        options={{title: 'Chat'}}
        name="ChatList"
        component={ChatListScreen}
      />
      <Tab.Screen name="Profilo" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
