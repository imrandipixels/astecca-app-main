import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';

// Theme Related
import {orangeBtn, orangeIcon, white} from '../assets/styles/theme';
import globalStyles from '../assets/styles/globalStyles';

// Utilities
import {getToken} from '../utils/FCMService';
import {registerSchema} from '../utils/validate';
import API from '../utils/API';

import AuthImage from '../components/authImage';
import Backdrop from '../components/backdrop';
import {ButtonLarge} from '../components/button';
import Input from '../components/inputFields';
import CustomPicker from '../components/customPicker';

export default ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [fmcToken, setFmcToken] = useState(null);

  const genders = [
    {label: 'Uomo', value: 'male'},
    {label: 'Donna', value: 'female'},
  ];

  const availablities = [
    {label: 'A disposizione', value: 'A disposizione'},
    {label: 'Non disponibile', value: 'Non disponibile'},
  ];

  useEffect(() => {
    setFmcToken(getToken());
  }, []);

  const onRegister = async () => {
    try {
      const valid = await registerSchema.validate({
        username: username.trim(),
        email,
        password,
        gender,
        confirmPassword,
      });
      try {
        const response = await API.post('/user/check-user', {
          email: valid.email,
          username: valid.username,
        });
        if (response.status == 200) {
          navigation.navigate('TableScreen', {
            username,
            email,
            password,
            gender,
            fmcToken: fmcToken._W,
          });
        }
      } catch (err) {
        showMessage({
          message: 'Per favore riprova',
          description: err.response.data,
          type: 'danger',
        });
      }
    } catch (err) {
      showMessage({
        message: 'Perfavore, smettila di fare errori.',
        description: err.message,
        type: 'danger',
      });
    }
  };

  return (
    <View style={styles.wrapper}>
      <Backdrop />
      <View style={styles.wrapper1}>
        <AuthImage />
      </View>
      <View style={styles.wrapper2}>
        <ScrollView contentContainerStyle={styles.scroller}>
          <Input
            value={username}
            onChange={(value) => setUsername(value)}
            holderText="Nome utente"
            firstIconName="user"
            extraStyles={globalStyles.m10}
          />
          <CustomPicker
            initLabel="Sesso"
            onChange={(v, i) => setGender(v)}
            extraStyles={globalStyles.m10}
            items={genders}
            selected={gender}
            iconLeft={true}
            iconLeftName="users"
            iconLeftColor={orangeIcon}
            iconSize={22}
          />
          <Input
            value={email}
            onChange={(value) => setEmail(value)}
            holderText="E-mail"
            firstIconName="envelope"
            extraStyles={globalStyles.m10}
          />
          <Input
            value={password}
            onChange={(value) => setPassword(value)}
            password={true}
            holderText="Password"
            firstIconName="lock"
            extraStyles={globalStyles.m10}
          />
          <Input
            value={confirmPassword}
            onChange={(value) => setConfirmPassword(value)}
            password={true}
            holderText="Conferma password"
            firstIconName="lock"
            extraStyles={globalStyles.m10}
          />
        </ScrollView>
        <ButtonLarge
          onSubmit={onRegister}
          extraStyles={{marginTop: 10}}
          title="Registrati"
          color="black"
        />
      </View>

      <View style={styles.wrapper3}>
        {/* <Text>Oppure Accedi Con</Text>
        <SocialIcons extraStyles={globalStyles.m25} /> */}
        <View style={{flexDirection: 'row'}}>
          <Text>Hai gia un account?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Text style={{color: orangeBtn, fontWeight: 'bold'}}> Accedi</Text>
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
    flex: 4,
  },
  wrapper2: {
    flex: 5,
    width: '85%',
  },
  wrapper3: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  subText: {
    color: orangeIcon,
    alignSelf: 'flex-end',
  },
});
