import React, {useState, useEffect, useContext} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {UserContext} from '../providers/UserProvider';

import {
  black,
  borderColor,
  orange,
  orangeBtn,
  white,
} from '../assets/styles/theme';
import Fields from '../components/reviewFields';
import {ButtonLarge} from '../components/button';
import Backdrop from '../components/backdrop';

import {showMessage} from 'react-native-flash-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import API from '../utils/API';
import deviceStorage from '../utils/deviceStorage';
import globalStyles from '../assets/styles/globalStyles';
import {set} from 'react-native-reanimated';

export default ({navigation, route}) => {
  const {team} = route.params;

  const [user, setUser] = useContext(UserContext);

  const [amChallenged, setAmChallenged] = useState(null);
  const [haveChallenged, setHaveChallenged] = useState(null);
  const [acceptedChallenges, setAcceptedChallenges] = useState(null);

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const challengeTeam = async () => {
    let challengeDate = new Date();
    challengeDate.setDate(date.getDate());
    challengeDate.setHours(time.getHours());
    challengeDate.setMinutes(time.getMinutes());

    try {
      const response = await API.post(
        '/team-game/new',
        {opponentId: team._id, date: challengeDate},
        {headers: {'auth-token': await deviceStorage.loadJWT()}},
      );
      if (response.status === 200) {
        setHaveChallenged(response.data);
        showMessage({message: 'Sfida inviata con successo!', type: 'success'});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAmChallenged = async () => {
    const status = 'Challenged';
    const opponent = user.team._id;
    const challenger = team._id;

    try {
      const response = await API.post(
        '/team-game/get-game',
        {status, opponent, challenger},
        {headers: {'auth-token': await deviceStorage.loadJWT()}},
      );
      if (response.status === 200) {
        setAmChallenged(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getHaveChallenged = async () => {
    const status = 'Challenged';
    const opponent = team._id;
    const challenger = user.team._id;

    try {
      const response = await API.post(
        '/team-game/get-game',
        {status, opponent, challenger},
        {headers: {'auth-token': await deviceStorage.loadJWT()}},
      );
      if (response.status === 200) {
        setHaveChallenged(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAccpetedChallenges = async () => {
    const status = 'Scheduled';
    const opponent = team._id;
    const challenger = user.team._id;

    try {
      const response = await API.post(
        '/team-game/get-game',
        {status, opponent, challenger},
        {headers: {'auth-token': await deviceStorage.loadJWT()}},
      );
      if (response.status === 200) {
        if (response.data) {
          setAcceptedChallenges(response.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDateTimeChange = (event, selectedValue) => {
    setShow(Platform.OS === 'ios');
    if (mode == 'date') {
      const currentDate = selectedValue || new Date();
      setDate(currentDate);
      setMode('time');
      setShow(Platform.OS !== 'ios');
    } else {
      const selectedTime = selectedValue || new Date();
      setTime(selectedTime);
      setShow(Platform.OS == 'ios');
      setMode('date');
    }
  };

  const onAcceptChallenge = async () => {
    try {
      const response = await API.post(
        '/team-game/update-game',
        {status: 'Scheduled', gameId: amChallenged._id},
        {headers: {'auth-token': await deviceStorage.loadJWT()}},
      );
      if (response.status === 200) {
        setAmChallenged(null);
        setAcceptedChallenges(response.data);
        showMessage({message: 'Sfida accettata', type: 'success'});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onRefuseChallenge = async () => {
    try {
      const response = await API.post(
        '/team-game/update-game',
        {status: 'Refused', gameId: amChallenged[0]._id},
        {headers: {'auth-token': await deviceStorage.loadJWT()}},
      );
      if (response.status === 200) {
        console.log(response.data);
        showMessage({message: 'Sfida rifiutata', type: 'success'});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onCancelChallenge = async () => {
    try {
      const response = await API.post(
        '/team-game/update-game',
        {status: 'Cancelled', gameId: haveChallenged._id},
        {headers: {'auth-token': await deviceStorage.loadJWT()}},
      );
      if (response.status === 200) {
        setHaveChallenged(null);
        setDate(null);
        setTime(null);
        showMessage({message: 'Sfida annullata', type: 'success'});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderChallengeBtns = () => {
    if (!haveChallenged && !amChallenged && !acceptedChallenges) {
      return (
        <View style={{alignItems: 'center', width: '100%'}}>
          <ButtonLarge
            title="Sfida!"
            color={orangeBtn}
            extraStyles={globalStyles.m10}
            onSubmit={() => setShow(true)}
          />
          <ButtonLarge
            title="Invia sfida"
            color={date && time ? orangeBtn : black}
            extraStyles={globalStyles.m10}
            onSubmit={
              date && time
                ? challengeTeam
                : () =>
                    showMessage({
                      message: 'Prima devi selezionare la data e l’ora',
                      type: 'info',
                    })
            }
          />
        </View>
      );
    }
  };

  useEffect(() => {
    getAmChallenged();
    getHaveChallenged();
    getAccpetedChallenges();
  }, []);

  return (
    <View style={styles.wrapper}>
      <Backdrop />
      <View style={styles.wrapper1}>
        <Text style={styles.date}>
          {date
            ? `Data: ${date.getDate()} - ${date.getMonth()} - ${date.getFullYear()}`
            : 'A volte bisogna provarci..'}{' '}
          {time ? `Ora: ${time.getHours()}:${time.getMinutes()}` : ''}
        </Text>
      </View>
      <View style={styles.wrapper2}>
        {renderChallengeBtns()}
        {haveChallenged ? (
          <ButtonLarge
            title="Annulla sfida"
            color={black}
            extraStyles={globalStyles.m10}
            onSubmit={onCancelChallenge}
          />
        ) : null}

        {amChallenged ? (
          <View style={{width: '100%', alignItems: 'center'}}>
            <ButtonLarge
              title="Accept Challenge"
              color={orangeBtn}
              extraStyles={globalStyles.m10}
              onSubmit={onAcceptChallenge}
            />
            <ButtonLarge
              title="Refuse Challenge"
              color={black}
              extraStyles={globalStyles.m10}
              onSubmit={onRefuseChallenge}
            />
          </View>
        ) : null}

        {acceptedChallenges ? (
          <ButtonLarge
            title="Visualizza la programmazione"
            color={orangeBtn}
            extraStyles={globalStyles.m10}
            onSubmit={() => navigation.navigate()}
          />
        ) : null}

        {show ? (
          <DateTimePicker
            minimumDate={new Date()}
            timeZoneOffsetInMinutes={0}
            value={date ? date : new Date()}
            mode={mode}
            is24Hour={true}
            onChange={onDateTimeChange}
          />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-evenly',
    backgroundColor: white,
  },
  wrapper1: {
    flex: 0.1,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',

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
    flex: 0.5,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',

    padding: 20,

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
  date: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
