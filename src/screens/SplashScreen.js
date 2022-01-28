import React, {useEffect, useCallback} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

export default ({navigation}) => {
  // useEffect(() => {
  //     setTimeout(() => {
  //         navigation.navigate('Auth');
  //     }, 2000);
  // })

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        navigation.navigate('A Stecca');
      }, 4500);
    }, []),
  );

  return (
    <View style={styles.backdrop}>
      <Image
        style={{width: '100%', height: '100%'}}
        resizeMode="contain"
        source={require('../assets/images/splash.gif')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});
