import { StyleSheet, View } from 'react-native';
import Clock from '../components/Clock';
import { SettingsProvider } from '../context/SettingsContext';

export default function HomeScreen() {
  return (
    <SettingsProvider>
      <View style={styles.container}>
        <Clock />
      </View>
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});