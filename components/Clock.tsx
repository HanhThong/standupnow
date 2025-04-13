import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import TimerButton from './ui/TimerButton';
import CircularProgress from './ui/CircularProgress';
import SettingsButton from './settings/SettingsButton';
import SettingsModal from './settings/SettingsModal';
import { useSettings } from '../context/SettingsContext';

export const Clock: React.FC = () => {
  const { settings, isLoading } = useSettings();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(settings.timerDuration * 60);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  // Reset timer when settings change
  useEffect(() => {
    if (!isTimerRunning) {
      setTimeRemaining(settings.timerDuration * 60);
    }
  }, [settings.timerDuration, isTimerRunning]);

  // Clock update effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Timer countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            playAlertSound();
            setIsTimerRunning(false);
            return settings.timerDuration * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, settings.timerDuration]);

  // Load sound effect
  useEffect(() => {
    async function loadSound() {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/alert.mp3')
        );
        setSound(sound);
      } catch (error) {
        console.error('Error loading sound', error);
      }
    }

    loadSound();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const playAlertSound = async () => {
    try {
      if (sound) {
        await sound.replayAsync();
      }
    } catch (error) {
      console.error('Error playing sound', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    if (isTimerRunning) {
      // Close timer and reset
      setIsTimerRunning(false);
      setTimeRemaining(settings.timerDuration * 60);
    } else {
      // Start timer
      setIsTimerRunning(true);
    }
  };

  const handleSettingsPress = () => {
    setIsSettingsVisible(true);
  };

  const handleSettingsClose = () => {
    setIsSettingsVisible(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SettingsButton
        onPress={handleSettingsPress}
        testID="settings-button"
      />
      <Text style={styles.clockText} testID="clock-display">
        {formatTime(currentTime)}
      </Text>
      {isTimerRunning && (
        <View testID="timer-display" style={styles.timerContainer}>
          <CircularProgress
            progress={1 - timeRemaining / (settings.timerDuration * 60)}
            size={200}
            strokeWidth={15}
            timeRemaining={timeRemaining}
          />
        </View>
      )}
      <TimerButton
        testID="timer-button"
        onPress={handleStartTimer}
        isRunning={isTimerRunning}
      />
      <SettingsModal
        isVisible={isSettingsVisible}
        onClose={handleSettingsClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  clockText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
});

export default Clock;