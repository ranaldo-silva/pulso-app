import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ChannelCardProps = {
  name: string;
  members: number;
  onPress?: () => void;
};

export default function ChannelCard({
  name,
  members,
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
          name="radio"
          size={24}
          color="#fff"
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>
          {name}
        </Text>

        <Text style={styles.members}>
          {members} {members === 1 ? 'participante' : 'participantes'}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={22}
        color="#999"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
  },

  members: {
    marginTop: 4,
    fontSize: 13,
    color: '#777',
  },
});

