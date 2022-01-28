import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {showMessage} from 'react-native-flash-message';

import {white} from '../assets/styles/theme';

import TableCard from '../components/tableCard';
import Backdrop from '../components/backdrop';
import {ButtonLarge} from '../components/button';

const tableTypes = ['big', 'small'];

export default ({route, navigation}) => {
  // const [table, setTable] = useState([]);
  const [tables, setTable] = useState([
    {value: 'Buche Larghe', selected: false},
    {value: 'Buche Strette', selected: false},
  ]);

  const tableSelect = async (type, selected) => {
    if (selected) {
      setTable([...table, type]);
      return;
    }
    let tables = table.filter((v) => v !== type);
    setTable(tables);
  };

  const onSelect = (index) => {
    let copy = tables;
    copy.forEach((element) => {
      element.selected = false;
    });
    copy[index].selected = true;
    setTable([...copy]);
  };

  const onContinue = () => {
    const table = tables.filter((v) => v.selected);
    const {username, email, gender, password, fmcToken} = route.params;
    if (table.length !== 0) {
      navigation.navigate('TimeScreen', {
        username,
        email,
        gender,
        password,
        table: table[0].value,
        fmcToken,
      });
      return;
    }
    showMessage({
      message: 'Select atleast one board',
      description: 'Board selection can not be empty',
      type: 'danger',
    });
  };

  return (
    <View style={styles.wrapper}>
      <Backdrop />
      <View style={styles.wrapper2}>
        <Text style={styles.header}>Scegli</Text>
        <Text style={styles.header}>la tua preferenza</Text>
      </View>

      <View style={styles.wrapper3}>
        {tables
          ? tables.map((v, i) => {
              return (
                <TableCard
                  key={i}
                  title={v.value}
                  tableType={tableTypes[0]}
                  selected={v.selected}
                  onSelect={() => onSelect(i)}
                />
              );
            })
          : null}
        {/* <TableCard
          tableType={tableTypes[0]}
          onSelect={(type, selected) => tableSelect(type, selected)}
          title="Buche Larghe"
        />
        <TableCard
          tableType={tableTypes[1]}
          onSelect={(type, selected) => tableSelect(type, selected)}
          title="Buche Strette"
        /> */}
      </View>

      <View style={styles.wrapper1}>
        <ButtonLarge
          onSubmit={onContinue}
          title="CONTINUA"
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
    flex: 0.1,
    width: '100%',
    alignItems: 'center',
  },
  wrapper2: {
    flex: 0.1,
    alignItems: 'center',
    marginTop: 20,
  },
  wrapper3: {
    flex: 0.7,
    justifyContent: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
