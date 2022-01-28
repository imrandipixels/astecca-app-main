import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

// 3rd party
import Icon from 'react-native-vector-icons/Ionicons';
import {black, borderColor, orangeIcon, white} from '../assets/styles/theme';

const NotificationType = {
  'team-request': 'Richieste di Team',
  'game-request': 'Sfide a biliardo',
  'team-game-request': 'Richieste di sfida in team',
};

export default (props) => {
  const {type, by, date, onSelect, onAccept, onCancel} = props;
  let formatedDate = new Date(date);
  let note =
    type === 'team-request'
      ? `Nuova sfida in team richiesta da `
      : type === 'team-game-request'
      ? `Nuova richiesta di gioco di squadra da parte del capitano `
      : `Nuova sfida richiesta da `;
  return (
    <TouchableOpacity onPress={onSelect} style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{NotificationType[type]}</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.wrapper1}>
          <Text style={styles.note}>
            {note}
            <Text style={[{fontWeight: 'bold'}, styles.note]}>{by}</Text>
          </Text>
          {type !== 'team-request' ? (
            <Text style={[{fontWeight: 'bold', fontSize: 18}]}>
              {`Data: ${formatedDate.getDate()}-${formatedDate.getMonth()}-${formatedDate.getFullYear()} ${formatedDate.getHours()}:${formatedDate.getMinutes()}`}
            </Text>
          ) : null}
        </View>
        <View style={styles.wrapper2}>
          <TouchableOpacity onPress={onAccept} style={styles.iconWrapper}>
            <Icon
              name="checkmark-circle-outline"
              size={32}
              color={orangeIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onCancel}>
            <Icon name="close-circle-outline" size={32} color={orangeIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // flexDirection: 'row',
    height: 135,
    marginVertical: 5,

    borderWidth: 0.4,
    borderRadius: 6,
    borderColor: borderColor,
    backgroundColor: white,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.9,
    shadowRadius: 1,
    elevation: 5,
  },
  wrapper1: {
    padding: 10,
    maxWidth: '75%',
    alignSelf: 'center',
  },
  wrapper2: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginLeft: 'auto',
    paddingRight: 10,
  },
  note: {
    fontSize: 18,
  },
  iconWrapper: {
    marginHorizontal: 10,
  },
  header: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: orangeIcon,
  },
});
