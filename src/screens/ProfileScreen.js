import React, {useState, useContext, useCallback} from 'react';
import {
  Image,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {
  black,
  borderColor,
  orangeBtn,
  orangeIcon,
  white,
  yellowIcon,
} from '../assets/styles/theme';
import {useFocusEffect} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Ionicons';

import {UserContext} from '../providers/UserProvider';

import Fields from '../components/reviewFields';
import {ButtonLarge} from '../components/button';
import Backdrop from '../components/backdrop';
import globalStyles from '../assets/styles/globalStyles';

// Utilities
import deviceStorage from '../utils/deviceStorage';
import API, {ENDPOINT} from '../utils/API';

export default ({navigation}) => {
  const [user, setUser] = useContext(UserContext);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [notifications, setnotifications] = useState(0);
  const [gameNotification, setGameNotification] = useState(0);
  const [teamGameNotification, setTeamGameNotification] = useState(0);

  const getUser = async () => {
    try {
      const response = await API.get('/user/profile', {
        headers: {'auth-token': await deviceStorage.loadJWT()},
      });
      if (response.status === 200) {
        setUser(response.data);
        if (response.data.avatar) {
          setAvatarUrl(`${ENDPOINT}/images/${response.data.avatar}`);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

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
        setnotifications(response.data.length);
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

  useFocusEffect(
    useCallback(() => {
      getUser();
      getTeamNotifications();
      getGameNotifications();
      getTeamGameNotifications();
      getPlayedGamesNotification();
    }, []),
  );

  return (
    <View style={styles.wrapper}>
      {user ? (
        <>
          <Backdrop />

          <View style={styles.wrapper1}>
            <View style={styles.avatar_wrapper}>
              <Image
                resizeMode="contain"
                style={styles.avatar}
                source={
                  avatarUrl
                    ? {uri: avatarUrl}
                    : require('../assets/images/authLogo2.png')
                }
              />
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications')}
              style={styles.notificationIcon}>
              <Icon name="notifications-outline" size={38} color={black} />
              {notifications || gameNotification || teamGameNotification > 0 ? (
                <View
                  style={{
                    backgroundColor: orangeBtn,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    position: 'absolute',
                    top: -4,
                    left: -2,
                  }}>
                  <Text style={{fontSize: 16}}>
                    {notifications + gameNotification}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Games')}
              style={styles.gamesIcon}>
              <Icon name="game-controller-outline" size={38} color={black} />
              {playerGameNotification > 0 ? (
                <View
                  style={{
                    backgroundColor: orangeBtn,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    position: 'absolute',
                    top: -4,
                    left: -2,
                  }}>
                  <Text style={{fontSize: 16}}>{playerGameNotification}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          </View>

          <View style={styles.wrapper2}>
            <Text style={styles.header}>{user.username}</Text>
            <Fields
              icon={1}
              textLeft="Punti"
              textRight={user.wins}
              iconName="trophy"
              iconColor={orangeIcon}
              extraStyles={{
                borderBottomWidth: 2,
                borderBottomColor: borderColor,
              }}
            />
            <Fields
              textLeft="Genere"
              textRight={user.gender === 'male' ? 'Uomo' : 'Donna'}
              iconName="trophy"
              iconColor={orangeIcon}
              extraStyles={{
                borderBottomWidth: 2,
                borderBottomColor: borderColor,
              }}
            />
            <Fields
              textLeft="Disponibilità"
              textRight={user.status}
              iconName="trophy"
              iconColor={orangeIcon}
              extraStyles={{
                borderBottomWidth: 2,
                borderBottomColor: borderColor,
              }}
            />
            {/* <Fields
              icon={3}
              textLeft="classifica"
              textRight="Fiducia"
              iconName="star"
              iconColor={yellowIcon}
            /> */}
            <ButtonLarge
              onSubmit={() => navigation.navigate('Edit Profile')}
              title="Modifica Profilo"
              color={orangeBtn}
              extraStyles={globalStyles.m25}
            />
          </View>
        </>
      ) : (
        <ActivityIndicator size="large" color="black" />
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
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  wrapper2: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '92%',
  },
  avatar_wrapper: {
    width: 160,
    height: 160,
    borderWidth: 1.5,
    borderRadius: 160 / 2,
    overflow: 'hidden',
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  notificationIcon: {
    position: 'absolute',
    top: 15,
    right: 10,
  },
  gamesIcon: {
    position: 'absolute',
    top: 15,
    left: 10,
  },
});
