import { StyleSheet, Text, View } from 'react-native';

export default function ChannelsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Canais</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});