import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

export default () => {
  return (
    <View>
      <Image
        style={{width: 220, height: 220}}
        source={require('../assets/images/authLogo2.png')}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({});
