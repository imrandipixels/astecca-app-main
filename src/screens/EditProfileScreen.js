import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

// 3rd party imports
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import Icon from 'react-native-vector-icons/Ionicons';
import {showMessage} from 'react-native-flash-message';

// Utilities
import API, {ENDPOINT} from '../utils/API';
import deviceStorage from '../utils/deviceStorage';

// Custom components
import Backdrop from '../components/backdrop';
import Input from '../components/inputFields';
import CustomPicker from '../components/customPicker';
import {ButtonLarge} from '../components/button';

// Context
import {UserContext} from '../providers/UserProvider';
import {black, orangeIcon, white} from '../assets/styles/theme';
import globalStyles from '../assets/styles/globalStyles';

const genders = [
  {label: 'Uomo', value: 'male'},
  {label: 'Donna', value: 'female'},
];

const availablities = [
  {label: 'Sono disponibile', value: 'Sono disponibile'},
  {
    label: 'Attualmente non sono disponibile',
    value: 'Attualmente non sono disponibile',
  },
];

const tables = [
  {label: 'Buche Larghe', value: 'Buche Larghe'},
  {label: 'Buche Strette', value: 'Buche Strette'},
];

export default () => {
  const [user, setUser] = useContext(UserContext);

  const [fileUri, setFileUri] = useState();

  const [loading, setLoading] = useState(false);

  const [motto, setMotto] = useState('');
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('');
  const [table, setTable] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user.avatar) {
      setFileUri(`${ENDPOINT}/images/${user.avatar}`);
    }
    setMotto(user.motto);
    setGender(user.gender);
    setStatus(user.status);
    setTable(user.table);
  }, []);

  const selectAvatar = () => {
    const options = {
      takePhotoButtonTitle: 'Fai un selfie',
      chooseFromLibraryButtonTitle: 'Seleziona dalla galleria',
      title: "Seleziona l'immagine profilo",
      cameraType: 'front',
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        return;
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        return;
      } else if (response.customButton) {
        return;
      }
      let imageType = response.type;
      ImageResizer.createResizedImage(response.uri, 160, 160, 'JPEG', 90, 0)
        .then(async (response) => {
          setFileUri(response.uri);
          try {
            const data = new FormData();
            data.append('_id', user._id);
            data.append('name', 'avatar');
            data.append('fileData', {
              uri: response.uri,
              type: imageType,
              name: response.name,
            });
            const apiResponse = await API.post('/user/upload-avatar', data, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
              },
            });
            if (apiResponse.status === 200) {
              const updatedUser = user;
              updatedUser.avatar = response.data;
              setUser(updatedUser);
            }
          } catch (error) {
            console.log(error);
          }
        })
        .catch((error) => showMessage({message: 'qualcosa è andato storto'}));
    });
  };

  const onUpdate = async () => {
    setLoading(true);
    const updatedUser = {...user};
    updatedUser.gender = gender;
    updatedUser.motto = motto;
    updatedUser.table = table;
    updatedUser.status = status;

    try {
      const response = await API.post(
        '/user/update',
        {
          user: updatedUser,
          password,
          confirmPassword,
        },
        {
          headers: {'auth-token': await deviceStorage.loadJWT()},
        },
      );
      if (response.status === 200) {
        setLoading(false);
        showMessage({
          message: 'profilo aggiornato con successo!',
          type: 'success',
        });
        setUser(updatedUser);
      }
    } catch (error) {
      setLoading(false);
      showMessage({
        message: 'qualcosa è andato storto. Per favore riprova.',
        type: 'danger',
      });
    }
  };

  return (
    <View style={styles.wrapper}>
      <Backdrop />
      <View style={styles.wrapper1}>
        <TouchableOpacity onPress={selectAvatar} style={styles.avatarWrapper}>
          <Image
            resizeMode="contain"
            style={styles.avatar}
            source={
              fileUri
                ? {uri: fileUri}
                : require('../assets/images/authLogo2.png')
            }
          />
          <View style={styles.avatarIconWrapper}>
            <Icon name="camera" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.wrapper2}>
        <ScrollView>
          <Input
            value={password}
            onChange={(value) => setPassword(value)}
            holderText="Password"
            firstIconName="lock"
            password={true}
            extraStyles={globalStyles.m10}
          />
          <Input
            value={confirmPassword}
            onChange={(value) => setConfirmPassword(value)}
            holderText="Conferma password"
            firstIconName="lock"
            password={true}
            extraStyles={globalStyles.m10}
          />
          <Input
            value={motto}
            onChange={(value) => setMotto(value)}
            holderText="motto"
            firstIconName="lightbulb-o"
            extraStyles={globalStyles.m10}
          />
          <CustomPicker
            initLabel="genere"
            onChange={(v, i) => setGender(v)}
            items={genders}
            selected={gender}
            iconLeft={true}
            iconLeftName="users"
            iconLeftColor={orangeIcon}
            iconSize={22}
            extraStyles={globalStyles.m10}
          />
          <CustomPicker
            initLabel="Disponibilità"
            onChange={(v, i) => setStatus(v)}
            items={availablities}
            selected={status}
            iconLeft={true}
            iconLeftName="calendar-times-o"
            iconLeftColor={orangeIcon}
            iconSize={22}
            extraStyles={globalStyles.m10}
          />
          <CustomPicker
            initLabel="table"
            onChange={(v, i) => setTable(v)}
            items={tables}
            selected={table}
            iconLeft={true}
            iconLeftName="gamepad"
            iconLeftColor={orangeIcon}
            iconSize={22}
            extraStyles={globalStyles.m10}
          />
        </ScrollView>
      </View>

      <View style={styles.wrapper3}>
        {loading ? (
          <ActivityIndicator
            style={{marginTop: 20}}
            color={black}
            size="large"
          />
        ) : (
          <ButtonLarge
            onSubmit={onUpdate}
            extraStyles={{marginTop: 10}}
            title="Aggiorna"
            color="black"
          />
        )}
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
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper2: {
    flex: 0.5,
    width: '90%',
    alignSelf: 'center',
  },
  wrapper3: {
    flex: 0.2,
    alignSelf: 'center',
    width: '90%',
  },
  avatarWrapper: {
    position: 'relative',
    width: 160,
    height: 160,
    borderWidth: 1.5,
    borderRadius: 160 / 2,
    borderColor: 'black',
    // overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIconWrapper: {
    position: 'absolute',
    right: -5,
    top: -5,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 160 / 2,
  },
});
