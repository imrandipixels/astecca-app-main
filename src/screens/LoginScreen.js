import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import {showMessage} from 'react-native-flash-message';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

import {getToken} from '../utils/FCMService';
import {SocketContext} from '../providers/SocketProvider';
import {UserContext} from '../providers/UserProvider';

import SocketController from '../utils/Socket.controller';
import API, {SOCKET_ENDPOINT} from '../utils/API';
import {loginSchema} from '../utils/validate';
import deviceStorage from '../utils/deviceStorage';

import {black, orangeBtn, orangeIcon, white} from '../assets/styles/theme';
import globalStyles from '../assets/styles/globalStyles';
import AuthImage from '../components/authImage';
import Backdrop from '../components/backdrop';
import {ButtonLarge} from '../components/button';
import Input from '../components/inputFields';

let socketInstance;
GoogleSignin.configure({
  webClientId:
    '803404283958-q1ql003gkhiqg6st030d2kvi7h58hvn6.apps.googleusercontent.com',
  offlineAccess: true,
});

export default ({navigation}) => {
  const [socket, setSocket] = useContext(SocketContext);
  const [user, setUser] = useContext(UserContext);

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    checkGoogleLoggedIn();
    checkUserLoggedIn();
  }, []);

  const initBackgroundTask = (data) => {
    // Initiate socket
    socketInstance = SocketController.connect(SOCKET_ENDPOINT);
    SocketController.subscribe(socketInstance, {
      userId: data._id,
    });

    // Set socket and user context
    setSocket(socketInstance);
    setUser(data);

    // Navigate to home
    navigation.navigate('Ricerca', data);

    // messaging().onNotificationOpenedApp(async () => console.log('hey'));
  };

  const onLogin = async () => {
    const token = await getToken();
    setLoading(true);
    try {
      const value = await loginSchema.validate({email, password});
      try {
        const response = await API.post('/user/login', {value, token});
        if (response.status === 200) {
          // Save returned jwt token to async storage
          deviceStorage.saveItem('@id_token', response.headers['auth-token']);
          // Initiate socket
          socketInstance = SocketController.connect(SOCKET_ENDPOINT);
          SocketController.subscribe(socketInstance, {
            userId: response.data._id,
          });

          // Set socket and user context
          setSocket(socketInstance);
          setUser(response.data);

          // Save user in storage
          deviceStorage.saveItem('@user', JSON.stringify({email, password}));
          setLoading(false);
          navigation.navigate('Ricerca', response.data);
        }
      } catch (err) {
        showMessage({
          message: err.response.data ? err.response.data : err.message,
          type: 'danger',
        });
        setLoading(false);
      }
    } catch (err) {
      if (err.name == 'TypeError') {
        setLoading(false);
        showMessage({message: 'qualcosa è andato storto', type: 'danger'});
      } else {
        setLoading(false);
        showMessage({message: err.message, type: 'danger'});
      }
    }
  };

  const checkUserLoggedIn = async () => {
    let user = await deviceStorage.loadUser();
    if (user) {
      setLoading(true);
      user = JSON.parse(user);
      const token = await getToken();
      try {
        const response = await API.post('/user/login', {
          value: {email: user.email, password: user.password},
          token,
        });
        if (response.status === 200) {
          deviceStorage.saveItem('@id_token', response.headers['auth-token']);
          setLoading(false);
          initBackgroundTask(response.data);
        }
      } catch (error) {
        setLoading(false);
        showMessage({message: error.response.data, type: 'danger'});
      }
    }
  };

  const onGoogleLogin = async () => {
    const token = await getToken();
    try {
      await GoogleSignin.hasPlayServices();
      const info = await GoogleSignin.signIn();
      const {id, name, email} = info.user;
      let response = await API.post('/user/google-login', {
        user: {id, email, name: name.replace(/\s+/g, '')},
        deviceToken: token,
      });
      if (response.status === 200) {
        showMessage({message: 'Accesso riuscito.', type: 'success'});
        deviceStorage.saveItem('@id_token', response.headers['auth-token']);
        initBackgroundTask(response.data);
      }
    } catch (error) {
      if (error.response) {
        showMessage({message: error.response.data, type: 'danger'});
      }
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // showMessage({
        //   message: error.toString(),
        //   autoHide: false,
        //   position: 'bottom',
        // });
      } else if (error.code === statusCodes.IN_PROGRESS) {
        showMessage({
          message: "Attendi l'accesso in corso.",
          type: 'info',
        });
      } else {
      }
    }
  };

  const checkGoogleLoggedIn = async () => {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        onGoogleLogin();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onPasswordReset = async () => {
    if (email === '') {
      showMessage({
        message: 'Si prega di fornire un indirizzo email valido',
        type: 'info',
      });
      return;
    }
    try {
      const response = await API.get('/user/request-reset', {
        params: {email: email},
      });
      if (response.status === 200) {
        showMessage({
          message: 'Ottimo',
          description:
            "Abbiamo inviato un'email nella quale potrai resettare la password! Non perderla più.",
          type: 'success',
        });
      }
    } catch (error) {
      showMessage({
        message: 'Invalid email address',
        description: error.response.data,
        type: 'danger',
      });
    }
  };

  return (
    <View style={styles.wrapper}>
      <Backdrop />
      <View style={[styles.wrapper1]}>
        <AuthImage />
      </View>

      <View style={styles.wrapper2}>
        <Input
          holderText="Inserisci l'email"
          firstIconName="user"
          extraStyles={globalStyles.m10}
          value={email}
          onChange={(value) => setEmail(value)}
        />
        <Input
          holderText="********"
          firstIconName="lock"
          extraStyles={globalStyles.m10}
          value={password}
          onChange={(value) => setPassword(value)}
          password={true}
        />
        <TouchableOpacity onPress={onPasswordReset}>
          <Text style={[styles.subText, globalStyles.m10]}>
            Hai dimenticato la password?
          </Text>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator color={black} size="large" />
        ) : (
          <ButtonLarge onSubmit={onLogin} title="ACCEDI" color="black" />
        )}
      </View>

      <View style={styles.wrapper3}>
        <Text>Oppure Accedi Con</Text>

        <View style={[{alignItems: 'center'}, globalStyles.m10]}>
          {/* <LoginButton
            permissions={['email']}
            onLoginFinished={onFaceBookLogin}
            onLogoutFinished={onFaceBookLogout}
          /> */}
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Standard}
            color={GoogleSigninButton.Color.Dark}
            // style={{width: 250, height: 50}}
            onPress={onGoogleLogin}
          />
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text>Non hai un account? </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Register');
            }}>
            <Text style={{color: orangeBtn, fontWeight: 'bold'}}>
              ISCRIVITI
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: white,
  },
  wrapper1: {
    flex: 0.3,
  },
  wrapper2: {
    flex: 0.4,
    width: '95%',
  },
  wrapper3: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  subText: {
    color: orangeIcon,
    alignSelf: 'flex-end',
  },
});
