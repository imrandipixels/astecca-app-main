import React, {useEffect, useState, useContext} from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import Pulse from 'react-native-pulse';
import {showMessage} from 'react-native-flash-message';

// Utilities
import API from '../utils/API';

import {UserContext} from '../providers/UserProvider';

import Backdrop from '../components/backdrop';
import {black, white} from '../assets/styles/theme';
import {ButtonLarge} from '../components/button';
import SearchBar from '../components/searchBar';

import NotificationHandler from '../utils/notificationHandlers';
import {TouchableOpacity} from 'react-native-gesture-handler';
import deviceStorage from '../utils/deviceStorage';

export default ({route, navigation}) => {
  const [user, setUser] = useContext(UserContext);
  const [search, setSearch] = useState('');

  useEffect(() => {
    NotificationHandler(navigation);
  }, []);

  const onSearch = async () => {
    try {
      const response = await API.get('/user/', {
        params: {username: search, all: false},
        headers: {'auth-token': await deviceStorage.loadJWT()},
      });
      if (response.status === 200) {
        navigation.navigate('Players', {
          data: response.data,
          searchScreen: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onPlayerList = async () => {
    try {
      const response = await API.get('/user/get-players', {
        params: {table: user.table, timePrefered: user.timePrefered},
        headers: {'auth-token': await deviceStorage.loadJWT()},
      });
      if (response.status === 200) {
        navigation.navigate('Players', {
          data: response.data,
          searchScreen: false,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Backdrop />
      <View style={styles.wrapper1}>
        <Pulse
          style={styles.pulse}
          color="black"
          numPulses={3}
          diameter={400}
          speed={50}
          duration={1000}
        />
        <TouchableOpacity style={{zIndex: 99}} onPress={onPlayerList}>
          <Image
            style={styles.cover}
            resizeMode="cover"
            source={require('../assets/images/searchIcon.png')}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.wrapper3}>
        <Text style={{color: 'black', fontWeight: 'bold', fontSize: 14}}>
          Oppure..
        </Text>
        <Text
          style={{
            color: 'black',
            fontWeight: 'bold',
            fontSize: 14,
            textAlign: 'center',
          }}>
          Cerca partite da giocare in coppia!
        </Text>
        <ButtonLarge
          color={black}
          title="2 VS 2"
          onSubmit={
            user.team
              ? () => navigation.navigate('Team Search')
              : () =>
                  showMessage({
                    message: 'Devi prima far parte di una squadra',
                    type: 'info',
                  })
          }
        />
      </View>

      <View style={styles.wrapper2}>
        <SearchBar
          placeholder="Cerca giocatori tramite nome"
          value={search}
          onSubmit={onSearch}
          onChange={(value) => setSearch(value)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: white,
  },
  wrapper1: {
    flex: 0.5,
    justifyContent: 'center',
  },
  wrapper2: {
    flex: 0.2,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 35,
  },
  wrapper3: {
    flex: 0.2,
    width: '65%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  cover: {
    // position: 'relative',
    width: 200,
    height: 200,
    // zIndex: 99,
  },
  pulse: {
    // position: 'absolute',
    // zIndex: 1,
  },
});
