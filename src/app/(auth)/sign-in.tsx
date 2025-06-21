import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useState } from 'react';
import Button from '@/components/Button';
import { supabase } from '@/lib/supabase';

const SignInPage = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colorPalette = Colors[colorScheme ?? 'light'];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signInWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      // redirecionar se quiser
    }

    setLoading(false);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colorPalette.background }]}
    >
      <Stack.Screen options={{ title: 'Login' }} />

      <Text style={[styles.title, { color: colorPalette.tint }]}>
        Bem-vindo de volta 👋
      </Text>

      <Text style={[styles.label, { color: colorPalette.text }]}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={[
          styles.input,
          { borderColor: colorPalette.border, color: colorPalette.text }
        ]}
        placeholder="seuemail@exemplo.com"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={[styles.label, { color: colorPalette.text }]}>Senha</Text>
      <TextInput
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={[
          styles.input,
          { borderColor: colorPalette.border, color: colorPalette.text }
        ]}
        placeholder="********"
        placeholderTextColor="#999"
      />

      <Button
        onPress={signInWithEmail}
        disabled={loading}
        text={loading ? 'Entrando...' : 'Entrar'}
      />

      <Text
        onPress={() => router.replace('/sign-up')}
        style={[styles.createLabel, { color: colorPalette.tint }]}
      >
        Não tem conta? Criar agora
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center'
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '500'
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
    backgroundColor: '#f5f5f5'
  },
  createLabel: {
    fontSize: 15,
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '600'
  }
});

export default SignInPage;
