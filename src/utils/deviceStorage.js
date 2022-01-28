import AsyncStorage from '@react-native-community/async-storage';

const deviceStorage = {
  async saveItem(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  },

  async loadUser() {
    try {
      const user = await AsyncStorage.getItem('@user');
      if (user) {
        return user;
      }
    } catch (error) {
      return null;
    }
  },

  async loadJWT() {
    try {
      const value = await AsyncStorage.getItem('@id_token');
      if (value !== null) {
        return value;
      }
    } catch (error) {
      console.log(error);
    }
  },

  async deleteJWT() {
    try {
      const value = await AsyncStorage.removeItem('@id_token');
    } catch (error) {
      console.log(error);
    }
  },

  async deleteUser() {
    try {
      await AsyncStorage.removeItem('@user');
    } catch (error) {
      console.log(error);
    }
  },
};

export default deviceStorage;
