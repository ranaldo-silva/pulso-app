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

import PttButton from '../../components/PttButton';
import { useContactsStore } from '../../stores/contactsStore';
import { usePttStore } from '../../stores/pttStore';
import {
  startAudioCapture,
  stopAudioCapture,
} from '../../services/webrtc';
import {
  colors,
  fontSize,
  radius,
  spacing,
  statusColors,
  statusLabels,
} from '../../constants/theme';

import type MediaStream from 'react-native-webrtc/lib/typescript/MediaStream';

export default function PttScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const contacts = useContactsStore((s) => s.contacts);
  const contact = contacts.find((c) => c.id === id);

  const {
    transmitting,
    startTransmission,
    stopTransmission,
  } = usePttStore();

  const audioStream = useRef<MediaStream | null>(null);
  const [micAvailable, setMicAvailable] = useState(true);

  const contactName = contact?.name || 'Contato';
  const contactStatus = contact?.status || 'offline';

  useEffect(() => {
    return () => {
      stopAudioCapture(audioStream.current);
      audioStream.current = null;
      stopTransmission();
    };
  }, []);

  async function handleStartPtt() {
    try {
      startTransmission({ contactId: id });
      const stream = await startAudioCapture();
      audioStream.current = stream;
      setMicAvailable(true);
    } catch (error) {
      console.warn('Erro ao capturar microfone:', error);
      setMicAvailable(false);
    }
  }

  function handleStopPtt() {
    stopAudioCapture(audioStream.current);
    audioStream.current = null;
    stopTransmission();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={colors.white}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Push-to-Talk Direto</Text>

          <TouchableOpacity
            style={styles.callShortcutButton}
            onPress={() => router.push(`/call/${id}`)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="call-outline"
              size={22}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>

        {/* TARGET USER INFO */}
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {contactName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.userName}>{contactName}</Text>

          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: statusColors[contactStatus] },
              ]}
            />
            <Text style={styles.statusText}>
              {statusLabels[contactStatus]}
            </Text>
          </View>

          {transmitting && (
            <View style={styles.transmissionBanner}>
              <View style={styles.pulseDot} />
              <Text style={styles.transmissionBannerText}>
                Transmitindo voz para {contactName}
              </Text>
            </View>
          )}
        </View>

        {/* PTT BUTTON */}
        <View style={styles.pttContainer}>
          <PttButton
            transmitting={transmitting}
            onPressIn={handleStartPtt}
            onPressOut={handleStopPtt}
          />
        </View>

        {/* FOOTER ACTIONS */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.switchCallButton}
            onPress={() => router.push(`/call/${id}`)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="call"
              size={20}
              color={colors.dark}
            />
            <Text style={styles.switchCallText}>
              Iniciar chamada contínua
            </Text>
          </TouchableOpacity>
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
    padding: spacing.xl,
    justifyContent: 'space-between',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.gray700,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.white,
  },

  callShortcutButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.gray700,
    justifyContent: 'center',
    alignItems: 'center',
  },

  userInfo: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.gray700,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  avatarText: {
    color: colors.white,
    fontSize: fontSize['5xl'],
    fontWeight: '700',
  },

  userName: {
    fontSize: fontSize['3xl'],
    fontWeight: '700',
    color: colors.white,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  statusText: {
    fontSize: fontSize.base,
    color: colors.gray200,
  },

  transmissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },

  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },

  transmissionBannerText: {
    color: colors.danger,
    fontSize: fontSize.md,
    fontWeight: '600',
  },

  pttContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  footer: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },

  switchCallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.base,
    borderRadius: radius.xl,
    gap: spacing.sm,
  },

  switchCallText: {
    color: colors.dark,
    fontSize: fontSize.base,
    fontWeight: '700',
  },
});
