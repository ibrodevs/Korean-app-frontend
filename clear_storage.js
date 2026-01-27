const AsyncStorage = require('@react-native-async-storage/async-storage').default; AsyncStorage.clear().then(() => console.log('Storage cleared')).catch(console.error);
