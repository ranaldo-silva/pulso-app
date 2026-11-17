import { useState } from 'react';
import { useRouter } from 'expo-router';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/authStore';
import {
  colors,
  fontSize,
  radius,
  spacing,
  statusColors,
  statusLabels,
} from '../../constants/theme';

import type { UserStatus } from '../../types';

const statusOptions: UserStatus[] = [
  'online',
  'away',
  'busy',
  'offline',
];

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color?: string;
  onPress: () => void;
};

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateStatus } =
    useAuthStore();

  const [showStatusPicker, setShowStatusPicker] =
    useState(false);

  function handleLogout() {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  }

  const menuItems: MenuItem[] = [
    {
      icon: 'person-outline',
      label: 'Editar perfil',
      onPress: () =>
        console.log('Editar perfil'),
    },
    {
      icon: 'notifications-outline',
      label: 'Notificações',
      onPress: () =>
        console.log('Notificações'),
    },
    {
      icon: 'shield-outline',
      label: 'Privacidade',
      onPress: () =>
        console.log('Privacidade'),
    },
    {
      icon: 'information-circle-outline',
      label: 'Sobre o PULSO',
      onPress: () => console.log('Sobre'),
    },
  ];

  if (!user) {
    return null;
  }

  const currentStatus =
    user.status || 'online';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Perfil
          </Text>
        </View>

        {/* AVATAR + INFO */}

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name
                .charAt(0)
                .toUpperCase()}
            </Text>
          </View>

          <Text style={styles.name}>
            {user.name}
          </Text>

          <Text style={styles.email}>
            {user.email}
          </Text>

          {/* STATUS BADGE */}

          <TouchableOpacity
            style={styles.statusBadge}
            onPress={() =>
              setShowStatusPicker(
                !showStatusPicker
              )
            }
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    statusColors[
                      currentStatus
                    ],
                },
              ]}
            />

            <Text
              style={styles.statusBadgeText}
            >
              {statusLabels[currentStatus]}
            </Text>

            <Ionicons
              name={
                showStatusPicker
                  ? 'chevron-up'
                  : 'chevron-down'
              }
              size={16}
              color={colors.gray400}
            />
          </TouchableOpacity>

          {/* STATUS PICKER */}

          {showStatusPicker && (
            <View style={styles.statusPicker}>
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusOption,
                    currentStatus === status &&
                      styles.statusOptionActive,
                  ]}
                  onPress={() => {
                    updateStatus(status);
                    setShowStatusPicker(false);
                  }}
                >
                  <View
                    style={[
                      styles.statusOptionDot,
                      {
                        backgroundColor:
                          statusColors[status],
                      },
                    ]}
                  />

                  <Text
                    style={[
                      styles.statusOptionText,
                      currentStatus ===
                        status &&
                        styles.statusOptionTextActive,
                    ]}
                  >
                    {statusLabels[status]}
                  </Text>

                  {currentStatus ===
                    status && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* MENU */}

        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 &&
                  styles.menuItemBorder,
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color={
                  item.color || colors.dark
                }
              />

              <Text
                style={[
                  styles.menuItemText,
                  item.color && {
                    color: item.color,
                  },
                ]}
              >
                {item.label}
              </Text>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.gray200}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* LOGOUT */}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color={colors.danger}
          />

          <Text style={styles.logoutText}>
            Sair da conta
          </Text>
        </TouchableOpacity>

        {/* VERSION */}

        <Text style={styles.version}>
          PULSO v1.0.0
        </Text>
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
    marginBottom: spacing.xxl,
  },

  headerTitle: {
    fontSize: fontSize['4xl'],
    fontWeight: '800',
    color: colors.black,
  },

  profileCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  avatarText: {
    color: colors.white,
    fontSize: 36,
    fontWeight: '700',
  },

  name: {
    fontSize: fontSize['3xl'],
    fontWeight: '700',
    color: colors.black,
  },

  email: {
    marginTop: spacing.xs,
    fontSize: fontSize.base,
    color: colors.gray400,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
    backgroundColor: colors.background,
    gap: spacing.sm,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  statusBadgeText: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.dark,
  },

  statusPicker: {
    width: '100%',
    marginTop: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    overflow: 'hidden',
  },

  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },

  statusOptionActive: {
    backgroundColor: colors.primaryLight,
  },

  statusOptionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  statusOptionText: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.gray500,
  },

  statusOptionTextActive: {
    fontWeight: '600',
    color: colors.primary,
  },

  menuCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },

  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },

  menuItemText: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: '500',
    color: colors.dark,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },

  logoutText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.danger,
  },

  version: {
    textAlign: 'center',
    marginTop: spacing.xxl,
    fontSize: fontSize.sm,
    color: colors.gray200,
  },
});
