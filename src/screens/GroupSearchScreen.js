import React, {useState, useContext, useCallback, useEffect} from 'react';
import {View, Text, Image, StyleSheet, ActivityIndicator} from 'react-native';
import {black, borderColor, white} from '../assets/styles/theme';

// 3rd party
import {useFocusEffect} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';

// Context
import {UserContext} from '../providers/UserProvider';

// Custom components
import SearchBar from '../components/searchBar';

// Utilities
import deviceStorage from '../utils/deviceStorage';
import API, {ENDPOINT} from '../utils/API';

export default ({navigation}) => {
  const [user, setUser] = useContext(UserContext);
  const [search, setSearch] = useState('');
  const [userAvatar, setUserAvatar] = useState(null);

  const [member, setMember] = useState();
  const [memberAvatar, setMemberAvatar] = useState(null);

  const [loading, setLoading] = useState(false);

  const assignMember = () => {
    let member =
      user._id != user.team.members[0]._id
        ? user.team.members[0]
        : user.team.members[1];
    setMember(member);
    if (member.avatar) {
      setMemberAvatar(`${ENDPOINT}/images/${member.avatar}`);
    }
  };

  const onSearch = async () => {
    try {
      const response = await API.get('/team/get-teams', {
        params: {captain: search},
        headers: {'auth-token': await deviceStorage.loadJWT()},
      });
      if (response.status === 200) {
        if (response.data[0]) {
          navigation.navigate('Teams', {teams: response.data});
          return;
        }
        showMessage({
          message: 'Non abbiamo trovato il team avversario..',
          type: 'info',
        });
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        showMessage({message: 'Server error', type: 'danger'});
      }
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      assignMember();
    }, []),
  );

  return (
    <View style={styles.wrapper}>
      {member ? (
        <View style={styles.wrapper1}>
          <Text
            style={{
              position: 'absolute',
              top: 30,
              left: '25%',
              color: 'red',
              fontWeight: 'bold',
              fontSize: 18,
              marginBottom: 12,
            }}>
            Il tuo team è formato da:
          </Text>
          <View style={styles.avatarWrapper}>
            {user.avatar ? (
              <Image
                style={styles.avatar}
                resizeMode="contain"
                source={
                  user.avatar
                    ? {uri: `${ENDPOINT}/images/${user.avatar}`}
                    : require('../assets/images/avatar.png')
                }
              />
            ) : (
              <View style={styles.initials}>
                <Text style={{fontSize: 40, color: 'white'}}>
                  {user.username[0]}
                </Text>
              </View>
            )}

            <Text style={styles.username}>{user.username}</Text>
          </View>
          <View style={styles.avatarWrapper}>
            {memberAvatar ? (
              <Image
                style={styles.avatar}
                resizeMode="contain"
                source={
                  memberAvatar
                    ? {uri: memberAvatar}
                    : require('../assets/images/avatar.png')
                }
              />
            ) : (
              <View style={styles.initials}>
                <Text style={{fontSize: 40, color: 'white'}}>
                  {member.username[0]}
                </Text>
              </View>
            )}

            <Text style={styles.username}>{member.username}</Text>
          </View>
        </View>
      ) : (
        <ActivityIndicator size="large" color={black} />
      )}

      <View style={styles.wrapper2}>
        <Text
          style={{
            color: 'red',
            fontWeight: 'bold',
            fontSize: 18,
            alignSelf: 'center',
            marginBottom: 12,
          }}>
          Ricerca il team avversario!
        </Text>
        <SearchBar
          placeholder="Cerca team"
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
    justifyContent: 'center',
    backgroundColor: white,
  },
  wrapper1: {
    position: 'relative',
    flex: 0.4,
    flexDirection: 'row',
    justifyContent: 'space-evenly',

    alignSelf: 'center',
    width: '90%',

    borderWidth: 0.4,
    borderRadius: 6,
    borderColor: borderColor,
    backgroundColor: white,

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
    flex: 0.3,
    alignSelf: 'center',
    justifyContent: 'center',

    width: '80%',
  },
  avatarWrapper: {
    width: '40%',
    alignSelf: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 10,
  },
  username: {
    alignSelf: 'center',
    fontSize: 16,
  },
  initials: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 20,
    borderColor: borderColor,
    backgroundColor: 'black',
  },
});
