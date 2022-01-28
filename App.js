import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {StatusBar, View} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import {SocketProvider} from './src/providers/SocketProvider';
import {UserProvider} from './src/providers/UserProvider';
import AppNavigator from './src/routes/navigator';
import GlobalFont from 'react-native-global-font';
import {requestFCMPermission} from './src/utils/FCMService';

const App = () => {
  useEffect(() => {
    requestFCMPermission();
    let fontName = 'Roboto-Regular';
    GlobalFont.applyGlobal(fontName);
  }, []);

  return (
    <SocketProvider>
      <UserProvider>
        <View style={{flex: 1}}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <AppNavigator />
          <FlashMessage position="top" />
        </View>
      </UserProvider>
    </SocketProvider>
  );
};

export default App;
