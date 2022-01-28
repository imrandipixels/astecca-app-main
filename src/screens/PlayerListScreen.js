import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import globalStyles from '../assets/styles/globalStyles';
import {orangeBtn, white} from '../assets/styles/theme';
import Backdrop from '../components/backdrop';
import {ButtonLarge} from '../components/button';
import Card from '../components/cards';
import API from '../utils/API';
import deviceStorage from '../utils/deviceStorage';

export default ({route, navigation}) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const users = Object.values(route.params.data);
    setUsers(users);
  }, []);

  const onExtendSearch = async () => {
    try {
      const response = await API.get('/user/', {
        params: {username: '', all: true},
        headers: {'auth-token': await deviceStorage.loadJWT()},
      });
      if (response.status === 200) {
        if (response.data.length === users.length) {
          showMessage({
            message: 'Nessun altro giocatore trovato.',
            type: 'info',
          });
          return;
        }
        setUsers(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Backdrop />
      <ScrollView contentContainerStyle={{alignItems: 'center'}}>
        {users.length > 0 ? (
          users.map((v, i) => {
            return (
              <View
                style={{flex: 1, width: '100%', alignItems: 'center'}}
                key={i}>
                <Card
                  username={v.username}
                  motto={v.motto}
                  avatar={v.avatar}
                  onChat={() =>
                    navigation.navigate('Chat', {
                      recipient: v,
                      name: v.username,
                      chatAvatar: v.avatar ? v.avatar : 'avatar_default.png',
                    })
                  }
                  onPress={() => navigation.navigate('Request', {user: v})}
                />
                {i == users.length - 1 && route.params.searchScreen == false ? (
                  <View style={{width: '90%', alignItems: 'center'}}>
                    <ButtonLarge
                      title="Estendi la ricerca"
                      color={orangeBtn}
                      extraStyles={globalStyles.m10}
                      onSubmit={onExtendSearch}
                    />
                  </View>
                ) : null}
              </View>
            );
          })
        ) : (
          <View style={{width: '90%', alignItems: 'center'}}>
            <Text style={{fontSize: 18, marginVertical: 20}}>
              Non esistono giocatori con questo nome..
            </Text>
            <ButtonLarge
              title="Estendi la ricerca"
              color={orangeBtn}
              extraStyles={globalStyles.m10}
              onSubmit={onExtendSearch}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: white,
  },
});
