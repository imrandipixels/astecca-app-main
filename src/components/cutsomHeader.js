import React, {useContext, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {black, white} from '../assets/styles/theme';

import {UserContext} from '../providers/UserProvider';

import {GoogleSignin, is} from '@react-native-community/google-signin';

import deviceStorage from '../utils/deviceStorage';
import API, {ENDPOINT} from '../utils/API';

GoogleSignin.configure();

export default (props) => {
  const [user, setUser] = useContext(UserContext);
  const {title, goBack, navigation, isChat, avatar} = props;

  const [loading, setLoading] = useState(false);

  const onLogout = async () => {
    setLoading(true);
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
      const response = await API.get('/user/reset-fmcToken', {
        params: {
          userId: user._id,
        },
      });
      if (response.status === 200) {
        deviceStorage.deleteJWT();
        deviceStorage.deleteUser();
        navigation.goBack();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  if (title === 'A Stecca' || title === 'Registrati') {
    return (
      <View style={[styles.wrapper]}>
        <View style={{flex: 1}}></View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>{title}</Text>
        </View>
        <TouchableOpacity
          style={{flex: 1, alignItems: 'flex-end'}}
          onPress={async () =>
            await Linking.openURL('https://www.astecca.it/')
          }>
          <Icon name="home" size={24} color={black} />
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={styles.wrapper}>
        {title === 'Ricerca' ||
        title === 'Classifica' ||
        title === 'Chat' ||
        title === 'Profilo' ? (
          !loading ? (
            <TouchableOpacity onPress={onLogout} style={{flex: 1}}>
              <Icon name="logout" size={24} color={black} />
            </TouchableOpacity>
          ) : (
            <ActivityIndicator color={black} />
          )
        ) : (
          <TouchableOpacity onPress={goBack}>
            <Icon name="arrow-back" size={24} color={black} />
          </TouchableOpacity>
        )}
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            flexDirection: isChat ? 'row' : 'column',
          }}>
          {isChat ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Request', {user: props.recipient})
              }
              style={{
                width: 28,
                height: 28,
                borderRadius: 28 / 2,

                marginHorizontal: 20,
              }}>
              <Image
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 28 / 2,
                  borderWidth: 1,
                  borderColor: 'black',
                }}
                resizeMode="cover"
                source={{uri: `${ENDPOINT}/images/${avatar}`}}
              />
            </TouchableOpacity>
          ) : null}
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>{title}</Text>
        </View>

        {title === 'Ricerca' ? (
          <TouchableOpacity
            style={{alignItems: 'flex-end', flex: 1}}
            onPress={async () =>
              await Linking.openURL('https://www.astecca.it/')
            }>
            <Icon name="home" size={24} color={black} />
          </TouchableOpacity>
        ) : (
          <View style={{flex: 1}}>
            {isChat ? (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Request', {user: props.recipient})
                }
                style={{alignSelf: 'flex-end'}}>
                <Icon name="info-outline" size={28} color={black} />
              </TouchableOpacity>
            ) : null}
          </View>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 55,

    paddingHorizontal: 20,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: white,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 5,
  },
});
