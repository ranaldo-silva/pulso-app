import { useState } from 'react';
import { useRouter } from 'expo-router';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/authStore';
import { colors, fontSize, radius, spacing } from '../../constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] =
    useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');

    if (!email.trim()) {
      setError('Informe seu email');
      return;
    }

    if (password.length < 4) {
      setError(
        'A senha deve ter pelo menos 4 caracteres'
      );
      return;
    }

    const success = await login(
      email,
      password
    );

    if (!success) {
      setError(
        useAuthStore.getState().errorMessage ||
          'Email ou senha inválidos'
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.content
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* LOGO */}

          <View style={styles.logoSection}>
            <View style={styles.logoIcon}>
              <Ionicons
                name="radio"
                size={40}
                color={colors.white}
              />
            </View>

            <Text style={styles.logo}>
              PULSO
            </Text>

            <Text style={styles.subtitle}>
              Comunicação em tempo real
            </Text>
          </View>

          {/* FORM */}

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Email
              </Text>

              <View
                style={styles.inputContainer}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.gray400}
                />

                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="seu@email.com"
                  placeholderTextColor={
                    colors.gray200
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Senha
              </Text>

              <View
                style={styles.inputContainer}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.gray400}
                />

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Sua senha"
                  placeholderTextColor={
                    colors.gray200
                  }
                  secureTextEntry={
                    !showPassword
                  }
                  style={styles.input}
                />

                <TouchableOpacity
                  onPress={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  <Ionicons
                    name={
                      showPassword
                        ? 'eye-off-outline'
                        : 'eye-outline'
                    }
                    size={20}
                    color={colors.gray400}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {error.length > 0 && (
              <View style={styles.errorBox}>
                <Ionicons
                  name="alert-circle"
                  size={16}
                  color={colors.danger}
                />

                <Text style={styles.errorText}>
                  {error}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                isLoading &&
                  styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator
                  color={colors.white}
                />
              ) : (
                <Text
                  style={styles.buttonText}
                >
                  Entrar
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* REGISTER LINK */}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Não tem uma conta?
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.push(
                  '/(auth)/register'
                )
              }
            >
              <Text style={styles.footerLink}>
                Cadastre-se
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },

  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },

  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  logo: {
    fontSize: fontSize['5xl'],
    fontWeight: '800',
    letterSpacing: 2,
    color: colors.black,
  },

  subtitle: {
    marginTop: spacing.sm,
    fontSize: fontSize.base,
    color: colors.gray400,
  },

  form: {
    marginBottom: spacing.xxl,
  },

  inputGroup: {
    marginBottom: spacing.lg,
  },

  label: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: spacing.sm,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  input: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: fontSize.base,
    color: colors.black,
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },

  errorText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.md,
    color: colors.danger,
  },

  button: {
    height: 52,
    backgroundColor: colors.dark,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: '700',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },

  footerText: {
    fontSize: fontSize.base,
    color: colors.gray400,
  },

  footerLink: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.primary,
  },
});
