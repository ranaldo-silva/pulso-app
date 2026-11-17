import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';

import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useChannelsStore } from '../../stores/channelsStore';
import { useAuthStore } from '../../stores/authStore';
import {
  colors,
  fontSize,
  radius,
  spacing,
} from '../../constants/theme';

export default function ChannelsScreen() {
  const router = useRouter();
  const channels = useChannelsStore((s) => s.channels);
  const addChannel = useChannelsStore((s) => s.addChannel);
  const fetchChannels = useChannelsStore((s) => s.fetchChannels);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    fetchChannels();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const [error, setError] = useState('');

  function openChannel(channelId: string) {
    router.push({
      pathname: '/channel/[id]',
      params: {
        id: channelId,
      },
    });
  }

  async function handleCreateChannel() {
    setError('');

    if (!channelName.trim()) {
      setError('Informe o nome do canal');
      return;
    }

    const res = await api.createChannel(
      channelName.trim(),
      channelDescription.trim() || 'Sem descrição',
      'radio-outline'
    );

    if (res.data) {
      addChannel(res.data);
    } else {
      const newId = channelName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-');

      addChannel({
        id: newId,
        name: channelName.trim(),
        description: channelDescription.trim() || 'Sem descrição',
        icon: 'radio-outline',
        members: user ? [user.id] : ['user'],
        createdBy: user?.id || 'user',
        createdAt: new Date().toISOString(),
      });
    }

    setChannelName('');
    setChannelDescription('');
    setModalVisible(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Canais</Text>
            <Text style={styles.subtitle}>
              {channels.length}{' '}
              {channels.length === 1
                ? 'canal disponível'
                : 'canais de comunicação'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="add"
              size={24}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>

        {/* CANAIS */}
        <View style={styles.section}>
          {channels.map((channel) => (
            <TouchableOpacity
              key={channel.id}
              style={styles.channelCard}
              activeOpacity={0.8}
              onPress={() => openChannel(channel.id)}
            >
              <View style={styles.channelIcon}>
                <Ionicons
                  name={
                    (channel.icon as keyof typeof Ionicons.glyphMap) ||
                    'radio-outline'
                  }
                  size={28}
                  color={colors.white}
                />
              </View>

              <View style={styles.channelInfo}>
                <Text style={styles.channelName}>{channel.name}</Text>

                <Text
                  style={styles.channelDescription}
                  numberOfLines={1}
                >
                  {channel.description}
                </Text>

                <View style={styles.membersRow}>
                  <Ionicons
                    name="people-outline"
                    size={15}
                    color={colors.gray400}
                  />

                  <Text style={styles.membersText}>
                    {channel.members.length}{' '}
                    {channel.members.length === 1
                      ? 'participante'
                      : 'participantes'}
                  </Text>
                </View>
              </View>

              <View style={styles.arrow}>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.gray200}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* INFORMAÇÃO */}
        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={colors.primary}
          />

          <Text style={styles.infoText}>
            Toque em um canal para abrir a comunicação PTT e falar com todos os
            membros.
          </Text>
        </View>
      </ScrollView>

      {/* MODAL CRIAR CANAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Canal</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={colors.gray400}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <Text style={styles.inputLabel}>Nome do canal</Text>
              <TextInput
                value={channelName}
                onChangeText={setChannelName}
                placeholder="Ex: Operações Noturnas"
                placeholderTextColor={colors.gray200}
                style={styles.modalInput}
              />

              <Text style={styles.inputLabel}>Descrição</Text>
              <TextInput
                value={channelDescription}
                onChangeText={setChannelDescription}
                placeholder="Ex: Equipe de prontidão"
                placeholderTextColor={colors.gray200}
                style={[styles.modalInput, styles.modalTextArea]}
                multiline
                numberOfLines={3}
              />

              {error.length > 0 && (
                <Text style={styles.modalError}>{error}</Text>
              )}

              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handleCreateChannel}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSubmitText}>Criar Canal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xxl,
  },

  title: {
    fontSize: fontSize['4xl'],
    fontWeight: '800',
    color: colors.black,
  },

  subtitle: {
    marginTop: spacing.xs,
    fontSize: fontSize.base,
    color: colors.gray400,
  },

  addButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  section: {
    marginBottom: spacing.xl,
  },

  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },

  channelIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.base,
  },

  channelInfo: {
    flex: 1,
  },

  channelName: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.black,
  },

  channelDescription: {
    marginTop: spacing.xs,
    fontSize: fontSize.md,
    color: colors.gray400,
  },

  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },

  membersText: {
    marginLeft: 5,
    fontSize: fontSize.sm,
    color: colors.gray400,
  },

  arrow: {
    marginLeft: spacing.sm,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.lg,
  },

  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: fontSize.md,
    lineHeight: 19,
    color: colors.gray600,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xxl,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  modalTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    color: colors.black,
  },

  modalForm: {
    gap: spacing.md,
  },

  inputLabel: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.dark,
  },

  modalInput: {
    height: 50,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.base,
    color: colors.black,
    borderWidth: 1,
    borderColor: colors.border,
  },

  modalTextArea: {
    height: 80,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },

  modalError: {
    color: colors.danger,
    fontSize: fontSize.md,
  },

  modalSubmitButton: {
    height: 52,
    backgroundColor: colors.dark,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },

  modalSubmitText: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
});
