import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import deviceStorage from '../utils/deviceStorage';
import {showMessage} from 'react-native-flash-message';
import API from '../utils/API';

const getPublicProfile = async () => {
  const infoRequest = new GraphRequest(
    '/me?fields=email,name,id',
    null,
    (error, result) => {
      if (error) {
        console.log('Error fetching data: ' + error.toString());
      } else {
        console.log(result);
      }
    },
  );

  new GraphRequestManager().addRequest(infoRequest).start();
};

export const onFaceBookLogin = async (error, result) => {
  if (error) {
    showMessage({message: error, type: 'danger'});
  } else {
    try {
      const data = await AccessToken.getCurrentAccessToken();
      // const response = await API.get('https://graph.facebook.com/v2.5/me', {params: {fields: {}}})
      console.log(data.accessToken);
      getPublicProfile();
    } catch (error) {
      console.log(error);
    }
  }
};

export const onFaceBookLogout = () => {
  console.log('Logout');
};
