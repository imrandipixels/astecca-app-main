import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Picker} from '@react-native-community/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {borderColor} from '../assets/styles/theme';
import globalStyles from '../assets/styles/globalStyles';

export default (props) => {
  const {
    items,
    selected,
    onChange,
    initLabel,
    iconLeft,
    iconLeftName,
    iconLeftColor,
    iconRight,
    iconRightName,
    iconRightColor,
    iconSize,
    extraStyles,
  } = props;

  return (
    <View style={[styles.wrapper, extraStyles]}>
      {iconLeft && (
        <Icon
          style={[globalStyles.ph5]}
          name={iconLeftName}
          color={iconLeftColor}
          size={iconSize}
        />
      )}
      <Picker
        style={styles.picker}
        selectedValue={selected}
        onValueChange={onChange}>
        <Picker.Item label={initLabel} value="" />
        {items.map((v, i) => (
          <Picker.Item label={v.label} value={v.value} key={i} />
        ))}
      </Picker>
      {iconRight && (
        <Icon name={iconRightName} color={iconRightColor} size={iconSize} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: borderColor,
  },
  picker: {
    color: borderColor,
    width: '85%',
    marginHorizontal: 5,
  },
});
