import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {borderColor, orangeIcon} from '../assets/styles/theme';
import globalStyles from '../assets/styles/globalStyles';

export default (props) => {
  const {
    holderText,
    value,
    onChange,
    password,
    firstIconName,
    iconColor,
    secondIcon,
    secondIconName,
    extraStyles,
  } = props;
  return (
    <View style={[styles.wrapper, extraStyles]}>
      <Icon
        style={[globalStyles.ph10]}
        name={firstIconName}
        size={22}
        color={orangeIcon}
      />
      <TextInput
        value={value}
        secureTextEntry={password}
        onChangeText={onChange}
        style={styles.field}
        placeholder={holderText}
      />
      {/* {secondIcon ? (<Icon name={secondIconName} size={22} color={iconColor} />) : null} */}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
  },
  field: {
    marginHorizontal: 5,
    color: borderColor,
    width: '80%',
  },
});
