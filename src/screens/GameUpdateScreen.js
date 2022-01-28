import React, {useEffect} from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {orangeBtn} from '../assets/styles/theme';

import {ButtonLarge} from '../components/button';

import API from '../utils/API';
import deviceStorage from '../utils/deviceStorage';

export default ({navigation, route}) => {
  const updateGameResult = async (result) => {
    try {
      const response = await API.post(
        '/game/update-result',
        {result, game: route.params.game},
        {headers: {'auth-token': await deviceStorage.loadJWT()}},
      );

      if (response.status === 200) {
        showMessage({message: 'Risultati aggiornati', type: 'success'});
        navigation.navigate('Ricerca');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateTeamGameResult = async (result) => {
    try {
      const response = await API.post(
        '/team-game/update-result',
        {gameId: route.params.game, result},
        {
          headers: {'auth-token': await deviceStorage.loadJWT()},
        },
      );
      if (response.status === 200) {
        showMessage({message: 'Risultati aggiornati', type: 'success'});
        navigation.navigate('Ricerca');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.wrapper1}>
        <Text style={{fontSize: 20, alignSelf: 'center', fontWeight: 'bold'}}>
          Hai vinto o perso?
        </Text>
        <ButtonLarge
          title="VINTO"
          color={orangeBtn}
          onSubmit={
            route.params.gameType === 'Single'
              ? () => updateGameResult('Won')
              : () => updateTeamGameResult('Won')
          }
        />
        <ButtonLarge
          title="PERSO"
          color={orangeBtn}
          onSubmit={
            route.params.gameType === 'Single'
              ? () => updateGameResult('Lost')
              : () => updateTeamGameResult('Lost')
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  wrapper1: {
    flex: 0.4,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    marginVertical: 20,
  },
});
