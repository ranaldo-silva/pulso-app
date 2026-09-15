import { useState } from 'react';
import { useRouter } from 'expo-router';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import UserCard from '../../components/UserCard';
import ChannelCard from '../../components/ChannelCard';
import PttButton from '../../components/PttButton';

export default function HomeScreen() {
  const router = useRouter();

  const [transmitting, setTransmitting] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>
              PULSO
            </Text>

            <Text style={styles.greeting}>
              Olá, Ronaldo
            </Text>
          </View>

          <View style={styles.onlineContainer}>
            <View style={styles.onlineDot} />

            <Text style={styles.onlineText}>
              Online
            </Text>
          </View>
        </View>

        {/* PTT */}

        <PttButton
          transmitting={transmitting}
          onPressIn={() => setTransmitting(true)}
          onPressOut={() => setTransmitting(false)}
        />

        {/* CONTATOS */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Contatos recentes
          </Text>

<UserCard
  name="João"
  status="Disponível"
  online={true}
  onCall={() => router.push('/call/joao')}
/>

<UserCard
  name="Carlos"
  status="Disponível"
  online={true}
  onCall={() => router.push('/call/carlos')}
/>

<UserCard
  name="Pedro"
  status="Offline"
  online={false}
  onCall={() => router.push('/call/pedro')}
/>
        </View>

        {/* CANAIS */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Seus canais
          </Text>

          <ChannelCard
            name="Equipe Operacional"
            members={12}
          />

          <ChannelCard
            name="Família"
            members={4}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  content: {
    padding: 20,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  logo: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
  },

  greeting: {
    marginTop: 4,
    fontSize: 15,
    color: '#666',
  },

  onlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  onlineDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#22c55e',
    marginRight: 6,
  },

  onlineText: {
    fontSize: 13,
    fontWeight: '600',
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
});