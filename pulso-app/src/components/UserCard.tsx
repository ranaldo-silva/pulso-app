import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing } from '../constants/theme';

type UserCardProps = {
  name: string;
  status: string;
  online: boolean;
  statusColor?: string;
  onCall?: () => void;
  onPtt?: () => void;
};

export default function UserCard({
  name,
  status,
  online,
  statusColor,
  onCall,
  onPtt,
}: UserCardProps) {
  const dotColor = statusColor
    ? statusColor
    : online
      ? colors.success
      : colors.gray200;

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>
          {name}
        </Text>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: dotColor },
            ]}
          />

          <Text style={styles.status}>
            {status}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onPtt}
        >
          <Ionicons
            name="mic-outline"
            size={22}
            color={colors.dark}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onCall}
        >
          <Ionicons
            name="call-outline"
            size={22}
            color={colors.dark}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },

  info: {
    flex: 1,
    marginLeft: spacing.md,
  },

  name: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.black,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  status: {
    fontSize: fontSize.md,
    color: colors.gray500,
  },

  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },

  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
