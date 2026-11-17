import { useMemo, useState, useEffect } from 'react';
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
import { useContactsStore } from '../../stores/contactsStore';
import { colors, fontSize, radius, spacing, statusColors } from '../../constants/theme';

export default function ContactsScreen() {
  const router = useRouter();
  const contacts = useContactsStore((s) => s.contacts);
  const fetchContacts = useContactsStore((s) => s.fetchContacts);

  useEffect(() => {
    fetchContacts();
  }, []);

  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) return contacts;

    return contacts.filter((c) =>
      c.name
        .toLowerCase()
        .includes(value)
    );
  }, [search, contacts]);

  const onlineCount = contacts.filter(
    (c) => c.status !== 'offline'
  ).length;

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
            <Text style={styles.title}>
              Contatos
            </Text>

            <Text style={styles.subtitle}>
              {onlineCount} online de{' '}
              {contacts.length}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              console.log('Adicionar contato')
            }
          >
            <Ionicons
              name="person-add"
              size={22}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>

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
            placeholderTextColor={
              colors.gray200
            }
            style={styles.searchInput}
          />

          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch('')}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.gray200}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* STATUS LEGEND */}

        <View style={styles.legend}>
          {(
            [
              'online',
              'away',
              'busy',
              'offline',
            ] as const
          ).map((status) => (
            <View
              key={status}
              style={styles.legendItem}
            >
              <View
                style={[
                  styles.legendDot,
                  {
                    backgroundColor:
                      statusColors[status],
                  },
                ]}
              />

              <Text
                style={styles.legendText}
              >
                {status === 'online'
                  ? 'Online'
                  : status === 'away'
                    ? 'Ausente'
                    : status === 'busy'
                      ? 'Ocupado'
                      : 'Offline'}
              </Text>
            </View>
          ))}
        </View>

        {/* LISTA */}

        <View style={styles.list}>
          {filtered.length > 0 ? (
            filtered.map((contact) => (
              <UserCard
                key={contact.id}
                name={contact.name}
                status={
                  contact.status === 'online'
                    ? 'Disponível'
                    : contact.status === 'away'
                      ? 'Ausente'
                      : contact.status ===
                          'busy'
                        ? 'Ocupado'
                        : 'Offline'
                }
                online={
                  contact.status !== 'offline'
                }
                statusColor={
                  statusColors[
                    contact.status
                  ]
                }
                onCall={() =>
                  router.push(
                    `/call/${contact.id}`
                  )
                }
                onPtt={() =>
                  router.push(
                    `/ptt/${contact.id}`
                  )
                }
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="search-outline"
                size={36}
                color={colors.gray200}
              />

              <Text
                style={styles.emptyTitle}
              >
                Nenhum contato encontrado
              </Text>

              <Text style={styles.emptyText}>
                Tente buscar com outro nome
              </Text>
            </View>
          )}
        </View>
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

  searchContainer: {
    height: 50,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  searchInput: {
    flex: 1,
    marginLeft: 9,
    fontSize: fontSize.base,
    color: colors.black,
  },

  legend: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  legendText: {
    fontSize: fontSize.sm,
    color: colors.gray400,
  },

  list: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyTitle: {
    marginTop: spacing.md,
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.gray500,
  },

  emptyText: {
    marginTop: spacing.xs,
    fontSize: fontSize.md,
    color: colors.gray300,
  },
});
