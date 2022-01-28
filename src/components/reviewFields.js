import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default (props) => {
  const {textLeft, textRight, iconName, iconColor, extraStyles, icon} = props;

  const displayIcons = (iconNumber, color, name) => {
    let i;
    let icons = [];
    for (i = 1; i <= iconNumber; i++) {
      icons.push(<Icon name={name} color={color} size={18} key={i} />);
    }
    return icons;
  };

  return (
    <View style={[styles.wrapper, extraStyles]}>
      <View style={styles.wrapper1}>
        <Text style={styles.textLeft}>{textLeft}</Text>
      </View>
      <View style={styles.wrapper2}>
        {icon ? displayIcons(icon, iconColor, iconName) : null}
      </View>
      <View style={styles.wrapper3}>
        <Text style={styles.textRight}>{textRight}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    width: '100%',
    flex: 0.15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapper1: {
    // flex: 33.333,
    flexGrow: 1,
    alignItems: 'flex-start',
  },
  wrapper2: {
    // flex: 33.333,
    // position: 'absolute',
    // left: '50%',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  wrapper3: {
    // flex: 33.333,
    alignItems: 'flex-end',
  },
  textLeft: {
    fontSize: 16,
  },
  textRight: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
