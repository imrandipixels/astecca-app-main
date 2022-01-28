import React, {useState, useContext, useEffect} from 'react';
import {
  Image,
  View,
  StyleSheet,
  Text,
  Modal,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import {black, borderColor, orangeBtn, white} from '../assets/styles/theme';

import {UserContext} from '../providers/UserProvider';

import {showMessage} from 'react-native-flash-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';

// Custom components
import Fields from '../components/reviewFields';
import {ButtonLarge, ButtonSmall} from '../components/button';
import Backdrop from '../components/backdrop';
import globalStyles from '../assets/styles/globalStyles';

// Utilities
import API, {ENDPOINT} from '../utils/API';
import deviceStorage from '../utils/deviceStorage';

export default ({route, navigation}) => {
  const [you, setYou] = useContext(UserContext);
  const {user} = route.params;

  const [loading, setLoading] = useState(false);
  const [amChallenged, setAmChallenged] = useState(null);
  const [haveChallenged, setHaveChallenged] = useState(null);
  const [acceptedChallenges, setAcceptedChallenges] = useState(null);

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const getChallenges = async () => {
    try {
      const response = await API.post(
        '/challenge/get-challenges',
        {player: user._id},
        {
          headers: {'auth-token': await deviceStorage.loadJWT()},
        },
      );
      if (response.status === 200) {
        setHaveChallenged(
          response.data.hasChallenged[0]
            ? response.data.hasChallenged[0]
            : null,
        );
        setAmChallenged(
          response.data.isChallenged[0] ? response.data.isChallenged[0] : null,
        );
        if (response.data.isChallenged[0]) {
          // console.log(response.data.hasChallenged[0]);
          let time = new Date(response.data.isChallenged[0].date);
          setTime(time);
          setDate(time);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getGame = async () => {
    try {
      const response = await API.post(
        '/game/get-game',
        {player: user._id},
        {headers: {'auth-token': await deviceStorage.loadJWT()}},
      );
      if (response.status === 200) {
        setAcceptedChallenges(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const challengePlayer = async () => {
    let challengeDate = new Date();
    challengeDate.setDate(date.getDate());
    challengeDate.setHours(time.getHours());
    challengeDate.setMinutes(time.getMinutes());

    try {
      const response = await API.post(
        '/challenge/new',
        {player: user._id, date: challengeDate},
        {
          headers: {'auth-token': await deviceStorage.loadJWT()},
        },
      );

      if (response.status === 200) {
        setHaveChallenged(true);
        showMessage({
          message: 'Giocatore sfidato',
          type: 'success',
        });
      }
    } catch (error) {
      if (error.response.status === 500) {
        console.log(error.response.data);
      }
    }
  };

  const cancelChallenge = async () => {
    try {
      const response = await API.post(
        '/challenge/cancel-challenge',
        {player: user._id},
        {headers: {'auth-token': await deviceStorage.loadJWT()}},
      );
      if (response.status === 200) {
        setHaveChallenged(false);
        showMessage({
          message: 'Sfida cancellata con successo.',
          type: 'success',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const refuseChallenge = async () => {
    try {
      const response = await API.post(
        '/challenge/refuse-challenge',
        {player: user._id},
        {headers: {'auth-token': await deviceStorage.loadJWT()}},
      );
      if (response.status === 200) {
        setAmChallenged(false);
        showMessage({
          message: 'Sfida rifiutata con successo',
          type: 'success',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const acceptChallenge = async () => {
    try {
      const response = await API.post(
        '/game/create-game',
        {challenge: amChallenged, challenger: user},
        {headers: {'auth-token': await deviceStorage.loadJWT()}},
      );
      if (response.status === 200) {
        showMessage({
          message: 'Sfida accettata!',
          type: 'success',
        });
        setAcceptedChallenges(response.data);
        setAmChallenged(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const leaveTeam = async () => {
    try {
      const response = await API.post(
        '/team/leave-team',
        {member: user._id},
        {
          headers: {'auth-token': await deviceStorage.loadJWT()},
        },
      );
      if (response.status === 200) {
        you.team = null;
        setYou(you);
        showMessage({message: 'Squadra sinistra.'});
        navigation.navigate('Ricerca');
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

  const sendTeamRequest = async () => {
    try {
      const response = await API.post(
        '/notification/new',
        {playerId: user._id},
        {headers: {'auth-token': await deviceStorage.loadJWT()}},
      );
      if (response.status === 200) {
        console.log(response.data);
        showMessage({message: 'Sfida inviata correttamente.', type: 'success'});
      }
    } catch (error) {
      if (error.response.status === 401) {
        showMessage({
          message: 'Richiesta già inviata! Stai attento..',
          type: 'info',
        });
      }
    }
  };

  const renderTeamButton = () => {
    if (!user.team && !you.team) {
      return (
        <ButtonLarge
          title="Crea team con lui"
          color={orangeBtn}
          extraStyles={globalStyles.m10}
          onSubmit={sendTeamRequest}
        />
      );
    } else if (!user.team && you.team) {
      return (
        <ButtonLarge
          title="Crea team con lui"
          color={black}
          extraStyles={globalStyles.m10}
          onSubmit={() =>
            showMessage({
              message: 'Sei già in una squadra, non puoi esagerare.',
            })
          }
        />
      );
    } else if (user.team && you.team) {
      if (user.team._id == you.team._id) {
        return (
          <ButtonLarge
            title="Abbandona il team"
            color={black}
            extraStyles={globalStyles.m10}
            onSubmit={leaveTeam}
          />
        );
      }
    } else if (!you.team && user.team) {
      return null;
    }
  };

  useEffect(() => {
    getChallenges();
    getGame();
  }, []);

  return (
    <View style={styles.wrapper}>
      <Backdrop />
      <View style={styles.wrapper1}>
        <Image
          style={{
            width: 120,
            height: 120,
            borderRadius: 120 / 2,
            borderColor: 'black',
            borderWidth: 1.5,
            position: 'relative',
          }}
          resizeMode="cover"
          source={
            user.avatar
              ? {uri: `${ENDPOINT}/images/${user.avatar}`}
              : require('../assets/images/authLogo2.png')
          }
        />
        <Text style={globalStyles.m10}>Giocatore</Text>
      </View>
      <View style={styles.wrapper2}>
        <Text style={styles.header}>{user.username}</Text>
        <Fields
          textLeft="Inizio"
          textRight={
            time ? `${time.getHours()}:${time.getMinutes()}` : 'Da stabilire'
          }
          extraStyles={{borderBottomWidth: 2, borderBottomColor: borderColor}}
        />
        <Fields
          textLeft="Tavolo"
          textRight={user.table}
          extraStyles={{borderBottomWidth: 2, borderBottomColor: borderColor}}
        />
        <Fields
          textLeft="Data"
          textRight={
            date
              ? `${date.getDate()} - ${
                  date.getMonth() + 1
                } - ${date.getFullYear()}`
              : 'Da stabilire'
          }
          extraStyles={{borderBottomWidth: 2, borderBottomColor: borderColor}}
        />
      </View>
      <View style={styles.wrapper3}>
        <ButtonLarge
          title="Chat"
          color={orangeBtn}
          extraStyles={globalStyles.m10}
          onSubmit={() => navigation.navigate('Chat', {recipient: user})}
        />

        {acceptedChallenges ? (
          <ButtonLarge
            title="Visualizza la programmazione"
            color={orangeBtn}
            extraStyles={globalStyles.m10}
            onSubmit={() => navigation.navigate('Games')}
          />
        ) : !haveChallenged && !amChallenged ? (
          <View style={{width: '100%', alignItems: 'center'}}>
            <ButtonLarge
              title="Sfida!"
              color={orangeBtn}
              extraStyles={globalStyles.m10}
              onSubmit={() => setShow(true)}
            />
            {date && time ? (
              <ButtonLarge
                disabled={date && time ? false : true}
                title="Invia sfida"
                color={orangeBtn}
                extraStyles={globalStyles.m10}
                onSubmit={challengePlayer}
              />
            ) : null}
          </View>
        ) : !amChallenged ? (
          <ButtonLarge
            title="Annulla sfida"
            color={black}
            extraStyles={globalStyles.m10}
            onSubmit={cancelChallenge}
          />
        ) : null}

        {amChallenged ? (
          <View style={{width: '100%', alignItems: 'center'}}>
            <ButtonLarge
              title="Accetta la sfida"
              color={orangeBtn}
              extraStyles={globalStyles.m10}
              onSubmit={acceptChallenge}
            />
            <ButtonLarge
              title="Rifiuta sfida"
              color={black}
              extraStyles={globalStyles.m10}
              onSubmit={refuseChallenge}
            />
          </View>
        ) : null}

        {renderTeamButton()}

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

        {/* {ChallengeModal()} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: white,
  },
  wrapper1: {
    flex: 0.2,
    paddingVertical: 20,
    alignItems: 'center',
  },
  wrapper2: {
    flex: 0.3,
    width: '90%',
    paddingVertical: 20,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  wrapper3: {
    flex: 0.5,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  avatar: {
    width: 170,
    height: 170,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  challengeModal: {
    width: '80%',
    height: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 20,

    marginTop: 80,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.9,
    shadowRadius: 1,
    elevation: 15,

    backgroundColor: white,
  },
  dateWrapper: {
    alignItems: 'center',
  },
  dateHeader: {
    fontSize: 25,
    marginVertical: 20,
  },
  date: {
    fontSize: 20,
    marginVertical: 20,
  },
  btnWrapper: {
    width: '70%',
    alignItems: 'center',
  },
});
