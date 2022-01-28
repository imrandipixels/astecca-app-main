import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TableScreen from '../screens/ChooseTable';
import TimeScreen from '../screens/FreeTimeScreen';

const AuthStack = createStackNavigator();

export default () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="A Stecca" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="TableScreen" component={TableScreen} />
      <AuthStack.Screen name="TimeScreen" component={TimeScreen} />
    </AuthStack.Navigator>
  );
};
