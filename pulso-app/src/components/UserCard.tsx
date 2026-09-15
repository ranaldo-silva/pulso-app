import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type UserCardProps = {
  name: string;
  status: string;
  online: boolean;
  onCall?: () => void;
  onPtt?: () => void;
};

export default function UserCard({
  name,
  status,
  online,
  onCall,
  onPtt,
}: UserCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              online ? styles.online : styles.offline,
            ]}
          />

          <Text style={styles.status}>{status}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onPtt}>
          <Ionicons
            name="mic-outline"
            size={24}
            color="#222"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onCall}>
          <Ionicons
            name="call-outline"
            size={24}
            color="#222"
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
    paddingVertical: 12,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  online: {
    backgroundColor: '#22c55e',
  },

  offline: {
    backgroundColor: '#999',
  },

  status: {
    fontSize: 13,
    color: '#666',
  },

  actions: {
    flexDirection: 'row',
    gap: 18,
  },
});