import { View, TextInput, Switch, ScrollView, StyleSheet, Alert, Platform, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { useProducts } from '@/context/ProductsContext';
import { useSync } from '@/context/SyncContext';
import { Segmented } from '@/components/Segmented';
import { Select } from '@/components/Select';
import { Button } from '@/components/Button';
import { ChipMultiSelect } from '@/components/ChipMultiSelect';
import { IngredientMultiSelect } from '@/components/IngredientMultiSelect';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { DietTag, Allergen, CuisineTag } from '@/types';
import { DIET_TAG_LABELS, ALLERGEN_LABELS, CUISINE_LABELS } from '@/utils/diet';
import { useT } from '@/i18n';

const UNIT_OPTIONS = [
  { label: 'Unidade (un)', value: 'un' },
  { label: 'Quilograma (kg)', value: 'kg' },
  { label: 'Grama (g)', value: 'g' },
  { label: 'Litro (L)', value: 'L' },
  { label: 'Mililitro (ml)', value: 'ml' },
];

const DIET_TAG_OPTIONS = (Object.entries(DIET_TAG_LABELS) as [DietTag, string][]).map(
  ([value, label]) => ({ value, label }),
);

const ALLERGEN_OPTIONS = (Object.entries(ALLERGEN_LABELS) as [Allergen, string][]).map(
  ([value, label]) => ({ value, label }),
);

const CUISINE_OPTIONS = (Object.entries(CUISINE_LABELS) as [CuisineTag, string][]).map(
  ([value, label]) => ({ value, label }),
);

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.rowLabel}>{label}</ThemedText>
      <View style={styles.rowControl}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const theme = useTheme();
  const t = useT();
  const { settings, updateSettings } = useSettings();
  const { reseedProducts, clearProducts } = useProducts();
  const { enabled, user, syncing, lastSyncAt, error, signIn, signUp, signOut, syncNow } = useSync();

  const [syncEmail, setSyncEmail] = useState('');
  const [syncPassword, setSyncPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  function handleClearProducts() {
    const message = 'Tem certeza que deseja remover todos os produtos?';
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(message)) {
        clearProducts();
      }
      return;
    }
    Alert.alert(
      'Limpar Produtos',
      message,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: () => clearProducts() },
      ]
    );
  }

  async function handleSignIn() {
    if (!syncEmail.trim() || !syncPassword) return;
    setAuthLoading(true);
    await signIn(syncEmail.trim(), syncPassword);
    setAuthLoading(false);
  }

  async function handleSignUp() {
    if (!syncEmail.trim() || !syncPassword) return;
    setAuthLoading(true);
    await signUp(syncEmail.trim(), syncPassword);
    setAuthLoading(false);
  }

  function formatLastSync(iso: string | null): string {
    if (!iso) return 'Nunca';
    try {
      const d = new Date(iso);
      return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  }

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Appearance */}
      <ThemedText style={styles.sectionTitle}>{t('settings.appearance')}</ThemedText>
      <ThemedView type="backgroundElement" style={styles.section}>
        <SettingRow label={t('settings.theme')}>
          <Segmented
            options={[
              { label: t('settings.theme.system'), value: 'system' },
              { label: t('settings.theme.light'), value: 'light' },
              { label: t('settings.theme.dark'), value: 'dark' },
            ]}
            value={settings.themePreference}
            onChange={(v) => updateSettings({ themePreference: v as 'system' | 'light' | 'dark' })}
          />
        </SettingRow>
      </ThemedView>

      {/* Preferences */}
      <ThemedText style={styles.sectionTitle}>{t('settings.preferences')}</ThemedText>
      <ThemedView type="backgroundElement" style={styles.section}>
        <SettingRow label={t('settings.notifications')}>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(v) => updateSettings({ notificationsEnabled: v })}
            trackColor={{ true: theme.primary }}
          />
        </SettingRow>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <SettingRow label={t('settings.language')}>
          <Segmented
            options={[
              { label: 'Português', value: 'pt' },
              { label: 'English', value: 'en' },
            ]}
            value={settings.language}
            onChange={(v) => updateSettings({ language: v as 'pt' | 'en' })}
          />
        </SettingRow>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <SettingRow label={t('settings.units')}>
          <Segmented
            options={[
              { label: t('settings.units.metric'), value: 'metric' },
              { label: t('settings.units.imperial'), value: 'imperial' },
            ]}
            value={settings.measurementSystem}
            onChange={(v) => updateSettings({ measurementSystem: v as 'metric' | 'imperial' })}
          />
        </SettingRow>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <SettingRow label={t('settings.defaultUnit')}>
          <Select
            options={UNIT_OPTIONS}
            value={settings.defaultUnit}
            onChange={(v) => updateSettings({ defaultUnit: v })}
          />
        </SettingRow>
      </ThemedView>

      {/* Diet & Allergies */}
      <ThemedText style={styles.sectionTitle}>{t('settings.dietAllergies')}</ThemedText>
      <ThemedView type="backgroundElement" style={styles.section}>
        {/* Diet tag chips */}
        <ThemedText style={styles.subLabel}>{t('settings.dietPrefs')}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
          {t('settings.dietPrefs.hint')}
        </ThemedText>
        <ChipMultiSelect<DietTag>
          options={DIET_TAG_OPTIONS}
          values={settings.dietTags}
          onChange={(v) => updateSettings({ dietTags: v })}
        />

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Allergen chips */}
        <ThemedText style={styles.subLabel}>{t('settings.allergens')}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
          {t('settings.allergens.hint')}
        </ThemedText>
        <ChipMultiSelect<Allergen>
          options={ALLERGEN_OPTIONS}
          values={settings.allergens}
          onChange={(v) => updateSettings({ allergens: v })}
        />

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Avoid ingredients */}
        <ThemedText style={styles.subLabel}>{t('settings.avoid')}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
          {t('settings.avoid.hint')}
        </ThemedText>
        <IngredientMultiSelect
          values={settings.avoidIngredients}
          onChange={(v) => updateSettings({ avoidIngredients: v })}
        />

      </ThemedView>

      {/* Cuisines */}
      <ThemedText style={styles.sectionTitle}>{t('settings.cuisines')}</ThemedText>
      <ThemedView type="backgroundElement" style={styles.section}>
        <ThemedText style={styles.subLabel}>{t('settings.cuisines.label')}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
          {t('settings.cuisines.hint')}
        </ThemedText>
        <ChipMultiSelect<CuisineTag>
          options={CUISINE_OPTIONS}
          values={settings.cuisines}
          onChange={(v) => updateSettings({ cuisines: v })}
        />
      </ThemedView>

      {/* Cloud sync / account */}
      <ThemedText style={styles.sectionTitle}>{t('settings.account')}</ThemedText>

      {!enabled && (
        <ThemedView type="backgroundElement" style={styles.section}>
          <ThemedText style={styles.subLabel}>Sincronização na nuvem (opcional)</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
            O app funciona 100% offline sem nenhuma configuração. Para ativar a
            sincronização gratuita entre dispositivos:
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            1. Crie um projeto gratuito em supabase.com (sem cartão de crédito).
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            2. Execute o arquivo <ThemedText type="small" style={{ fontFamily: 'monospace' }}>supabase_schema.sql</ThemedText> no SQL Editor do Supabase.
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            3. Copie o arquivo <ThemedText type="small" style={{ fontFamily: 'monospace' }}>.env.example</ThemedText> para <ThemedText type="small" style={{ fontFamily: 'monospace' }}>.env</ThemedText> e preencha:
          </ThemedText>
          <ThemedText type="small" style={[styles.codeBlock, { backgroundColor: theme.backgroundElement, color: theme.text }]}>
            {'EXPO_PUBLIC_SUPABASE_URL=...\nEXPO_PUBLIC_SUPABASE_ANON_KEY=...'}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Sem essas chaves o app continua funcionando normalmente, apenas local.
          </ThemedText>
        </ThemedView>
      )}

      {enabled && !user && (
        <ThemedView type="backgroundElement" style={styles.section}>
          <ThemedText style={styles.subLabel}>Entrar na conta</ThemedText>
          {!!error && (
            <ThemedText type="small" style={[styles.errorText, { color: '#D64545' }]}>
              {error}
            </ThemedText>
          )}
          <TextInput
            style={[
              styles.authInput,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="E-mail"
            placeholderTextColor={theme.textSecondary}
            value={syncEmail}
            onChangeText={setSyncEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!authLoading}
          />
          <TextInput
            style={[
              styles.authInput,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Senha"
            placeholderTextColor={theme.textSecondary}
            value={syncPassword}
            onChangeText={setSyncPassword}
            secureTextEntry
            autoComplete="password"
            editable={!authLoading}
          />
          <View style={styles.authButtons}>
            <Button
              title="Entrar"
              onPress={handleSignIn}
              loading={authLoading}
              disabled={!syncEmail.trim() || !syncPassword}
              style={styles.authButton}
            />
            <Button
              title="Criar conta"
              onPress={handleSignUp}
              variant="secondary"
              loading={authLoading}
              disabled={!syncEmail.trim() || !syncPassword}
              style={styles.authButton}
            />
          </View>
        </ThemedView>
      )}

      {enabled && !!user && (
        <ThemedView type="backgroundElement" style={styles.section}>
          <View style={styles.row}>
            <ThemedText style={styles.rowLabel}>Conta</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
              {user.email ?? user.id}
            </ThemedText>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.row}>
            <ThemedText style={styles.rowLabel}>Última sincronização</ThemedText>
            <View style={styles.rowControl}>
              {syncing ? (
                <ActivityIndicator size="small" color={theme.primary} />
              ) : (
                <ThemedText type="small" themeColor="textSecondary">
                  {formatLastSync(lastSyncAt)}
                </ThemedText>
              )}
            </View>
          </View>
          {!!error && (
            <ThemedText type="small" style={[styles.errorText, { color: '#D64545' }]}>
              {error}
            </ThemedText>
          )}
          <Button
            title="Sincronizar agora"
            onPress={syncNow}
            loading={syncing}
            disabled={syncing}
          />
          <Button
            title="Sair"
            onPress={signOut}
            variant="secondary"
            disabled={syncing}
          />
        </ThemedView>
      )}

      {/* Data management */}
      <ThemedText style={styles.sectionTitle}>{t('settings.data')}</ThemedText>
      <View style={styles.dataButtons}>
        <Button
          title={t('settings.data.reseed')}
          onPress={reseedProducts}
          variant="secondary"
        />
        <Button
          title={t('settings.data.clear')}
          onPress={handleClearProducts}
          variant="danger"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.two,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: Spacing.three,
    marginBottom: Spacing.one,
    opacity: 0.6,
  },
  subLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  hint: {
    marginBottom: Spacing.two,
  },
  section: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
    flexShrink: 0,
  },
  rowControl: {
    flex: 1,
    alignItems: 'flex-end',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.one,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.two,
    minHeight: 80,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  dataButtons: {
    gap: Spacing.two,
    marginBottom: Spacing.six,
  },
  codeBlock: {
    fontFamily: 'monospace',
    borderRadius: Spacing.one,
    padding: Spacing.two,
    marginVertical: Spacing.one,
    fontSize: 12,
  },
  errorText: {
    fontSize: 14,
  },
  authInput: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.two,
    fontSize: 16,
    height: 48,
  },
  authButtons: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  authButton: {
    flex: 1,
  },
});
