import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useAudioRecorder,
  RecordingPresets,
  requestRecordingPermissionsAsync,
} from 'expo-audio';

import { Ionicons } from '@expo/vector-icons';

export default function CallScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [microphoneReady, setMicrophoneReady] = useState(false);

  const recorder = useAudioRecorder(
    RecordingPresets.HIGH_QUALITY
  );

  const name =
    id === 'joao'
      ? 'João'
      : id === 'carlos'
        ? 'Carlos'
        : id === 'pedro'
          ? 'Pedro'
          : 'Contato';

  useEffect(() => {
    async function setupMicrophone() {
      const permission =
        await requestRecordingPermissionsAsync();

      if (permission.granted) {
        setMicrophoneReady(true);
      }
    }

    setupMicrophone();
  }, []);

  async function startMicrophone() {
    if (!microphoneReady) {
      return;
    }

    try {
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch (error) {
      console.log(
        'Erro ao iniciar microfone:',
        error
      );
    }
  }

  async function stopMicrophone() {
    try {
      await recorder.stop();
    } catch (error) {
      console.log(
        'Erro ao parar microfone:',
        error
      );
    }
  }

  async function toggleMute() {
    if (muted) {
      setMuted(false);
      await startMicrophone();
    } else {
      setMuted(true);
      await stopMicrophone();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* CONTATO */}

        <View style={styles.contact}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.name}>
            {name}
          </Text>

          <Text style={styles.status}>
            Chamada em andamento
          </Text>

          <Text style={styles.microphoneStatus}>
            {microphoneReady
              ? 'Microfone disponível'
              : 'Aguardando permissão do microfone'}
          </Text>
        </View>

        {/* CONTROLES */}

        <View style={styles.controls}>

          <TouchableOpacity
            style={[
              styles.controlButton,
              muted && styles.controlActive,
            ]}
            onPress={toggleMute}
          >
            <Ionicons
              name={
                muted
                  ? 'mic-off'
                  : 'mic'
              }
              size={28}
              color="#fff"
            />

            <Text style={styles.controlText}>
              {muted ? 'Ativar' : 'Mudo'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              speaker && styles.controlActive,
            ]}
            onPress={() => setSpeaker(!speaker)}
          >
            <Ionicons
              name={
                speaker
                  ? 'volume-high'
                  : 'volume-medium'
              }
              size={28}
              color="#fff"
            />

            <Text style={styles.controlText}>
              Viva-voz
            </Text>
          </TouchableOpacity>

        </View>

        {/* MICROFONE */}

        <TouchableOpacity
          style={styles.microphoneButton}
          onPress={startMicrophone}
        >
          <Ionicons
            name="mic"
            size={28}
            color="#fff"
          />

          <Text style={styles.microphoneButtonText}>
            Testar microfone
          </Text>
        </TouchableOpacity>

        {/* ENCERRAR */}

        <View style={styles.endContainer}>
          <TouchableOpacity
            style={styles.endButton}
            onPress={async () => {
              await stopMicrophone();
              router.back();
            }}
          >
            <Ionicons
              name="call"
              size={32}
              color="#fff"
            />
          </TouchableOpacity>

          <Text style={styles.endText}>
            Encerrar chamada
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
  },

  contact: {
    alignItems: 'center',
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  avatarText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '700',
  },

  name: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },

  status: {
    color: '#aaa',
    fontSize: 15,
    marginTop: 8,
  },

  microphoneStatus: {
    color: '#22c55e',
    fontSize: 13,
    marginTop: 12,
  },

  controls: {
    flexDirection: 'row',
    gap: 30,
  },

  controlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },

  controlActive: {
    backgroundColor: '#555',
  },

  controlText: {
    color: '#fff',
    fontSize: 11,
    marginTop: 5,
  },

  microphoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
  },

  microphoneButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },

  endContainer: {
    alignItems: 'center',
  },

  endButton: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [
      {
        rotate: '135deg',
      },
    ],
  },

  endText: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 12,
  },
});