import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {showMessage} from 'react-native-flash-message';
import {GoogleSignin} from '@react-native-community/google-signin';
import API from './API';
import deviceStorage from './deviceStorage';

GoogleSignin.configure();

export default async (navigation) => {
  messaging().onNotificationOpenedApp(async (message) => {
    switch (message.data.type) {
      case 'game-update':
        let game = JSON.parse(message.data.game);
        navigation.navigate('Game Update', {
          game: game,
          gameType: 'Single',
        });
        break;

      case 'account-status':
        try {
          const isSignedIn = await GoogleSignin.isSignedIn();
          if (isSignedIn) {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
          }
          const response = await API.get('/user/reset-fmcToken', {
            params: {
              userId: message.data.userId,
            },
          });
          if (response.status === 200) {
            deviceStorage.deleteJWT();
            deviceStorage.deleteUser();
            navigation.navigate('A Stecca');
          }
        } catch (error) {
          console.log(error);
        }
        break;

      case 'team-game-update':
        let teamgame = JSON.parse(message.data.game);
        navigation.navigate('Game Update', {game: teamgame, gameType: 'Team'});
        break;

      // case 'account-status':
      //   console.log(message);
      // try {
      //   const isSignedIn = await GoogleSignin.isSignedIn();
      //   if (isSignedIn) {
      //     await GoogleSignin.revokeAccess();
      //     await GoogleSignin.signOut();
      //   }
      //   const response = await API.get('/user/reset-fmcToken', {
      //     params: {
      //       userId: user._id,
      //     },
      //   });
      //   if (response.status === 200) {
      //     deviceStorage.deleteJWT();
      //     deviceStorage.deleteUser();
      //     navigation.navigate('A Stecca');
      //   }
      // } catch (error) {
      //   console.log(error);
      // }
      // break;

      case 'game-challenge':
        showMessage({message: 'Nuova sfida di gioco', type: 'info'});
        break;
      case 'chat':
        showMessage({message: 'Nuovo messaggio ricevuto', type: 'info'});
        break;
      case 'challenge-accepted':
        showMessage({message: 'la tua sfida è stata accettata', type: 'info'});
        break;
    }
  });

  const notificationOpen = await messaging().getInitialNotification();
  if (notificationOpen) {
    switch (notificationOpen.data.type) {
      case 'game-update':
        let game = JSON.parse(notificationOpen.data.game);
        navigation.navigate('Game Update', {
          game: game,
          gameType: 'Single',
        });
        break;

      case 'team-game-update':
        let teamgame = JSON.parse(notificationOpen.data.game);
        navigation.navigate('Game Update', {game: teamgame, gameType: 'Team'});
        break;
      case 'game-challenge':
        showMessage({message: 'Nuova sfida di gioco', type: 'info'});
        break;
      case 'chat':
        showMessage({message: 'Nuovo messaggio ricevuto', type: 'info'});
        break;
      case 'challenge-accepted':
        showMessage({message: 'la tua sfida è stata accettata', type: 'info'});
        break;
    }
  }
};
