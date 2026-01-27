// Утилита для очистки AsyncStorage в целях отладки
// Запустить: node debug_clear_storage.js

const AsyncStorage = require('@react-native-async-storage/async-storage').default;

async function clearAllStorage() {
  try {
    await AsyncStorage.clear();
    console.log('✅ AsyncStorage cleared successfully');
    console.log('Теперь приложение должно показать Auth Screen после Splash Screen');
  } catch (error) {
    console.log('❌ Error clearing AsyncStorage:', error);
  }
}

clearAllStorage();