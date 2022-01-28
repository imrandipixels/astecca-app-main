import React, {useEffect} from 'react';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeStack from './HomeStack';
import AuthStack from './AuthStack';
import GameStack from './GamesStack';
import ChatScreen from '../screens/ChatScreen';
import SplashScreen from '../screens/SplashScreen';
import CustomHeader from '../components/cutsomHeader';
import PlayerRequest from '../screens/PlayerRequest';
import PlayerList from '../screens/PlayerListScreen';
import GroupSearch from '../screens/GroupSearchScreen';
import TeamList from '../screens/TeamListScreen';
import TeamGame from '../screens/TeamGameRequest';
import EditProfile from '../screens/EditProfileScreen';
import Notification from '../screens/NotificationScreen';
import GameUpdate from '../screens/GameUpdateScreen';

function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Accesso';

  switch (routeName) {
    case 'Auth':
      return 'A Stecca';
    case 'A Stecca':
      return 'A Stecca';
    case 'Register':
      return 'Registrati';
    case 'TableScreen':
      return 'Registrati';
    case 'TimeScreen':
      return 'Registrati';
    case 'Classifica':
      return 'Classifica';
    case 'Profilo':
      return 'Profilo';
    case 'ChatList':
      return 'Chat';
  }
}

const Stack = createStackNavigator();

export default () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: ({scene, previous, navigation}) => {
            const {options} = scene.descriptor;
            const title =
              options.headerTitle !== undefined
                ? options.headerTitle
                : options.title !== undefined
                ? options.title
                : scene.route.name;
            return (
              <CustomHeader
                isChat={options.isChat}
                avatar={options.avatar}
                recipient={options.recipient}
                title={title}
                goBack={navigation.goBack}
                goHome={navigation.navigate}
                navigation={navigation}
              />
            );
          },
        }}
        initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="A Stecca"
          component={AuthStack}
          options={({route}) => ({
            headerTitle: getHeaderTitle(route),
          })}
        />
        <Stack.Screen
          options={{title: 'Partite'}}
          name="Games"
          component={GameStack}
        />
        <Stack.Screen
          name="Ricerca"
          component={HomeStack}
          options={({route}) => ({
            headerTitle: getHeaderTitle(route),
          })}
        />
        <Stack.Screen
          options={{title: 'Richieste'}}
          name="Request"
          component={PlayerRequest}
        />
        <Stack.Screen
          name="Players"
          options={{title: 'Giocatori'}}
          component={PlayerList}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({route}) => ({
            title: route.params.name,
            isChat: true,
            avatar: route.params.chatAvatar,
            recipient: route.params.recipient,
          })}
        />
        <Stack.Screen
          options={{title: 'Cerca team'}}
          name="Team Search"
          component={GroupSearch}
        />
        <Stack.Screen name="Teams" component={TeamList} />
        <Stack.Screen
          options={{title: 'Modifica il profilo'}}
          name="Edit Profile"
          component={EditProfile}
        />
        <Stack.Screen
          options={{title: 'Notifiche'}}
          name="Notifications"
          component={Notification}
        />
        <Stack.Screen
          options={{title: 'Aggiornamenti'}}
          name="Game Update"
          component={GameUpdate}
        />
        <Stack.Screen
          name="Team Game"
          options={{title: 'Sfida a coppie'}}
          component={TeamGame}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
