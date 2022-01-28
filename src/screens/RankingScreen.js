import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text} from 'react-native';
import {orangeIcon, white} from '../assets/styles/theme';
import Backdrop from '../components/backdrop';
import Card from '../components/cards';
import RankingCard from '../components/rankingCard';

// Utilities
import API from '../utils/API';
import deviceStorage from '../utils/deviceStorage';

export default ({route, navigation}) => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const response = await API.get('/user/rankings', {
        headers: {'auth-token': await deviceStorage.loadJWT()},
      });
      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const renderRanks = () => {};

  return (
    <View style={{backgroundColor: white, flex: 1}}>
      <Backdrop />
      {users.length ? (
        <ScrollView contentContainerStyle={{width: '90%', alignSelf: 'center'}}>
          {users.map((v, i) => (
            <RankingCard
              username={v.username}
              motto={v.motto}
              avatar={v.avatar}
              wins={v.wins}
              rank={i + 1}
              key={i}
            />
          ))}
        </ScrollView>
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 20,
          }}>
          <Text style={{fontSize: 18}}>Nessun gioco ancora giocato.</Text>
        </View>
      )}
    </View>
  );
};
