import {StyleSheet} from 'react-native';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // position: 'relative',
    // backgroundColor: 'yellow',
  },
  header1: {
    fontSize: 22,
    fontWeight: '900',
  },
  backdropImg: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 3,

    // zIndex: 99,
  },
  m5: {
    margin: 5,
  },
  m10: {
    margin: 10,
  },
  m15: {
    margin: 15,
  },
  m25: {
    margin: 25,
  },

  ph5: {
    paddingHorizontal: 5,
  },
  ph10: {
    paddingHorizontal: 10,
  },
  ph15: {
    paddingHorizontal: 15,
  },
});

export default globalStyles;
