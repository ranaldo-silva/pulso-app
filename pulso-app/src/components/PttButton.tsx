import {
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

type PttButtonProps = {
  onPressIn?: () => void;
  onPressOut?: () => void;
  transmitting?: boolean;
};

export default function PttButton({
  onPressIn,
  onPressOut,
  transmitting = false,
}: PttButtonProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[
          styles.button,
          transmitting && styles.transmitting,
        ]}
      >
        <Ionicons
          name="mic"
          size={48}
          color="#fff"
        />

        <Text style={styles.text}>
          {transmitting
            ? 'TRANSMITINDO'
            : 'SEGURE PARA FALAR'}
        </Text>
      </Pressable>

      <Text style={styles.helper}>
        Pressione e segure para falar
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },

  button: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  transmitting: {
    backgroundColor: '#dc2626',
  },

  text: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 10,
  },

  helper: {
    marginTop: 10,
    fontSize: 13,
    color: '#777',
  },
});
