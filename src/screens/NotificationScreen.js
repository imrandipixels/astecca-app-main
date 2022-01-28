import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import {black, white} from '../assets/styles/theme';

// Context
import {UserContext} from '../providers/UserProvider';
import deviceStorage from '../utils/deviceStorage';

// Utilities
import API from '../utils/API';

// Custom imports
import Card from '../components/notificationCard';
import {showMessage} from 'react-native-flash-message';

export default ({navigation}) => {
  const [user, setUser] = useContext(UserContext);
  const [teamNotifications, setTeamNotifications] = useState(null);
  const [gameNotifications, setGameNotifications] = useState(null);
  const [teamGameNotifications, setTeamGameNotifications] = useState(null);

  const getTeamNotifications = async () => {
    try {
      const response = await API.get('/notification/', {
        headers: {'auth-token': await deviceStorage.loadJWT()},
      });
      if (response.status === 200) {
        setTeamNotifications(response.data);
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
        setGameNotifications(response.data);
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
        setTeamGameNotifications(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onGameAccept = async (challenger, challenge) => {
    try {
      const response = await API.post(
        '/game/create-game',
        {challenger, challenge},
        {headers: {'auth-token': await deviceStorage.loadJWT()}},
      );
      if (response.status === 200) {
        // Remove the notification
        let updatedGameNotifications = gameNotifications.filter((value) => {
          return value._id !== challenge._id;
        });
        setGameNotifications(updatedGameNotifications);
        showMessage({
          message: 'Sfida accettata',
          description: 'Una nuova sfida è stata programmata!',
          type: 'success',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onGameCancel = async (challengerId, challengeId) => {
    try {
      const response = await API.post(
        '/challenge/refuse-challenge',
        {player: challengerId},
        {headers: {'auth-token': await deviceStorage.loadJWT()}},
      );
      if (response.status === 200) {
        let challenges = gameNotifications.filter((v) => {
          return v._id != challengeId;
        });
        setGameNotifications(challenges);
        showMessage({
          message: 'Sfida rifiutata',
          type: 'success',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onTeamGameAccept = async (gameId) => {
    try {
      const response = await API.post(
        '/team-game/update-game',
        {status: 'Scheduled', gameId},
        {headers: {'auth-token': await deviceStorage.loadJWT()}},
      );
      if (response.status === 200) {
        let newTeamGameNotifications = teamGameNotifications.filter((v) => {
          return v._id != gameId;
        });
        setTeamGameNotifications(newTeamGameNotifications);
        showMessage({message: 'Sfida accettata!', type: 'success'});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onTeamGameCancel = async (gameId) => {
    try {
      const response = await API.post(
        '/team-game/update-game',
        {status: 'Refused', gameId},
        {headers: {'auth-token': await deviceStorage.loadJWT()}},
      );
      if (response.status === 200) {
        let newTeamGameNotifications = teamGameNotifications.filter((v) => {
          return v._id != gameId;
        });
        setTeamGameNotifications(newTeamGameNotifications);
        showMessage({message: 'Sfida accettata.', type: 'success'});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onTeamAccept = async (notificationId) => {
    try {
      const response = await API.post(
        '/team/create',
        {notificationId},
        {
          headers: {'auth-token': await deviceStorage.loadJWT()},
        },
      );
      if (response.status === 200) {
        let newNotifications = teamNotifications.filter((v) => {
          return v._id !== notificationId;
        });
        setTeamNotifications(newNotifications);
        setUser(response.data);
        showMessage({message: 'Sfida accettata.', type: 'success'});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onTeamCancel = async (notificationId) => {
    try {
      const response = await API.post(
        '/notification/cancel',
        {notificationId},
        {
          headers: {'auth-token': await deviceStorage.loadJWT()},
        },
      );
      if (response.status === 200) {
        let newNotifications = teamNotifications.filter((v) => {
          return v._id !== notificationId;
        });
        setTeamNotifications(newNotifications);
        showMessage({message: 'Richiesta annullata'});
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTeamNotifications();
    getGameNotifications();
    getTeamGameNotifications();
  }, []);

  const renderTeamNotifications = () => {
    if (teamNotifications.length >= 1) {
      return (
        <FlatList
          contentContainerStyle={styles.notificationList}
          data={teamNotifications}
          renderItem={({item}) => (
            <Card
              by={item.from.username}
              type="team-request"
              onAccept={() => onTeamAccept(item._id)}
              onCancel={() => onTeamCancel(item._id)}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      );
    } else {
      return (
        <Text style={{alignSelf: 'center', fontSize: 20, marginVertical: 50}}>
          Attualmente non ci sono richieste
        </Text>
      );
    }
  };

  const renderGameNotifications = () => {
    if (gameNotifications.length >= 1) {
      return (
        <FlatList
          contentContainerStyle={styles.notificationList}
          data={gameNotifications}
          renderItem={({item}) => (
            <Card
              by={item.challenger.username}
              type="game-request"
              date={item.date}
              onAccept={() => onGameAccept(item.challenger, item)}
              onCancel={() => onGameCancel(item.challenger._id, item._id)}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      );
    } else {
      return (
        <Text style={{alignSelf: 'center', fontSize: 20, marginVertical: 50}}>
          Attualmente non ci sono sfide
        </Text>
      );
    }
  };

  const renderTeamGameNotifications = () => {
    if (teamGameNotifications[0]) {
      return (
        <FlatList
          contentContainerStyle={styles.notificationList}
          data={teamGameNotifications}
          renderItem={({item}) => (
            <Card
              by={item.challengerTeam.captain.username}
              type="team-game-request"
              date={item.date}
              onAccept={() => onTeamGameAccept(item._id)}
              onCancel={() => onTeamGameCancel(item._id)}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      );
    } else {
      return (
        <Text style={{alignSelf: 'center', fontSize: 20, marginVertical: 50}}>
          Attualmente non ci sono sfide richieste
        </Text>
      );
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.wrapper1}>
        <Text style={styles.notificationHeader}>Sfide a biliardo</Text>
        {gameNotifications ? (
          renderGameNotifications()
        ) : (
          <ActivityIndicator
            style={{marginTop: 30}}
            size="large"
            color={black}
          />
        )}
      </View>
      <View style={styles.wrapper1}>
        <Text style={styles.notificationHeader}>Richieste di Team</Text>
        {teamNotifications ? (
          renderTeamNotifications()
        ) : (
          <ActivityIndicator
            style={{marginTop: 30}}
            size="large"
            color={black}
          />
        )}
      </View>
      <View style={styles.wrapper1}>
        <Text style={styles.notificationHeader}>
          Richieste di sfida in team
        </Text>
        {teamGameNotifications ? (
          renderTeamGameNotifications()
        ) : (
          <ActivityIndicator
            style={{marginTop: 30}}
            size="large"
            color={black}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: white,
  },
  wrapper1: {
    width: '92%',
    alignSelf: 'center',
    flex: 0.333,
  },
  notificationHeader: {
    fontSize: 28,
    fontWeight: '100',
  },
  notificationList: {
    alignSelf: 'center',
    marginVertical: 20,
  },
});
