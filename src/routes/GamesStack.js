import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {black, orangeIcon, white} from '../assets/styles/theme';

import PlayedGames from '../screens/PlayedGamesScreen';
import ScheduledGames from '../screens/ScheduledGamesScreen';

const Tab = createBottomTabNavigator();

export default () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Scheduled') {
            iconName = 'search';
          } else if (route.name == 'Played') {
            iconName = 'trophy';
          }
          return <Ionicons name={iconName} size={20} color={color} />;
        },
      })}
      tabBarOptions={{
        labelPosition: 'below-icon',
        activeTintColor: orangeIcon,
        inactiveTintColor: white,
        activeBackgroundColor: black,
        inactiveBackgroundColor: black,
      }}>
      <Tab.Screen
        options={{title: 'Giocate'}}
        name="Played"
        component={PlayedGames}
      />
      <Tab.Screen
        options={{title: 'Programmate'}}
        name="Scheduled"
        component={ScheduledGames}
      />
    </Tab.Navigator>
  );
};
