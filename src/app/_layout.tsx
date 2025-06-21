import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import CartProvider from '@/providers/CartProvider';
import AuthProvider from '@/providers/AuthProvider';
import { useColorScheme } from '@/components/useColorScheme';
import QueryProvider from '@/providers/QueryProvider';
import NotificationProvider from '@/providers/NotificationProvider';

export {
  // Captura quaisquer erros gerados pelo componente Layout.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Garanta que o recarregamento em `/modal` mantenha um botão Voltar presente.
  initialRouteName: '(tabs)'
};

// Evita que a tela inicial seja ocultada automaticamente antes que o carregamento do ativo seja concluído.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font
  });

  // O Expo Router usa limites de erro para capturar erros na árvore de navegação.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <QueryProvider>
          <NotificationProvider>
            <CartProvider>
              <Stack>
                <Stack.Screen name="(user)" options={{ headerShown: false }} />
                <Stack.Screen name="(admin)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="cart"
                  options={{
                    presentation: 'modal',
                    animation: 'slide_from_left',
                    animationTypeForReplace: 'push'
                  }}
                />
              </Stack>
            </CartProvider>
          </NotificationProvider>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
