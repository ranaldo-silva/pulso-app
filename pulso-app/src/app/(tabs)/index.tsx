import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import UserCard from '../../components/UserCard';
import ChannelCard from '../../components/ChannelCard';
import PttButton from '../../components/PttButton';
import { useAuthStore } from '../../stores/authStore';
import { useContactsStore } from '../../stores/contactsStore';
import { useChannelsStore } from '../../stores/channelsStore';
import {
  colors,
  fontSize,
  radius,
  spacing,
  statusColors,
  statusLabels,
} from '../../constants/theme';

export default function HomeScreen() {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const contacts = useContactsStore((s) => s.contacts);
  const channels = useChannelsStore((s) => s.channels);

  const [transmitting, setTransmitting] = useState(false);
  const [search, setSearch] = useState('');

  const filteredContacts = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return contacts.slice(0, 5);
    }

    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(value)
    );
  }, [search, contacts]);

  const userName = user?.name || 'Usuário';
  const userStatus = user?.status || 'online';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>PULSO</Text>
            <Text style={styles.greeting}>Olá, {userName}</Text>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => console.log('Notificações')}
          >
            <Ionicons
              name="notifications-outline"
              size={23}
              color={colors.dark}
            />

            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* STATUS */}
        <TouchableOpacity
          style={styles.statusCard}
          onPress={() => router.push('/(tabs)/profile')}
          activeOpacity={0.8}
        >
          <View style={styles.statusLeft}>
            <View
              style={[
                styles.onlineDot,
                { backgroundColor: statusColors[userStatus] || colors.success },
              ]}
            />

            <View>
              <Text style={styles.statusTitle}>
                Você está {statusLabels[userStatus]?.toLowerCase() || 'online'}
              </Text>

              <Text style={styles.statusSubtitle}>
                {userStatus === 'online'
                  ? 'Disponível para chamadas'
                  : userStatus === 'busy'
                    ? 'Ocupado no momento'
                    : userStatus === 'away'
                      ? 'Ausente temporariamente'
                      : 'Invisível para contatos'}
              </Text>
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.gray400}
          />
        </TouchableOpacity>

        {/* BUSCA */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={21}
            color={colors.gray400}
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar contato"
            placeholderTextColor={colors.gray200}
            style={styles.searchInput}
          />

          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.gray200}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* PTT RAPIDO */}
        <View style={styles.pttSection}>
          <Text style={styles.sectionTitle}>Comunicação rápida</Text>

          <PttButton
            transmitting={transmitting}
            onPressIn={() => setTransmitting(true)}
            onPressOut={() => setTransmitting(false)}
          />
        </View>

        {/* CONTATOS RECENTES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Contatos recentes</Text>

            <TouchableOpacity onPress={() => router.push('/(tabs)/contacts')}>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardContainer}>
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <UserCard
                  key={contact.id}
                  name={contact.name}
                  status={
                    contact.status === 'online'
                      ? 'Disponível'
                      : contact.status === 'away'
                        ? 'Ausente'
                        : contact.status === 'busy'
                          ? 'Ocupado'
                          : 'Offline'
                  }
                  online={contact.status !== 'offline'}
                  statusColor={statusColors[contact.status]}
                  onCall={() => router.push(`/call/${contact.id}`)}
                  onPtt={() => router.push(`/ptt/${contact.id}`)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons
                  name="search-outline"
                  size={30}
                  color={colors.gray200}
                />

                <Text style={styles.emptyText}>
                  Nenhum contato encontrado
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* CANAIS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Seus canais</Text>

            <TouchableOpacity onPress={() => router.push('/(tabs)/channels')}>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {channels.slice(0, 3).map((channel) => (
            <ChannelCard
              key={channel.id}
              name={channel.name}
              members={channel.members.length}
              icon={channel.icon as keyof typeof Ionicons.glyphMap}
              onPress={() => router.push(`/channel/${channel.id}`)}
            />
          ))}
        </View>

        <View style={styles.bottomSpace} />
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  logo: {
    fontSize: fontSize['5xl'],
    fontWeight: '800',
    letterSpacing: 1.5,
    color: colors.black,
  },

  greeting: {
    marginTop: spacing.xs,
    fontSize: fontSize.base,
    color: colors.gray400,
  },

  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  notificationBadge: {
    position: 'absolute',
    top: 7,
    right: 7,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },

  notificationBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
  },

  statusCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  onlineDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    marginRight: 11,
  },

  statusTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.dark,
  },

  statusSubtitle: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.gray400,
  },

  searchContainer: {
    height: 50,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },

  searchInput: {
    flex: 1,
    marginLeft: 9,
    fontSize: fontSize.base,
    color: colors.black,
  },

  pttSection: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },

  section: {
    marginBottom: spacing.xxl,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  sectionTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    color: colors.black,
  },

  seeAll: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary,
  },

  cardContainer: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
  },

  emptyState: {
    padding: spacing.xxl,
    alignItems: 'center',
  },

  emptyText: {
    marginTop: spacing.sm,
    fontSize: fontSize.md,
    color: colors.gray300,
  },

  bottomSpace: {
    height: spacing.xl,
  },
});
