import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
        }}
      />

      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contatos',
        }}
      />

      <Tabs.Screen
        name="channels"
        options={{
          title: 'Canais',
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
        }}
      />
    </Tabs>
  );
}