import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface TimerButtonProps {
  onPress: () => void;
  isRunning: boolean;
  testID?: string;
}

export const TimerButton: React.FC<TimerButtonProps> = ({ onPress, isRunning, testID }) => {
  return (
    <TouchableOpacity
      style={[styles.button, isRunning ? styles.closeButton : styles.startButton]}
      onPress={onPress}
      testID={testID}
    >
      <Text style={styles.buttonText}>
        {isRunning ? 'Stop Working' : 'Start Working'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  closeButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TimerButton;