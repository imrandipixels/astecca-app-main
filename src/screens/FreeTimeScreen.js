import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {showMessage} from 'react-native-flash-message';

import {white} from '../assets/styles/theme';

import Backdrop from '../components/backdrop';
import {ButtonLarge} from '../components/button';
import TimeCards from '../components/timeCards';

// Utilities
import API from '../utils/API';

export default ({route, navigation}) => {
  const [timeList, setTimeList] = useState([
    {value: 'Sempre', selected: false},
    {value: 'Solo al fine settimana', selected: false},
    {value: 'Tutti i giorni alla sera', selected: false},
    {value: 'Solo giorni lavorativi', selected: false},
  ]);

  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    setLoading(true);
    const time = timeList.filter((v) => v.selected);
    if (time) {
      const {username, email, gender, password, table, fmcToken} = route.params;
      try {
        const response = await API.post('/user/register', {
          username,
          email,
          gender,
          password,
          table,
          timePrefered: time[0].value,
          fmcToken,
        });
        setLoading(false);
        if (response.status === 200) navigation.navigate('A Stecca');
      } catch (err) {
        setLoading(false);
        showMessage({message: err.response.data, type: 'danger'});
      }
    }
    // showMessage({message: 'Please select your availibility', type: 'danger'});
  };

  const onSelect = (index) => {
    let copy = timeList;
    copy.forEach((element) => {
      element.selected = false;
    });
    copy[index].selected = true;
    setTimeList([...copy]);
  };

  return (
    <View style={styles.wrapper}>
      <Backdrop />
      <View style={styles.wrapper1}>
        <Text style={styles.header}>Scegli</Text>
        <Text style={styles.header}>iI tuo tempo Libero</Text>
      </View>
      <View style={styles.wrapper2}>
        {timeList
          ? timeList.map((v, i) => {
              return (
                <TimeCards
                  key={i}
                  value={v.value}
                  title={v.value}
                  selected={v.selected}
                  onSelect={() => onSelect(i)}
                />
              );
            })
          : null}
      </View>
      <View style={styles.wrapper3}>
        <ButtonLarge
          onSubmit={onRegister}
          title="CONFERMA"
          color="black"
          extraStyles={{width: '90%'}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: white,
  },
  wrapper1: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper2: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper3: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',

    width: '100%',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
