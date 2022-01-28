import messaging from '@react-native-firebase/messaging';

export const requestFCMPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
};

export const getToken = async () => {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      return fcmToken;
    } else {
      console.log('Failed', 'No token received');
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
