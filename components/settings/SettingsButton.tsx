import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingsButtonProps {
  onPress: () => void;
  testID?: string;
}

export const SettingsButton: React.FC<SettingsButtonProps> = ({ onPress, testID }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      testID={testID || 'settings-button'}
    >
      <Ionicons name="settings-outline" size={24} color="#000000" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 8,
    zIndex: 1000,
  },
});

export default SettingsButton;