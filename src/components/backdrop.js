import React from 'react'
import { Image, ImageBackground } from 'react-native';
import globalStyles from '../assets/styles/globalStyles';

export default () => {
    return(
        <Image style={globalStyles.backdropImg} resizeMode="contain" source={require('../assets/images/backdrop.png')} />
    );
}