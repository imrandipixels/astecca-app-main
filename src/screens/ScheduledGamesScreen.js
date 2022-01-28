import React, {useEffect, useState, useContext} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {borderColor, white} from '../assets/styles/theme';

// Context
import {UserContext} from '../providers/UserProvider';

import API from '../utils/API';
import deviceStorage from '../utils/deviceStorage';

import GameCard from '../components/gameCard';
import TeamGameCard from '../components/TeamGameCard';

export default () => {
  const [user, setUser] = useContext(UserContext);
  const [scheduledGames, setScheduledGames] = useState(null);
  const [teamScheduledGames, setTeamScheduledGames] = useState(null);

  const getScheduledGames = async () => {
    try {
      const response = await API.post(
        '/game/get-games',
        {status: 'Scheduled'},
        {
          headers: {'auth-token': await deviceStorage.loadJWT()},
        },
      );
      if (response.status === 200) {
        if (response.data[0]) {
          setScheduledGames(response.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTeamScheduledGames = async () => {
    try {
      const response = await API.get('/team-game/get-games', {
        params: {status: 'Scheduled'},
        headers: {'auth-token': await deviceStorage.loadJWT()},
      });
      if (response.status === 200) {
        setTeamScheduledGames(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getScheduledGames();
    getTeamScheduledGames();
  }, []);

  const renderGamesList = () => {
    if (scheduledGames !== null) {
      return (
        <FlatList
          data={scheduledGames}
          renderItem={({item}) => (
            <GameCard
              user={user}
              player={
                item.players[0]._id != user._id
                  ? item.players[0]
                  : item.players[1]
              }
              winner={item.winner}
              date={item.date}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      );
    } else {
      return (
        <Text style={{fontSize: 18, alignSelf: 'center', marginTop: 10}}>
          Non hai ancora giocato
        </Text>
      );
    }
  };

  const renderTeamGamesList = () => {
    if (teamScheduledGames !== null) {
      return (
        <FlatList
          data={teamScheduledGames}
          renderItem={({item}) => (
            <TeamGameCard
              user={user}
              player={user}
              winner={item.winner}
              date={item.date}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      );
    } else {
      return (
        <Text
          style={{
            fontSize: 18,
            alignSelf: 'center',
            marginTop: 10,
            maxWidth: '80%',
          }}>
          Non hai ancora effettuato nessuna sfida a squadre
        </Text>
      );
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.wrapper1}>
        <Text style={styles.header}>Sfide giocate</Text>
        {renderGamesList()}
      </View>
      <View style={styles.wrapper2}>
        <Text style={styles.header}>Sfide giocate in team</Text>
        {renderTeamGamesList()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-evenly',
    backgroundColor: white,
    paddingVertical: 10,
  },
  wrapper1: {
    flex: 0.45,
    alignSelf: 'center',
    width: '90%',

    paddingVertical: 10,

    borderWidth: 0.4,
    borderRadius: 6,
    borderColor: borderColor,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.9,
    shadowRadius: 1,
    elevation: 5,

    backgroundColor: white,
  },
  wrapper2: {
    flex: 0.45,
    alignSelf: 'center',
    width: '90%',

    paddingVertical: 10,

    borderWidth: 0.4,
    borderRadius: 6,
    // borderColor: borderColor,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.9,
    shadowRadius: 1,
    elevation: 5,

    backgroundColor: white,
  },
  header: {
    fontSize: 22,
    marginVertical: 10,
    marginHorizontal: 15,
  },
});
