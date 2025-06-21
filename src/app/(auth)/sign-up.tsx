import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useState } from 'react';
import Button from '@/components/Button';
import { supabase } from '@/lib/supabase';
const SignUpPage = () => {
  const router = useRouter();

  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? 'light'].text;
  const bgColor = Colors[colorScheme ?? 'light'].text;

  const [email, setEmail] = useState('');
  const [full_name, setFull_Name] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signUpWIthEmail = async () => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: full_name
          }
        }
      });

      if (error) {
        console.log('Erro ao criar conta:', error); // Exibe no console para depuração
        Alert.alert('Erro', error.message); // Mensagem amigável para o usuário
        return;
      }

      Alert.alert(
        'Sucesso!',
        'Conta criada. Verifique seu e-mail para confirmar.'
      );
      router.replace('/sign-in');
    } catch (err) {
      console.error('Erro inesperado:', err);
      Alert.alert('Erro inesperado', 'Ocorreu um erro ao criar sua conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Sign up' }} />
      {/* Email */}
      <Text style={[styles.label, { color: textColor }]}>Nome Completo</Text>
      <TextInput
        value={full_name}
        onChangeText={setFull_Name}
        style={[styles.input, { backgroundColor: bgColor }]}
        placeholder="Nome Completo"
      ></TextInput>

      {/* Email */}
      <Text style={[styles.label, { color: textColor }]}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { backgroundColor: bgColor }]}
        placeholder="name@email.com"
      ></TextInput>

      {/* PW */}
      <Text style={[styles.label, { color: textColor }]}>Password</Text>
      <TextInput
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        style={[styles.input, { backgroundColor: bgColor }]}
        placeholder="********"
      ></TextInput>

      <Button
        disabled={loading}
        onPress={signUpWIthEmail}
        text={loading ? 'Criando...' : 'Criar Conta'}
      />
      <Text
        onPress={() => router.replace('/sign-in')}
        style={[styles.signinLabel, { color: textColor }]}
      >
        Sign in
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10
  },
  label: {
    fontSize: 16
  },
  signinLabel: {
    fontSize: 16,
    marginVertical: 10,
    alignSelf: 'center',
    fontWeight: 'bold'
  },
  input: {
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
    color: 'white'
  }
});

export default SignUpPage;
