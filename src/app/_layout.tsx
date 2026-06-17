import { Stack, ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider, useSettings } from '@/context/SettingsContext';
import { ProductsProvider } from '@/context/ProductsContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { SyncProvider } from '@/context/SyncContext';
import { ThemeContextProvider } from '@/context/ThemeContext';

/** Inner layout: needs access to settings for theme preference */
function AppStack() {
  const { settings } = useSettings();
  const systemScheme = useNativeColorScheme();

  // Resolve the effective scheme so that 'system' follows the OS setting.
  const effectiveScheme =
    settings.themePreference === 'system'
      ? systemScheme ?? 'light'
      : settings.themePreference;

  const navTheme = effectiveScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeContextProvider preference={settings.themePreference}>
      <ThemeProvider value={navTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="add/index" options={{ title: 'Adicionar Produto', presentation: 'modal' }} />
          <Stack.Screen name="add/manual" options={{ title: 'Adicionar Manualmente' }} />
          <Stack.Screen name="add/scan" options={{ title: 'Escanear Comprovante' }} />
          <Stack.Screen name="product/[id]" options={{ title: 'Produto' }} />
          <Stack.Screen name="recipe/[id]" options={{ title: 'Receita' }} />
        </Stack>
      </ThemeProvider>
    </ThemeContextProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SettingsProvider>
          <ProductsProvider>
            {/* SyncProvider must be inside ProductsProvider (uses useProducts) */}
            <SyncProvider>
              <FavoritesProvider>
                <AppStack />
              </FavoritesProvider>
            </SyncProvider>
          </ProductsProvider>
        </SettingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
