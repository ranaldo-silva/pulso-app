import { StyleSheet, Text, View } from 'react-native';

export default function PttScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PTT</Text>
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