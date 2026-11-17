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
import { useChannelsStore } from '../../stores/channelsStore';
import { useContactsStore } from '../../stores/contactsStore';
import { usePttStore } from '../../stores/pttStore';
import { useAuthStore } from '../../stores/authStore';
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
} from '../../constants/theme';

import type MediaStream from 'react-native-webrtc/lib/typescript/MediaStream';

export default function ChannelScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const getChannelById = useChannelsStore((s) => s.getChannelById);
  const contacts = useContactsStore((s) => s.contacts);
  const currentUser = useAuthStore((s) => s.user);

  const {
    transmitting,
    startTransmission,
    stopTransmission,
  } = usePttStore();

  const audioStream = useRef<MediaStream | null>(null);

  const channel = useMemo(() => {
    return (
      getChannelById(id) || {
        id,
        name: 'Canal',
        description: 'Canal de comunicação',
        icon: 'radio-outline',
        members: ['ronaldo'],
        createdBy: 'user',
        createdAt: new Date().toISOString(),
      }
    );
  }, [id, getChannelById]);

  // Map channel member IDs to contact / user details
  const channelParticipants = useMemo(() => {
    const list = [];

    // Current user first
    if (currentUser) {
      list.push({
        id: currentUser.id,
        name: `${currentUser.name} (Você)`,
        online: currentUser.status !== 'offline',
        speaking: transmitting,
      });
    }

    // Add other members found in contacts or defaults
    contacts.forEach((contact) => {
      if (channel.members.includes(contact.id)) {
        list.push({
          id: contact.id,
          name: contact.name,
          online: contact.status !== 'offline',
          speaking: false,
        });
      }
    });

    return list;
  }, [channel, currentUser, contacts, transmitting]);

  useEffect(() => {
    return () => {
      stopAudioCapture(audioStream.current);
      audioStream.current = null;
      stopTransmission();
    };
  }, []);

  async function handleStartPtt() {
    try {
      startTransmission({ channelId: id });
      const stream = await startAudioCapture();
      audioStream.current = stream;
    } catch (error) {
      console.warn('Erro ao capturar microfone:', error);
      // Ptt state still active to give user feedback
    }
  }

  function handleStopPtt() {
    stopAudioCapture(audioStream.current);
    audioStream.current = null;
    stopTransmission();
  }

  function leaveChannel() {
    router.back();
  }

  const onlineMembersCount = channelParticipants.filter((p) => p.online).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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
              color={colors.dark}
            />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.title}>{channel.name}</Text>
            <Text style={styles.description}>{channel.description}</Text>
          </View>
        </View>

        {/* STATUS */}
        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Ionicons
              name="radio"
              size={24}
              color={colors.white}
            />
          </View>

          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>Canal ativo</Text>
            <Text style={styles.statusText}>
              {onlineMembersCount}{' '}
              {onlineMembersCount === 1
                ? 'participante online'
                : 'participantes online'}
            </Text>
          </View>

          <View style={styles.onlineDot} />
        </View>

        {/* PTT */}
        <View style={styles.pttSection}>
          <PttButton
            transmitting={transmitting}
            onPressIn={handleStartPtt}
            onPressOut={handleStopPtt}
          />
        </View>

        {/* PARTICIPANTES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Participantes</Text>

          <View style={styles.participantsCard}>
            {channelParticipants.map((participant) => (
              <View
                key={participant.id}
                style={styles.participant}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {participant.name.charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.participantInfo}>
                  <Text style={styles.participantName}>
                    {participant.name}
                  </Text>

                  <View style={styles.participantStatus}>
                    <View
                      style={[
                        styles.statusDot,
                        participant.online
                          ? styles.online
                          : styles.offline,
                      ]}
                    />

                    <Text style={styles.participantStatusText}>
                      {participant.online ? 'Online' : 'Offline'}
                    </Text>
                  </View>
                </View>

                {participant.speaking && (
                  <View style={styles.speakingBadge}>
                    <Ionicons
                      name="mic"
                      size={16}
                      color={colors.danger}
                    />
                    <Text style={styles.speakingText}>Transmitindo</Text>
                  </View>
                )}
              </View>
            ))}
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
            color={colors.danger}
          />

          <Text style={styles.leaveText}>Sair do canal</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },

  headerInfo: {
    flex: 1,
  },

  title: {
    fontSize: fontSize['3xl'],
    fontWeight: '700',
    color: colors.dark,
  },

  description: {
    marginTop: spacing.xs,
    fontSize: fontSize.md,
    color: colors.gray400,
  },

  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.xl,
  },

  statusIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },

  statusInfo: {
    flex: 1,
  },

  statusTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.dark,
  },

  statusText: {
    marginTop: spacing.xs,
    fontSize: fontSize.md,
    color: colors.gray400,
  },

  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
  },

  pttSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  section: {
    marginTop: spacing.sm,
  },

  sectionTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.md,
  },

  participantsCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
  },

  participant: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },

  avatarText: {
    color: colors.white,
    fontSize: fontSize['2xl'],
    fontWeight: '700',
  },

  participantInfo: {
    flex: 1,
  },

  participantName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.dark,
  },

  participantStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  online: {
    backgroundColor: colors.success,
  },

  offline: {
    backgroundColor: colors.gray200,
  },

  participantStatusText: {
    fontSize: fontSize.sm,
    color: colors.gray400,
  },

  speakingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    gap: 4,
  },

  speakingText: {
    fontSize: fontSize.xs,
    color: colors.danger,
    fontWeight: '600',
  },

  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    marginTop: spacing.xxl,
  },

  leaveText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.danger,
  },
});
