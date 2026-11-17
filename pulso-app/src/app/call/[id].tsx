import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { createPeerConnection } from '../../services/webrtc';
import { useContactsStore } from '../../stores/contactsStore';
import { useCallStore } from '../../stores/callStore';
import { useCallTimer } from '../../hooks/useCallTimer';
import {
  colors,
  fontSize,
  radius,
  spacing,
  statusColors,
} from '../../constants/theme';

import type {
  RTCPeerConnection,
  MediaStream,
} from 'react-native-webrtc';

export default function CallScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const contacts = useContactsStore((s) => s.contacts);
  const contact = contacts.find((c) => c.id === id);

  const {
    status,
    muted,
    speaker,
    startTime,
    startCall,
    setStatus,
    toggleMute,
    toggleSpeaker,
    endCall,
  } = useCallStore();

  const { formatted: callDuration } = useCallTimer(startTime);

  const [microphoneReady, setMicrophoneReady] = useState(false);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);

  const contactName = contact?.name || 'Contato';

  useEffect(() => {
    let mounted = true;

    startCall(id, contactName);

    async function setupCall() {
      try {
        const result = await createPeerConnection();

        if (!mounted) {
          result.stream.getTracks().forEach((track) => track.stop());
          result.peerConnection.close();
          return;
        }

        peerConnection.current = result.peerConnection;
        localStream.current = result.stream;

        setMicrophoneReady(true);
        setStatus('active');
      } catch (error) {
        console.error('Erro ao inicializar WebRTC:', error);
        if (mounted) {
          setMicrophoneReady(false);
          setStatus('active'); // allow simulated interface even if real webrtc fails in simulator
        }
      }
    }

    setupCall();

    return () => {
      mounted = false;

      localStream.current?.getTracks().forEach((track) => track.stop());
      peerConnection.current?.close();

      localStream.current = null;
      peerConnection.current = null;
      endCall();
    };
  }, [id]);

  function handleToggleMute() {
    if (localStream.current) {
      const audioTracks = localStream.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = muted;
      });
    }
    toggleMute();
  }

  function handleToggleSpeaker() {
    toggleSpeaker();
  }

  async function handleEndCall() {
    localStream.current?.getTracks().forEach((track) => track.stop());
    peerConnection.current?.close();

    localStream.current = null;
    peerConnection.current = null;

    endCall();
    router.back();
  }

  const isConnecting = status === 'connecting' || status === 'ringing';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* CONTATO */}
        <View style={styles.contact}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {contactName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.name}>{contactName}</Text>

          <Text style={styles.status}>
            {isConnecting ? 'Chamando...' : callDuration}
          </Text>

          <Text style={styles.microphoneStatus}>
            {microphoneReady
              ? 'Áudio WebRTC ativo'
              : isConnecting
                ? 'Conectando microfone...'
                : 'Microfone em modo demonstração'}
          </Text>
        </View>

        {/* CONTROLES */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, muted && styles.controlActive]}
            onPress={handleToggleMute}
            activeOpacity={0.8}
          >
            <Ionicons
              name={muted ? 'mic-off' : 'mic'}
              size={28}
              color={colors.white}
            />

            <Text style={styles.controlText}>
              {muted ? 'Ativar' : 'Mudo'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, speaker && styles.controlActive]}
            onPress={handleToggleSpeaker}
            activeOpacity={0.8}
          >
            <Ionicons
              name={speaker ? 'volume-high' : 'volume-medium'}
              size={28}
              color={colors.white}
            />

            <Text style={styles.controlText}>Viva-voz</Text>
          </TouchableOpacity>
        </View>

        {/* STATUS WEBRTC */}
        <View style={styles.connectionBox}>
          <View
            style={[
              styles.connectionDot,
              microphoneReady ? styles.connected : styles.disconnected,
            ]}
          />

          <Text style={styles.connectionText}>
            {microphoneReady ? 'WebRTC conectado' : 'Modo local'}
          </Text>
        </View>

        {/* ENCERRAR */}
        <View style={styles.endContainer}>
          <TouchableOpacity
            style={styles.endButton}
            onPress={handleEndCall}
            activeOpacity={0.8}
          >
            <Ionicons
              name="call"
              size={32}
              color={colors.white}
            />
          </TouchableOpacity>

          <Text style={styles.endText}>Encerrar chamada</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
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
    backgroundColor: colors.gray700,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  avatarText: {
    color: colors.white,
    fontSize: fontSize['6xl'],
    fontWeight: '700',
  },

  name: {
    color: colors.white,
    fontSize: fontSize['4xl'],
    fontWeight: '700',
  },

  status: {
    color: colors.gray200,
    fontSize: fontSize.lg,
    marginTop: spacing.sm,
  },

  microphoneStatus: {
    color: colors.success,
    fontSize: fontSize.md,
    marginTop: spacing.md,
  },

  controls: {
    flexDirection: 'row',
    gap: spacing.xxxl,
  },

  controlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.gray700,
    justifyContent: 'center',
    alignItems: 'center',
  },

  controlActive: {
    backgroundColor: colors.gray600,
  },

  controlText: {
    color: colors.white,
    fontSize: fontSize.xs,
    marginTop: 5,
  },

  connectionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: radius.xl,
    backgroundColor: colors.dark,
  },

  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },

  connected: {
    backgroundColor: colors.success,
  },

  disconnected: {
    backgroundColor: colors.warning,
  },

  connectionText: {
    color: colors.gray200,
    fontSize: fontSize.md,
  },

  endContainer: {
    alignItems: 'center',
  },

  endButton: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '135deg' }],
  },

  endText: {
    color: colors.gray200,
    fontSize: fontSize.md,
    marginTop: spacing.md,
  },
});
