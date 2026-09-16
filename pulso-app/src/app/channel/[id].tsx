import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import PttButton from '../../components/PttButton';

import {
  startAudioCapture,
  stopAudioCapture,
} from '../../services/webrtc';

import type MediaStream from 'react-native-webrtc/lib/typescript/MediaStream';

type Participant = {
  id: string;
  name: string;
  online: boolean;
  speaking?: boolean;
};

const participants: Participant[] = [
  {
    id: 'ronaldo',
    name: 'Ronaldo',
    online: true,
  },
  {
    id: 'joao',
    name: 'João',
    online: true,
  },
  {
    id: 'carlos',
    name: 'Carlos',
    online: false,
  },
  {
    id: 'pedro',
    name: 'Pedro',
    online: true,
  },
];

export default function ChannelScreen() {
  const router = useRouter();

  const { id } =
    useLocalSearchParams<{ id: string }>();

  const [transmitting, setTransmitting] =
    useState(false);

  const audioStream =
    useRef<MediaStream | null>(null);

  const channel = useMemo(() => {
    if (id === 'familia') {
      return {
        name: 'Família',
        description:
          'Canal da família',
      };
    }

    return {
      name: 'Equipe Operacional',
      description:
        'Comunicação da equipe',
    };
  }, [id]);

  useEffect(() => {
    return () => {
      stopAudioCapture(
        audioStream.current
      );

      audioStream.current = null;
    };
  }, []);

  async function startTransmission() {
    try {
      const stream =
        await startAudioCapture();

      audioStream.current = stream;

      setTransmitting(true);

      console.log(
        'PTT: microfone iniciado'
      );
    } catch (error) {
      console.error(
        'PTT: erro ao acessar microfone:',
        error
      );

      setTransmitting(false);
    }
  }

  function stopTransmission() {
    stopAudioCapture(
      audioStream.current
    );

    audioStream.current = null;

    setTransmitting(false);

    console.log(
      'PTT: microfone encerrado'
    );
  }

  function leaveChannel() {
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#222"
            />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.title}>
              {channel.name}
            </Text>

            <Text style={styles.description}>
              {channel.description}
            </Text>
          </View>
        </View>

        {/* STATUS */}
        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Ionicons
              name="radio"
              size={24}
              color="#fff"
            />
          </View>

          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>
              Canal ativo
            </Text>

            <Text style={styles.statusText}>
              {participants.filter(
                (participant) =>
                  participant.online
              ).length}{' '}
              participantes online
            </Text>
          </View>

          <View style={styles.onlineDot} />
        </View>

        {/* PTT */}
        <View style={styles.pttSection}>
          <PttButton
            transmitting={transmitting}
            onPressIn={startTransmission}
            onPressOut={stopTransmission}
          />
        </View>

        {/* PARTICIPANTES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Participantes
          </Text>

          <View style={styles.participantsCard}>
            {participants.map(
              (participant) => (
                <View
                  key={participant.id}
                  style={styles.participant}
                >
                  <View style={styles.avatar}>
                    <Text
                      style={
                        styles.avatarText
                      }
                    >
                      {participant.name
                        .charAt(0)
                        .toUpperCase()}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.participantInfo
                    }
                  >
                    <Text
                      style={
                        styles.participantName
                      }
                    >
                      {participant.name}
                    </Text>

                    <View
                      style={
                        styles.participantStatus
                      }
                    >
                      <View
                        style={[
                          styles.statusDot,
                          participant.online
                            ? styles.online
                            : styles.offline,
                        ]}
                      />

                      <Text
                        style={
                          styles.participantStatusText
                        }
                      >
                        {participant.online
                          ? 'Online'
                          : 'Offline'}
                      </Text>
                    </View>
                  </View>

                  {participant.speaking && (
                    <Ionicons
                      name="mic"
                      size={20}
                      color="#22c55e"
                    />
                  )}
                </View>
              )
            )}
          </View>
        </View>

        {/* SAIR */}
        <TouchableOpacity
          style={styles.leaveButton}
          onPress={leaveChannel}
          activeOpacity={0.7}
        >
          <Ionicons
            name="exit-outline"
            size={22}
            color="#dc2626"
          />

          <Text style={styles.leaveText}>
            Sair do canal
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  headerInfo: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
  },

  description: {
    marginTop: 4,
    fontSize: 13,
    color: '#777',
  },

  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },

  statusIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  statusInfo: {
    flex: 1,
  },

  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },

  statusText: {
    marginTop: 4,
    fontSize: 13,
    color: '#777',
  },

  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
  },

  pttSection: {
    alignItems: 'center',
    marginBottom: 20,
  },

  section: {
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },

  participantsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
  },

  participant: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  participantInfo: {
    flex: 1,
  },

  participantName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },

  participantStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  online: {
    backgroundColor: '#22c55e',
  },

  offline: {
    backgroundColor: '#999',
  },

  participantStatusText: {
    fontSize: 12,
    color: '#777',
  },

  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 15,
    marginTop: 24,
  },

  leaveText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },
});