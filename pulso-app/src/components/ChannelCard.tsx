import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '../constants/theme';

type ChannelCardProps = {
  name: string;
  members: number;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

export default function ChannelCard({
  name,
  members,
  icon = 'radio',
  onPress,
}: ChannelCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon}
          size={24}
          color={colors.white}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>
          {name}
        </Text>

        <Text style={styles.members}>
          {members}{' '}
          {members === 1
            ? 'participante'
            : 'participantes'}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={22}
        color={colors.gray200}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: radius.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm + 2,
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.black,
  },

  members: {
    marginTop: spacing.xs,
    fontSize: fontSize.md,
    color: colors.gray400,
  },
});
