import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Vibration,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { colors, fontSize, spacing } from '../constants/theme';

type PttButtonProps = {
  onPressIn?: () => void;
  onPressOut?: () => void;
  transmitting?: boolean;
  size?: 'normal' | 'small';
};

export default function PttButton({
  onPressIn,
  onPressOut,
  transmitting = false,
  size = 'normal',
}: PttButtonProps) {
  const startPlayer = useAudioPlayer(require('../../assets/sounds/ptt_start.wav'));
  const stopPlayer = useAudioPlayer(require('../../assets/sounds/ptt_stop.wav'));

  const buttonSize =
    size === 'small' ? 140 : 180;
  const iconSize =
    size === 'small' ? 36 : 48;

  function handlePressIn() {
    try {
      Vibration.vibrate(50);
      startPlayer.seekTo(0);
      startPlayer.play();
    } catch (e) {
      console.warn('Erro ao tocar som ptt_start:', e);
    }
    onPressIn?.();
  }

  function handlePressOut() {
    try {
      Vibration.vibrate(30);
      stopPlayer.seekTo(0);
      stopPlayer.play();
    } catch (e) {
      console.warn('Erro ao tocar som ptt_stop:', e);
    }
    onPressOut?.();
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button,
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
          },
          transmitting &&
            styles.transmitting,
        ]}
      >
        <Ionicons
          name="mic"
          size={iconSize}
          color={colors.white}
        />

        <Text style={styles.text}>
          {transmitting
            ? 'TRANSMITINDO'
            : 'SEGURE PARA FALAR'}
        </Text>
      </Pressable>

      <Text style={styles.helper}>
        {transmitting
          ? 'Solte para parar'
          : 'Pressione e segure para falar'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: spacing.sm + 2,
    marginBottom: spacing.xxxl,
  },

  button: {
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  transmitting: {
    backgroundColor: colors.danger,
  },

  text: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: '800',
    marginTop: spacing.sm + 2,
  },

  helper: {
    marginTop: spacing.sm + 2,
    fontSize: fontSize.md,
    color: colors.gray400,
  },
});
