import { Stack, ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider, useSettings } from '@/context/SettingsContext';
import { ProductsProvider, useProducts } from '@/context/ProductsContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { SyncProvider } from '@/context/SyncContext';
import { ThemeContextProvider } from '@/context/ThemeContext';
import { syncExpiryNotifications } from '@/services/notifications';
import { useT } from '@/i18n';

/** Inner layout: needs access to settings for theme preference */
function AppStack() {
  const { settings } = useSettings();
  const { products, loading } = useProducts();
  const t = useT();
  const systemScheme = useNativeColorScheme();

  // Keep on-device expiry reminders in sync with the pantry and the toggle.
  // No-op on web; never throws.
  useEffect(() => {
    if (loading) return;
    syncExpiryNotifications(products, settings.notificationsEnabled);
  }, [products, settings.notificationsEnabled, loading]);

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
          <Stack.Screen name="add/index" options={{ title: t('route.add'), presentation: 'modal' }} />
          <Stack.Screen name="add/manual" options={{ title: t('route.addManual') }} />
          <Stack.Screen name="add/scan" options={{ title: t('route.scan') }} />
          <Stack.Screen name="add/qrcode" options={{ title: t('route.qrcode') }} />
          <Stack.Screen name="product/[id]" options={{ title: t('route.product') }} />
          <Stack.Screen name="recipe/[id]" options={{ title: t('route.recipe') }} />
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
