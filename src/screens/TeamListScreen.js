import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';

// Custom components
import TeamCard from '../components/teamCard';
import Backdrop from '../components/backdrop';

// Utilities
import {white} from '../assets/styles/theme';

export default ({route, navigation}) => {
  const [teams, setTeams] = useState(null);

  useEffect(() => {
    setTeams(route.params.teams);
  }, []);

  return (
    <View style={styles.wrapper}>
      <Backdrop />
      <View style={styles.wrapper1}>
        <FlatList
          data={teams}
          renderItem={({item}) => (
            <TeamCard
              player1={item.members[0]}
              player2={item.members[1]}
              onSelect={() => navigation.navigate('Team Game', {team: item})}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: white,
  },
  wrapper1: {
    width: '92%',
  },
});
